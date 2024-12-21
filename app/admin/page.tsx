"use client";

import React, {useState} from "react";
import {db} from "@/.firebase/firebase";
import {addDoc, collection, serverTimestamp} from "firebase/firestore";

const AddSongPage: React.FC = () => {
    const [title, setTitle] = useState("");
    const [translator] = useState("Welder");
    const [contents, setContents] = useState("");
    const [message, setMessage] = useState("");

    const handleAddSong = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !translator || !contents) {
            setMessage("모든 필드를 채워주세요.");
            return;
        }

        try {
            await addDoc(collection(db, "songs"), {
                title,
                translator,
                contents,
                views: 0,
                createdAt: serverTimestamp(),
            });
            setMessage("데이터가 성공적으로 추가되었습니다.");
            setTitle("");
            setContents("");
        } catch (error) {
            console.error("Error adding document: ", error);
            setMessage("오류가 발생했습니다.");
        }
    };

    return (
        <section className="max-w-screen-md mx-auto p-12 text-center">
            <h1 className="text-2xl font-bold mb-6">찬양 번역본 추가</h1>
            <form onSubmit={handleAddSong} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="곡 제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border px-4 py-2 rounded"
                />
                <input
                    type="text"
                    placeholder="번역가"
                    value={translator}
                    readOnly
                    className="border px-4 py-2 rounded"
                />
                <textarea
                    placeholder="내용"
                    value={contents}
                    onChange={(e) => setContents(e.target.value)}
                    className="border px-4 py-2 rounded"
                    rows={5}
                ></textarea>
                <button
                    type="submit"
                    className="bg-[#FF9A3B] text-white px-4 py-2 rounded hover:bg-[#FE7F2D] transition-colors"
                >
                    추가
                </button>
                {message && <p className="text-sm text-red-500">{message}</p>}
            </form>
        </section>
    );
};

export default AddSongPage;
