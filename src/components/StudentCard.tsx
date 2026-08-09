import { UserInfoType } from "@/lib/types&interfaces"
import { memo } from "react"

const StudentCard = ({ userInfo }: { userInfo: UserInfoType }) => {
    return (
        <div className='w-full min-h-60 relative overflow-hidden rounded-lg'>
            <div className='w-full h-full absolute z-[2] top-0 left-0 overflow-hidden rounded-lg'>
                <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_98039_1822" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="-133" width="600" height="600">
                        <rect y="-132.444" width="800" height="509.889" fill="#111624" />
                    </mask>
                    <g mask="url(#mask0_98039_1822)">
                        <rect x="-49" y="-193" width="800" height="631" fill="url(#paint0_linear_98039_1822)" />
                        <g opacity="0.1" filter="url(#filter0_f_98039_1822)">
                            <ellipse cx="135.878" cy="261.07" rx="135.878" ry="261.07" transform="matrix(0.97952 -0.201348 0.209067 0.977901 -148 -79.2825)" fill="#FD51E8" />
                        </g>
                        <g opacity="0.1" filter="url(#filter1_f_98039_1822)">
                            <ellipse cx="187.566" cy="261.07" rx="187.566" ry="261.07" transform="matrix(-0.97952 -0.201348 -0.209067 0.977901 646.61 -78.4683)" fill="#35FFF8" />
                        </g>
                        <g opacity="0.1" filter="url(#filter2_f_98039_1822)">
                            <ellipse cx="187.566" cy="261.07" rx="187.566" ry="261.07" transform="matrix(-0.97952 -0.201348 -0.209067 0.977901 550.611 -78.4683)" fill="#35FFF8" />
                        </g>
                        <g opacity="0.11" filter="url(#filter3_f_98039_1822)">
                            <ellipse cx="142.147" cy="67.1047" rx="142.147" ry="67.1047" transform="matrix(0.0875037 -0.996164 0.996823 0.0796448 79 274.056)" fill="#FD51E8" />
                        </g>
                    </g>
                    <defs>
                        <filter id="filter0_f_98039_1822" x="-144.214" y="-148.125" width="367.78" height="593.568" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="20" result="effect1_foregroundBlur_98039_1822" />
                        </filter>
                        <filter id="filter1_f_98039_1822" x="176.595" y="-159.047" width="463.421" height="596.227" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="20" result="effect1_foregroundBlur_98039_1822" />
                        </filter>
                        <filter id="filter2_f_98039_1822" x="80.5957" y="-159.047" width="463.421" height="596.227" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="20" result="effect1_foregroundBlur_98039_1822" />
                        </filter>
                        <filter id="filter3_f_98039_1822" x="50.2793" y="-43.9067" width="216.101" height="363.41" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="20" result="effect1_foregroundBlur_98039_1822" />
                        </filter>
                        <linearGradient id="paint0_linear_98039_1822" x1="-21.5" y1="-8.49998" x2="477" y2="231.5" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#090C15" />
                            <stop offset="1" stop-color="#080B17" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div className='w-full h-full absolute z-[3] top-0 left-0 overflow-hidden rounded-lg opacity-40'>
                <img src="/noise.webp" alt="noise" className="w-full h-full" />
            </div>

            <div className="w-full rounded-2xl shadow-2xl text-white relative z-[4] overflow-hidden py-3">
                <div className="w-full flex items-center mb-6 relative">
                    <div className='absolute top-0 left-5'>
                        <img src="/cardLogo.png" alt="Logo" className="w-16 h-16 rounded-full object-cover" />
                    </div>
                    <div className='w-full flex justify-center items-start flex-col gap-y-1'>
                        <h1 className="w-full text-2xl font-bold text-center pl-16">GICCL - Library</h1>
                        <div className="w-full bg-white/10 h-[3px]"></div>
                        <p className="w-full text-sm text-gray-300 text-center pl-16 py-0.5">Empowering Dreams, Inspiring Futures</p>
                        <div className="w-full bg-white/10 h-[3px]"></div>
                    </div>
                </div>

                <div className="flex px-5">
                    <div className="w-max h-max p-1 bg-[#F3F3F3]/20 rounded-lg">
                        <img src="/dummyUserImage.webp" alt="Profile" className="w-24 h-24 rounded-lg object-cover" />
                    </div>

                    <div className="flex-1 pl-6 flex flex-col justify-between">
                        <div className="space-y-1">
                            <p className="text-sm text-white/70">Student ID:&nbsp;
                                <span className='font-semibold text-simple'>{userInfo?.studentId}</span>
                            </p>
                            <p className="text-sm text-white/70">Full Name:&nbsp;
                                <span className='font-semibold text-simple'>{userInfo?.name}</span>
                            </p>
                            <p className="text-sm text-white/70">Email:&nbsp;
                                <span className='font-semibold text-simple w-40 truncate'>{userInfo?.email}</span>
                            </p>
                            <p className="text-sm text-white/70">Date of Birth:&nbsp;
                                <span className='font-semibold text-simple'>{userInfo?.class}</span>
                            </p>
                            <p className="text-sm text-white/70">Contact no:&nbsp;
                                <span className='font-semibold text-simple'>{userInfo?.phoneNumber || "Not provided"}</span>
                            </p>
                        </div>

                        {/* <div className="flex justify-end mt-4">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?data=https://jsmastery.pro&size=100x100" alt="QR Code" className="w-24 h-24" />
                </div> */}
                    </div>
                </div>

                <div className="mt-6 border-0 border-t-3 border-white/10 pt-4 flex flex-col md:flex-row justify-between px-5 text-xs">
                    <div>University No: <span className="font-semibold">(042) 4560-7890</span></div>
                    <div>Website: <a href="https://jsmastery.pro" className="text-blue-400 underline">www.jsmastery.pro</a></div>
                </div>
            </div>
        </div>)
}

export default memo(StudentCard)