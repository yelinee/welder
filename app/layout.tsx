"use client"

import './globals.css';
import Link from 'next/link';
import {usePathname} from "next/navigation";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <html lang="ko">
        <body>
        {/* 헤더 */}
        <header className="bg-white sticky top-0 z-10 shadow-md">
            <nav className="max-w-screen-xl mx-auto px-10">
                {/*max-width: 1280px(xl) 1024px(lg)*/}
                <div className="flex justify-between h-16 items-center gap-20">
                    {/* 로고 */}
                    <div className="brand-header">
                        <Link href="/" className="font-bold text-2xl">Welder</Link>
                    </div>

                    {/* 네비게이션 및 버튼 */}
                    <div className="flex justify-between items-center w-full">
                        <div className="flex gap-10">
                            <Link href="/home" className={`hover:text-[#FF9A3B] transition-colors ${
                                pathname === '/home' ? 'text-[#FF9A3B] font-semibold' : ''
                            }`}>Home</Link>
                            <Link href="/about" className={`hover:text-[#FF9A3B] transition-colors ${
                                pathname === '/about' ? 'text-[#FF9A3B] font-semibold' : ''
                            }`}>About us</Link>
                        </div>
                        <div className="flex items-center">
                            <Link href="#">
                                <button
                                    className="bg-black text-white px-4 py-2 border-0 rounded hover:bg-[#FF9A3B] transition-colors">Login
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>

        {/* 메인 컨텐츠 */}
        <main className="main">{children}</main>

        {/* 푸터 */}
        <footer className="mt-10">
            <div className="max-w-screen-xl mx-auto p-8 border border-white border-t-gray-400 text-gray-400 text-sm">© 2024.Welder all rights reserved.</div></footer>


        </body>
        </html>
    );
}