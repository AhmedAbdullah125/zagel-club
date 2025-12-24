"use client"
import React, { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Download, Share } from "lucide-react";
import Image from "next/image";
import files from "@/src/assets/images/files.svg";
import magnifier from "@/src/assets/images/magnifier.svg";
import Link from "next/link";
import CongatsCard from "../global/CongatsCard";
import { useGetPlayers } from "../Requests/useGetPlaters";
import Loading from "@/src/app/loading";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


export default function PlayersWrapper() {
    const [lang, setLang] = useState('ar');
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [Success, setSuccess] = useState(false);
    const [page, setPage] = useState(1);
    const [keyWord, setKeyWord] = useState('');

    const { data: playersResponse, isLoading } = useGetPlayers(lang, page, keyWord);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang') || 'ar');
        }
    }, []);

    // Debounce search input
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setKeyWord(searchQuery);
            setPage(1); // Reset to page 1 when searching
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleExport = async () => {
        try {
            setLoading(true);

            const rows = (players || []).map((p, idx) => ({
                "#": idx + 1,
                [t(lang, "player_full_name")]: p.fullName ?? "",
                [t(lang, "national_id_number")]: p.nationalId ?? "",
                [t(lang, "birth_date")]: p.dateOfBirth ?? "",
                [t(lang, "nationality")]: p.nationality ?? "",
                [t(lang, "city")]: p.city ?? "",
            }));

            const ws = XLSX.utils.json_to_sheet(rows);

            ws["!cols"] = [
                { wch: 6 },  // #
                { wch: 30 }, // name
                { wch: 18 }, // national id
                { wch: 16 }, // birth date
                { wch: 14 }, // nationality
                { wch: 18 }, // city
            ];

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Players");

            const arrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            const blob = new Blob([arrayBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const fileName = `players_${new Date().toISOString().slice(0, 10)}.xlsx`;
            saveAs(blob, fileName);

            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (e) {
            console.error("Export failed:", e);
        } finally {
            setLoading(false);
        }
    };

    const players = playersResponse?.data || [];
    const paginate = playersResponse?.paginate || {};
    const totalPages = paginate.lastPage || 1;
    const currentPage = paginate.currentPage || 1;
    const perPage = paginate.perPage || 20;
    const total = paginate.total || 0;

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 3;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 2) {
                pages.push(1, 2, 3);
            } else if (currentPage >= totalPages - 1) {
                pages.push(totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(currentPage - 1, currentPage, currentPage + 1);
            }
        }

        return pages;
    };

    return (
        <div className="players-wrapper" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
            {
                isLoading ? <Loading /> :
                    <div className="container">
                        <div className="players-inner">
                            <div className="players-header">
                                <div className="players-actions">
                                    <h1 className="players-title">{t(lang, "registered_players_list")}</h1>
                                    <div className="search-input-wrapper">
                                        <Input
                                            type="text"
                                            placeholder={t(lang, "search_list")}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="players-search-input"
                                        />
                                        <Image src={magnifier} alt="magnifier" />
                                    </div>
                                </div>
                                <Button onClick={handleExport} className="export-button">
                                    {
                                        loading ? <span className="loader-btn"></span> :
                                            <Share className="export-icon" />
                                    }
                                    <span>{t(lang, "export_to_excel")}</span>
                                </Button>
                            </div>

                            <div className="players-table-container">
                                <table className="players-table">
                                    <thead>
                                        <tr>
                                            <th>{t(lang, "player_full_name")}</th>
                                            <th>{t(lang, "national_id_number")}</th>
                                            <th>{t(lang, "birth_date")}</th>
                                            <th>{t(lang, "nationality")}</th>
                                            <th>{t(lang, "city")}</th>
                                            <th className="flex items-center justify-center"><Image src={files} alt="files" /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {players.length > 0 ? (
                                            players.map((player) => (
                                                <tr key={player.id}>
                                                    <td>{player.fullName}</td>
                                                    <td>{player.nationalId}</td>
                                                    <td>{player.dateOfBirth}</td>
                                                    <td>{player.nationality}</td>
                                                    <td>{player.city}</td>
                                                    <td>
                                                        <Link className="view-button" href={`/player/${player.id}`}>
                                                            <Eye className="view-icon" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                                                    {t(lang, "no_data_found")}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="players-pagination">
                                    <div className="pagination-info">
                                        {t(lang, "showing")} {perPage} {t(lang, "of")} {totalPages} {t(lang, "pages")}
                                    </div>
                                    <div className="pagination-controls">
                                        <button
                                            className="pagination-arrow"
                                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            {lang === "ar" ? "‹" : "›"}
                                        </button>

                                        {getPageNumbers().map(pageNum => (
                                            <button
                                                key={pageNum}
                                                className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                                                onClick={() => setPage(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}

                                        {totalPages > 3 && currentPage < totalPages - 1 && (
                                            <>
                                                <span className="pagination-dots">...</span>
                                                <button
                                                    className="pagination-number"
                                                    onClick={() => setPage(totalPages)}
                                                >
                                                    {totalPages}
                                                </button>
                                            </>
                                        )}

                                        <button
                                            className="pagination-arrow"
                                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            {lang === "ar" ? "›" : "‹"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
            }
            {
                Success && <CongatsCard title={t(lang, "congratulations")} description={t(lang, "export_success")} />
            }
        </div>
    );
}