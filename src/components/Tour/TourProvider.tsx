import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdminDetails } from '@/lib/AxiosCalls';
import {
    CHAPTERS,
    DEFAULT_CHAPTER_ID,
    NAV_PROGRESS_KEY,
    NAV_STEPS,
    TourChapter,
    TourStep,
    chapterById,
    chapterForRoute,
    chapterMatchesRoute,
    isNavTourAllowed,
} from './chapters';
import { clearChapterSeen, markChapterSeen, readTourProgress } from './storage';
import TourOverlay, { findTourTarget } from './TourOverlay';

interface TourContextValue {
    isActive: boolean;
    /** Chapters available from the current page, for a "restart tour" menu. */
    availableChapters: { id: string; label: string }[];
    startTour: (chapterId?: string) => void;
}

const TourContext = createContext<TourContextValue>({
    isActive: false,
    availableChapters: [],
    startTour: () => { },
});

// eslint-disable-next-line react-refresh/only-export-components
export const useTour = () => useContext(TourContext);

const POLL_MS = 250;
const MAX_ATTEMPTS = 60;
const RESCAN_DEBOUNCE_MS = 200;
const DESKTOP_WIDTH = 1024;

const isRendered = (el: HTMLElement | null) => !!el && el.getClientRects().length > 0;

/** Never fight a modal for the screen. */
const isDialogOpen = () => !!document.querySelector('[role="dialog"][data-state="open"]');

const isStepPresent = (step: TourStep) => !step.target || isRendered(findTourTarget(step.target));

const candidateSteps = (chapter: TourChapter, includeIntro: boolean, includeNav: boolean): TourStep[] => {
    const isDesktop = window.innerWidth >= DESKTOP_WIDTH;
    return [
        ...(includeIntro ? [chapter.intro] : []),
        ...(includeNav ? NAV_STEPS : []),
        ...chapter.steps,
        // The sidebar collapses into a drawer below lg, so its steps would
        // point at elements that are not on screen.
    ].filter((step) => !(step.group === 'nav' && !isDesktop));
};

const TourProvider = ({ children }: { children: React.ReactNode }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    // Progress is per librarian, so a shared desk machine doesn't leak state
    const { data: adminDetails } = useQuery<{ admin: { id: string } }>({
        queryKey: ['admin-details'],
        queryFn: getAdminDetails,
        enabled: !!token,
        staleTime: 1000 * 60 * 30,
    });
    const userId = adminDetails?.admin?.id ? String(adminDetails.admin.id) : null;

    const [activeChapter, setActiveChapter] = useState<TourChapter | null>(null);
    const [candidates, setCandidates] = useState<TourStep[]>([]);
    const [currentStepId, setCurrentStepId] = useState<string | null>(null);
    const [domRevision, setDomRevision] = useState(0);
    const [pendingChapterId, setPendingChapterId] = useState<string | null>(null);
    const [includedNav, setIncludedNav] = useState(false);

    const routeChapter = useMemo(() => chapterForRoute(pathname), [pathname]);

    const isFreshLoadRef = useRef(true);
    const loadedPathRef = useRef(pathname);
    const manualStartRef = useRef(false);
    const lastIndexRef = useRef(0);
    const autoStartedForRef = useRef<string | null>(null);

    // Steps whose targets are actually on screen right now
    const steps = useMemo(
        () => candidates.filter(isStepPresent),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [candidates, domRevision],
    );

    const index = useMemo(() => {
        if (steps.length === 0) return 0;
        const found = steps.findIndex((step) => step.id === currentStepId);
        return found >= 0 ? found : Math.min(lastIndexRef.current, steps.length - 1);
    }, [steps, currentStepId]);

    useEffect(() => { lastIndexRef.current = index; }, [index]);

    useEffect(() => {
        if (pathname !== loadedPathRef.current) isFreshLoadRef.current = false;
    }, [pathname]);

    // Auto-start a chapter the student hasn't seen on this page
    useEffect(() => {
        if (activeChapter || pendingChapterId || !userId) return;
        if (autoStartedForRef.current === pathname) return;

        const progress = readTourProgress(userId);
        if (!progress) return;

        if (routeChapter && !progress[routeChapter.id]) {
            autoStartedForRef.current = pathname;
            setPendingChapterId(routeChapter.id);
            return;
        }
        if (!progress[NAV_PROGRESS_KEY] && isNavTourAllowed(pathname) && window.innerWidth >= DESKTOP_WIDTH) {
            autoStartedForRef.current = pathname;
            setPendingChapterId(NAV_PROGRESS_KEY);
        }
    }, [activeChapter, pendingChapterId, routeChapter, pathname, userId]);

    // Wait for the page to actually render before opening the overlay
    useEffect(() => {
        if (!pendingChapterId || activeChapter) return;

        const chapter = pendingChapterId === NAV_PROGRESS_KEY
            ? routeChapter ?? chapterById(DEFAULT_CHAPTER_ID)
            : chapterById(pendingChapterId);

        if (!chapter) { setPendingChapterId(null); return; }
        if (!chapterMatchesRoute(chapter, pathname)) return;

        let cancelled = false;
        let attempts = 0;
        let timer: ReturnType<typeof setTimeout>;

        const poll = () => {
            if (cancelled) return;
            if (isDialogOpen()) { timer = setTimeout(poll, POLL_MS); return; }

            if (isRendered(findTourTarget(chapter.sentinel))) {
                const progress = readTourProgress(userId) || {};
                const chosen = candidateSteps(
                    chapter,
                    isFreshLoadRef.current || manualStartRef.current,
                    !progress[NAV_PROGRESS_KEY],
                );
                const present = chosen.filter(isStepPresent);
                manualStartRef.current = false;
                setPendingChapterId(null);

                // Nothing to point at — mark it seen rather than showing a
                // lone intro card with no context.
                if (!present.some((step) => step.target)) {
                    markChapterSeen(userId, chapter.id);
                    return;
                }

                lastIndexRef.current = 0;
                setIncludedNav(present.some((step) => step.group === 'nav'));
                setCandidates(chosen);
                setCurrentStepId(present[0].id);
                setActiveChapter(chapter);
                return;
            }

            attempts += 1;
            if (attempts >= MAX_ATTEMPTS) { setPendingChapterId(null); return; }
            timer = setTimeout(poll, POLL_MS);
        };

        timer = setTimeout(poll, POLL_MS);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [pendingChapterId, activeChapter, pathname, userId, routeChapter]);

    // Content loads async, so re-check which targets exist while running
    useEffect(() => {
        if (!activeChapter) return;
        let timer: ReturnType<typeof setTimeout>;
        const observer = new MutationObserver(() => {
            clearTimeout(timer);
            timer = setTimeout(() => setDomRevision((r) => r + 1), RESCAN_DEBOUNCE_MS);
        });
        observer.observe(document.body, { childList: true, subtree: true });
        return () => { observer.disconnect(); clearTimeout(timer); };
    }, [activeChapter]);

    const endTour = useCallback(() => {
        if (activeChapter) markChapterSeen(userId, activeChapter.id);
        if (includedNav) markChapterSeen(userId, NAV_PROGRESS_KEY);
        setActiveChapter(null);
        setCandidates([]);
        setCurrentStepId(null);
        setIncludedNav(false);
        setPendingChapterId(null);
        lastIndexRef.current = 0;
    }, [activeChapter, includedNav, userId]);

    // Every target vanished (e.g. the list emptied) — nothing left to show
    useEffect(() => {
        if (activeChapter && candidates.length > 0 && steps.length === 0) endTour();
    }, [activeChapter, candidates.length, steps.length, endTour]);

    useEffect(() => {
        if (activeChapter && !chapterMatchesRoute(activeChapter, pathname)) endTour();
    }, [activeChapter, pathname, endTour]);

    const startTour = useCallback((chapterId?: string) => {
        const chapter =
            (chapterId && chapterById(chapterId)) || chapterForRoute(pathname) || chapterById(DEFAULT_CHAPTER_ID);
        if (!chapter) return;

        clearChapterSeen(userId, chapter.id);
        manualStartRef.current = true;
        autoStartedForRef.current = chapter.route || pathname;
        setActiveChapter(null);
        setCandidates([]);
        setCurrentStepId(null);
        setPendingChapterId(chapter.id);
        if (!chapterMatchesRoute(chapter, pathname)) navigate(chapter.route);
    }, [pathname, navigate, userId]);

    const goNext = useCallback(() => {
        if (index >= steps.length - 1) { endTour(); return; }
        setCurrentStepId(steps[index + 1].id);
    }, [index, steps, endTour]);

    const goBack = useCallback(() => {
        if (index <= 0) return;
        setCurrentStepId(steps[index - 1].id);
    }, [index, steps]);

    const isActive = !!activeChapter && steps.length > 0;

    const value = useMemo<TourContextValue>(() => ({
        isActive,
        availableChapters: CHAPTERS.map(({ id, label }) => ({ id, label })),
        startTour,
    }), [isActive, startTour]);

    return (
        <TourContext.Provider value={value}>
            {children}
            {isActive && (
                <TourOverlay steps={steps} index={index} onNext={goNext} onBack={goBack} onClose={endTour} />
            )}
        </TourContext.Provider>
    );
};

export default TourProvider;
