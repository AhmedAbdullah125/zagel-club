"use client"
import React, { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import LicenseHero from "../License/LicenseHero";
import ComplaintCard from "./ComplaintCard";
import { Button } from "../ui/button";
import ComplaintModal from "../Orders/ComplaintModal";
import CongatsCard from "../global/CongatsCard";
import ContactHero from "../Contact/ContactHero";
import { useGetComplaints } from "../Requests/useGetComplaints";

export default function ComplaintWrapper() {
    const [lang, setLang] = useState('ar');
    const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState(null);
    const { data: complaintsResponse, isLoading } = useGetComplaints(lang, page, status)

    // Extract pagination metadata
    const complaints = complaintsResponse?.data || [];
    const paginate = complaintsResponse?.paginate || {};
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
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang'));
        }
    }, []);

    const handleOpenComplaintModal = () => {
        setIsComplaintModalOpen(true);
    };

    const handleCloseComplaintModal = () => {
        setIsComplaintModalOpen(false);
    };

    const handleComplaintSuccess = () => {
        setShowSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };


    return (
        <div className="news-wrapper-cont" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <ContactHero lang={lang} subtitle={t(lang, "my_complaints_title")} />

            <div className="container">
                <div className="btns-wrapper">
                    <Button
                        className="new-complaint-btn"
                        onClick={handleOpenComplaintModal}
                        style={{
                            backgroundColor: "#1B8354",
                            color: "white",
                            padding: "12px 24px",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: "600",
                            marginBottom: "24px"
                        }}
                    >
                        {t(lang, 'new_complaint_btn')}
                    </Button>

                    <div className="sub-btns-cont">
                        <button
                            className={`sub-filter-btn ${status === 'new' ? 'active' : ''}`}
                            onClick={() => setStatus('new')}
                        >
                            {t(lang, 'complaint_status_new')}
                        </button>
                        <button
                            className={`sub-filter-btn ${status === 'in_progress' ? 'active' : ''}`}
                            onClick={() => setStatus('in_progress')}
                        >
                            {t(lang, 'complaint_status_processing')}
                        </button>
                        <button
                            className={`sub-filter-btn ${status === 'replied' ? 'active' : ''}`}
                            onClick={() => setStatus('replied')}
                        >
                            {t(lang, 'complaint_status_replied')}
                        </button>
                    </div>
                </div>

                {
                    isLoading ? <span className="loader-btn"></span> :
                        complaints.length > 0 ?
                            <>
                                <div className="auctions-grid">
                                    {complaints.map((complaint) => (
                                        <div key={complaint.id}>
                                            <ComplaintCard complaint={complaint} lang={lang} />
                                        </div>
                                    ))}
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
                            </>
                            :
                            <p className="no-orders">{t(lang, "no_complaints")}</p>
                }
            </div>

            <ComplaintModal
                isOpen={isComplaintModalOpen}
                onClose={handleCloseComplaintModal}
                onSuccess={handleComplaintSuccess}
                lang={lang}
                requestId={null}

            />

            {showSuccess && (
                <CongatsCard
                    title={t(lang, "congratulations")}
                    description={t(lang, "complaint_sent_successfully")}
                />
            )}
        </div>
    )
}