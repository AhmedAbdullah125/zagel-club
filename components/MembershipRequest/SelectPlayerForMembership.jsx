"use client"
import React, { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import searchIcon from "@/src/assets/images/magnifier.svg";
import { useGetPlayers } from "../Requests/useGetPlaters";
import Loading from "@/src/app/loading";

export default function SelectPlayerForMembership({ lang, selectedPlayer, setSelectedPlayer, setStep }) {
    const [page, setPage] = useState(1);
    const [keyWord, setKeyWord] = useState("");
    const { data: playersResponse, isLoading } = useGetPlayers(lang, page, keyWord);
    // Extract data from API response
    const players = playersResponse?.data || [];
    const paginate = playersResponse?.paginate || {};
    const totalPages = paginate.lastPage || 1;
    const currentPage = paginate.currentPage || 1;
    const perPage = paginate.perPage || 20;

    const handlePlayerSelect = (player) => {
        setSelectedPlayer(player);
    };

    const handleNext = () => {
        if (selectedPlayer) {
            setStep(2);
        }
    };

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
        <div className="select-player">

            <div className="container">
                <h2 className="select-player-title">{t(lang, "membership_title_2")}</h2>
                <p className="select-player-description">{t(lang, "select_player_description")}</p>
                <div className="select-player-content">
                    {/* Header Section */}
                    <div className="players-header">
                        <h2 className="players-title">{t(lang, "registered_players_list")}</h2>

                        {/* Search Input */}
                        <div className="search-wrapper">
                            <input
                                type="text"
                                placeholder={t(lang, "quick_search")}
                                value={keyWord}
                                onChange={(e) => setKeyWord(e.target.value)}
                                className="search-input"
                            />
                            <Image src={searchIcon} alt="Search" className="search-icon" />
                        </div>
                    </div>

                    {/* Players Table */}
                    {
                        isLoading ? <p className="no-orders"><span className="loader-btn"></span></p> :
                            <div className="players-table-wrapper">
                                <table className="players-table">
                                    <thead>
                                        <tr>

                                            <th>{t(lang, "full_player_name")}</th>
                                            <th>{t(lang, "national_id_number")}</th>
                                            <th>{t(lang, "birth_date")}</th>
                                            <th>{t(lang, "nationality")}</th>
                                            <th>{t(lang, "city")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {players.length > 0 ? (
                                            players.map((player) => (
                                                <tr key={player.id}>

                                                    <td className="flex items-center gap-2">
                                                        <div className="input-cont">
                                                            <input
                                                                type="radio"
                                                                name="selectedPlayer"
                                                                checked={selectedPlayer === player.id}
                                                                onChange={() => handlePlayerSelect(player.id)}
                                                                className="player-radio"
                                                            />
                                                        </div>

                                                        {player.fullName}</td>
                                                    <td>{player.nationalId}</td>
                                                    <td>{player.dateOfBirth}</td>
                                                    <td>{player.nationality}</td>
                                                    <td>{player.city}</td>
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
                    }

                    {/* Pagination Section */}
                    {totalPages > 0 && (
                        <div className="players-pagination">
                            <div className="pagination-info">
                                {t(lang, "showing")} {players.length} {t(lang, "of")} {totalPages} {t(lang, "pages")}
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
                {/* Action Buttons */}
                <Button
                    type="button"
                    onClick={handleNext}
                    className="submit-license-btn"
                    disabled={!selectedPlayer}
                >
                    {t(lang, "next")}
                </Button>
            </div>

        </div>
    );
}