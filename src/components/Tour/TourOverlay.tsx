import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { TourPlacement, TourStep } from './chapters';

type Rect = { top: number; left: number; width: number; height: number };
type Size = { w: number; h: number };

const SPOTLIGHT_PADDING = 8;
const GAP = 14;
const EDGE = 12;
const MAX_CARD_WIDTH = 340;
/** Keep re-measuring briefly so the card follows layout that is still settling. */
const SETTLE_MS = 700;
const TALL_RATIO = 0.75;
const TALL_TOP_MARGIN = 24;

const targetSelector = (target: string) => `[data-tour="${target}"]`;

export const findTourTarget = (target: string) =>
    typeof document === 'undefined' ? null : document.querySelector<HTMLElement>(targetSelector(target));

/** Scrolls the target into a comfortable position before highlighting it. */
const revealTarget = (el: HTMLElement, behavior: ScrollBehavior) => {
    el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const desired =
        r.height > vh * TALL_RATIO
            ? window.scrollY + r.top - TALL_TOP_MARGIN
            : window.scrollY + r.top + r.height / 2 - vh / 2;
    window.scrollTo({ top: Math.max(0, desired), behavior });
};

const resolvePlacement = (rect: Rect, preferred: TourPlacement, card: Size, vw: number, vh: number): TourPlacement => {
    const fitsBelow = rect.top + rect.height + GAP + card.h <= vh - EDGE;
    const fitsAbove = rect.top - GAP - card.h >= EDGE;
    const fitsRight = rect.left + rect.width + GAP + card.w <= vw - EDGE;
    const fitsLeft = rect.left - GAP - card.w >= EDGE;

    if (preferred === 'bottom' && !fitsBelow && fitsAbove) return 'top';
    if (preferred === 'top' && !fitsAbove && fitsBelow) return 'bottom';
    if (preferred === 'right' && !fitsRight) return fitsLeft ? 'left' : fitsBelow ? 'bottom' : 'top';
    if (preferred === 'left' && !fitsLeft) return fitsRight ? 'right' : fitsBelow ? 'bottom' : 'top';
    return preferred;
};

const clampLeft = (left: number, card: Size, vw: number) =>
    Math.min(Math.max(left, EDGE), Math.max(EDGE, vw - card.w - EDGE));

const placeCard = (rect: Rect, preferred: TourPlacement, card: Size, vw: number, vh: number) => {
    const maxTop = Math.max(EDGE, vh - card.h - EDGE);

    // Target too tall to sit beside — park the card at the bottom instead
    if (rect.height > vh - card.h - GAP * 2) {
        return { top: maxTop, left: clampLeft(rect.left + rect.width / 2 - card.w / 2, card, vw) };
    }

    const placement = resolvePlacement(rect, preferred, card, vw, vh);
    let top: number;
    let left: number;

    switch (placement) {
        case 'top':
            top = rect.top - card.h - GAP;
            left = rect.left + rect.width / 2 - card.w / 2;
            break;
        case 'left':
            top = rect.top + rect.height / 2 - card.h / 2;
            left = rect.left - card.w - GAP;
            break;
        case 'right':
            top = rect.top + rect.height / 2 - card.h / 2;
            left = rect.left + rect.width + GAP;
            break;
        default:
            top = rect.top + rect.height + GAP;
            left = rect.left + rect.width / 2 - card.w / 2;
    }

    return { top: Math.min(Math.max(top, EDGE), maxTop), left: clampLeft(left, card, vw) };
};

interface TourOverlayProps {
    steps: TourStep[];
    index: number;
    onNext: () => void;
    onBack: () => void;
    onClose: () => void;
}

const TourOverlay = ({ steps, index, onNext, onBack, onClose }: TourOverlayProps) => {
    const step = steps[index];
    const cardRef = useRef<HTMLDivElement>(null);
    const hasRevealedRef = useRef(false);
    const [rect, setRect] = useState<Rect | null>(null);
    const [cardSize, setCardSize] = useState<Size>({ w: MAX_CARD_WIDTH, h: 200 });
    const [viewport, setViewport] = useState<Size>(() => ({ w: window.innerWidth, h: window.innerHeight }));
    const [isPlaced, setIsPlaced] = useState(false);

    const isFirst = index === 0;
    const isLast = index === steps.length - 1;
    const isIntro = isFirst && !step?.target;
    const nextLabel = isLast ? 'Finish' : isIntro ? 'Start tour' : 'Next';

    const measure = useCallback(() => {
        if (!step?.target) return setRect(null);
        const el = findTourTarget(step.target);
        if (!el) return setRect(null);

        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return setRect(null);

        const next = {
            top: r.top - SPOTLIGHT_PADDING,
            left: r.left - SPOTLIGHT_PADDING,
            width: r.width + SPOTLIGHT_PADDING * 2,
            height: r.height + SPOTLIGHT_PADDING * 2,
        };
        // Only re-render when it actually moved, or the rAF loop thrashes
        setRect((prev) =>
            prev &&
                Math.abs(prev.top - next.top) < 0.5 &&
                Math.abs(prev.left - next.left) < 0.5 &&
                Math.abs(prev.width - next.width) < 0.5 &&
                Math.abs(prev.height - next.height) < 0.5
                ? prev
                : next,
        );
    }, [step?.target]);

    useLayoutEffect(() => {
        const syncViewport = () =>
            setViewport((prev) =>
                prev.w === window.innerWidth && prev.h === window.innerHeight
                    ? prev
                    : { w: window.innerWidth, h: window.innerHeight },
            );
        window.addEventListener('resize', syncViewport);
        return () => window.removeEventListener('resize', syncViewport);
    }, []);

    // Lock background scrolling while the tour drives the page
    useLayoutEffect(() => {
        const { body } = document;
        const previousOverflow = body.style.overflow;
        const previousPaddingRight = body.style.paddingRight;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        body.style.overflow = 'hidden';
        if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
        return () => {
            body.style.overflow = previousOverflow;
            body.style.paddingRight = previousPaddingRight;
        };
    }, []);

    useLayoutEffect(() => {
        if (!step) return;
        const el = step.target ? findTourTarget(step.target) : null;
        if (el) {
            revealTarget(el, hasRevealedRef.current ? 'smooth' : 'auto');
            hasRevealedRef.current = true;
        }
        measure();
    }, [step, measure]);

    // Track the target while scrolling/animation settles
    useEffect(() => {
        if (!step) return;
        let frame = 0;
        const startedAt = Date.now();
        const tick = () => {
            measure();
            if (Date.now() - startedAt < SETTLE_MS) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [step, measure]);

    useEffect(() => {
        window.addEventListener('scroll', measure, true);
        window.addEventListener('resize', measure);
        return () => {
            window.removeEventListener('scroll', measure, true);
            window.removeEventListener('resize', measure);
        };
    }, [measure]);

    useLayoutEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const next = { w: el.offsetWidth, h: el.offsetHeight };
        if (cardSize.w !== next.w || cardSize.h !== next.h) {
            setCardSize(next);
            return;
        }
        // Only fade in once we know where it belongs, so it never jumps
        if (!isPlaced && (!step?.target || rect)) setIsPlaced(true);
    });

    useEffect(() => {
        if (isPlaced) return;
        const timer = setTimeout(() => setIsPlaced(true), 400);
        return () => clearTimeout(timer);
    }, [isPlaced]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { e.preventDefault(); onClose(); }
            else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); onNext(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); onBack(); }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onNext, onBack, onClose]);

    const cardWidth = Math.min(MAX_CARD_WIDTH, viewport.w - EDGE * 2);

    const cardPosition = useMemo(() => {
        if (!rect) {
            return {
                top: Math.max(EDGE, viewport.h / 2 - cardSize.h / 2),
                left: Math.max(EDGE, viewport.w / 2 - cardWidth / 2),
            };
        }
        return placeCard(rect, step?.placement || 'bottom', { w: cardWidth, h: cardSize.h }, viewport.w, viewport.h);
    }, [rect, step?.placement, cardWidth, cardSize.h, viewport.w, viewport.h]);

    if (!step) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9000]" role="dialog" aria-modal="true" aria-label="Guided tour">
            {rect ? (
                // The huge spread shadow dims everything except this box, which
                // gives the spotlight effect without an SVG mask.
                <div
                    className="pointer-events-none absolute rounded-xl border-2 border-primary transition-all duration-300 ease-out"
                    style={{
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.62)',
                    }}
                />
            ) : (
                <div className="absolute inset-0 bg-black/60" />
            )}

            <div
                ref={cardRef}
                className="absolute rounded-2xl border border-border bg-card p-5 shadow-2xl transition-all duration-300 ease-out"
                style={{
                    top: cardPosition.top,
                    left: cardPosition.left,
                    width: cardWidth,
                    opacity: isPlaced ? 1 : 0,
                    transform: isPlaced ? 'scale(1)' : 'scale(0.98)',
                }}
            >
                <button
                    onClick={onClose}
                    aria-label="Close tour"
                    className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="mb-3 flex items-center gap-2 pr-6">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-300"
                            style={{ width: `${((index + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                    <span className="whitespace-nowrap text-[11px] font-medium text-muted-foreground">
                        {index + 1} of {steps.length}
                    </span>
                </div>

                <div key={step.id} className="animate-in fade-in duration-200">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">{step.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{step.body}</p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                    <button
                        onClick={onClose}
                        className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        {isLast ? 'Close' : 'Skip tour'}
                    </button>
                    <div className="flex items-center gap-2">
                        {!isFirst && (
                            <button
                                onClick={onBack}
                                className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent"
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={onNext}
                            className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
                        >
                            {nextLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default TourOverlay;
