"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Zoom from "@mui/material/Zoom";
import Fab from "@mui/material/Fab";
import UpIcon from "@mui/icons-material/KeyboardArrowUp";

// Fab 버튼의 스타일 정의
const fabOrangeStyle = {
    bgcolor: "#FF9A3B",
    color: "white",
    "&:hover": {
        bgcolor: "#FE7F2D",
    },
    position: "fixed",
    bottom: 16,
    right: 16,
};

// Song 타입 정의
interface Song {
    title: string;
    contents: string;
    translator: string;
    createdAt: string;
    views: number;
}

const SongDetailPage: React.FC = () => {
    const { id } = useParams();
    const [song, setSong] = useState<Song | null>(null); // Song 타입 사용
    const [showFab, setShowFab] = useState(false);

    useEffect(() => {
        const fetchSong = async () => {
            if (!id) return;

            try {
                // @ts-expect-error 'id' is expected to be a string
                const docRef = doc(db, "songs", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const songData = docSnap.data();

                    if (songData.createdAt && songData.createdAt.toDate) {
                        const createdAt = songData.createdAt.toDate();
                        songData.createdAt = createdAt.toLocaleDateString("ko-KR");
                    }

                    setSong(songData as Song);
                    await updateDoc(docRef, { views: (songData.views || 0) + 1 });
                }
            } catch (error) {
                console.error("Error fetching song:", error);
            }
        };

        fetchSong();
    }, [id]);

    useEffect(() => {
        const handleScroll = () => {
            setShowFab(window.scrollY > 200);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!song) {
        return (
            <section className="text-center py-12">
                <p className="text-lg text-gray-500">Loading...</p>
            </section>
        );
    }

    const { title, translator, contents, createdAt } = song;
    const [koreanTitle, englishTitle] = title.split(" | ");

    return (
        <section className="max-w-screen-lg mx-auto py-12 relative text-center">
            <div className="pb-6 border border-white border-b-gray-400">
                <h1 hidden>찬양 번역 데이터베이스</h1>
                <h2 className="text-3xl">{koreanTitle}</h2>
                <h2 className="text-xl mt-2">{englishTitle}</h2>
                <div className="text-gray-500 mt-6">
                    <span className="mr-3">{translator}</span>
                    <span>|</span>
                    <span className="ml-3">{createdAt}</span>
                </div>
            </div>
            <div className="mt-6">
                <p className="font-bold mb-6">
                    *[] 브라켓 안에 있는 가사들은 줄바꿈이 있으면 의미가 달라집니다. <br />
                    *대문자, 소문자, 구두점 등에 유의하여 작성했습니다. 늘 감사합니다! 🙏🏻
                </p>
                <p className="text-center text-lg leading-relaxed whitespace-pre-line">
                    {contents}
                </p>
            </div>

            {/* Fab 버튼 */}
            <Zoom in={showFab} unmountOnExit>
                <Fab onClick={scrollToTop} sx={fabOrangeStyle} aria-label="Scroll to top">
                    <UpIcon />
                </Fab>
            </Zoom>
        </section>
    );
};

export default SongDetailPage;
