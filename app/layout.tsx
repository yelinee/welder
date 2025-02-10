"use client"

import './globals.css';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const commentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (commentRef.current && !commentRef.current.contains(event.target as Node)) {
                setIsCommentOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleComment = () => {
        setIsCommentOpen((prev) => !prev);
    };

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
                        <div className="relative">
                            <button
                                className="flex justify-center items-center p-2 rounded-full hover:bg-black hover:bg-opacity-[0.04] cursor-pointer"
                                onClick={toggleComment}
                            >
                                <CommentOutlinedIcon/>
                            </button>
                            {/* 드롭다운 메뉴 */}
                            {isCommentOpen && (
                                <div
                                    ref={commentRef}
                                    className="absolute top-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg w-56 p-4 z-50"
                                >
                                    <p className="text-lg font-semibold mb-2">웰더팀과의 소통 창구</p>
                                    <p className="mb-2">
                                        시스템 준비 중입니다🛠️ <br/>
                                        조금만 기다려주세요:)
                                    </p>
                                    <textarea/>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>

        {/* 메인 컨텐츠 */}
        <main className="main">{children}</main>

        {/* 푸터 */}
        <footer className="mt-10">
            <div className="max-w-screen-xl mx-auto p-8 border border-white border-t-gray-400 text-gray-400 text-sm">©
                2024.Welder all rights reserved.
            </div>
        </footer>


        </body>
        </html>
    );
}