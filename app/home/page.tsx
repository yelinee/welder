"use client";

import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import TablePagination from "@mui/material/TablePagination";
import { db } from "@/.firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

// Song 타입 정의
interface Song {
    id: string;
    title: string;
    translator: string;
    views: number;
}

const HomePage: React.FC = () => {
    const [query, setQuery] = useState("");
    const [rows, setRows] = useState<Song[]>([]); // 타입 적용
    const [filteredRows, setFilteredRows] = useState<Song[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Firebase에서 데이터 가져오기
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const songsCollection = collection(db, "songs");
                const songsSnapshot = await getDocs(songsCollection);

                const songsData: Song[] = songsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Song[]; // 타입 단언

                setRows(songsData);
                setFilteredRows(songsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchSongs();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const filtered = rows.filter((row) =>
            row.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredRows(filtered);
        setPage(0);
    };

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <section className="w-full py-8">
            <section className="pt-12 pb-6 mx-auto max-w-screen-xl">
                <h1 className="text-2xl text-center mb-6">
                    Welder 찬양 데이터베이스에 오신 것을 환영합니다
                </h1>
                <form
                    onSubmit={handleSearch}
                    className="relative flex items-center justify-center max-w-lg mx-auto"
                >
                    <input
                        type="text"
                        placeholder="곡 제목 검색"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-6 py-3 bg-orange-100 text-gray-600 placeholder-orange-300 rounded-full
            border border-orange-300 shadow-md focus:bg-white focus:placeholder-gray-300
            focus:outline-none focus:border-gray-300 focus:shadow-gray-300 transition-all"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 bg-transparent text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                        <SearchIcon />
                    </button>
                </form>
            </section>
            <section className="py-6">
                <div className="overflow-auto mx-auto max-w-screen-xl px-14">
                    <p className="text-left mb-2">총 {filteredRows.length}곡</p>
                    <table className="table-auto w-full border-collapse">
                        <thead className="bg-[#FF9A3B] text-white shadow-md">
                        <tr>
                            <th className="p-3 font-semibold w-[10%]"></th>
                            <th className="p-3 text-left font-semibold w-[55%]">곡 제목</th>
                            <th className="p-3 text-left font-semibold w-[20%]">번역가</th>
                            <th className="p-3 font-semibold w-[15%]">조회수</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredRows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const [koreanTitle, englishTitle] = row.title.split(" | ");
                                return (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-gray-100 transition-colors"
                                    >
                                        <td className="p-3 text-center border-t">{index + 1}</td>
                                        <td className="p-3 text-left border-t">
                                            <Link
                                                href={`/song/${row.id}`}
                                                className="group hover:text-[#FF9A3B] transition-colors"
                                            >
                                                <span>{koreanTitle} | </span>
                                                <span className="text-gray-500 group-hover:text-[#FF9A3B] transition-colors">
                            {englishTitle}
                          </span>
                                            </Link>
                                        </td>
                                        <td className="p-3 text-left border-t">
                                            {row.translator}
                                        </td>
                                        <td className="p-3 text-center border-t">{row.views}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <TablePagination
                        component="div"
                        count={filteredRows.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            </section>
        </section>
    );
};

export default HomePage;
