"use client"
import React, { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import OrderCard from "./OrderCard";
import { useGetOrders } from "../Requests/useGetOrders";
import Loading from "@/src/app/loading";

export default function MyOrdersWrapper() {
    const [lang, setLang] = useState('ar');
    const [subFilter, setSubFilter] = useState('pending');
    const [page, setPage] = useState(1);
    // [ pending, accepted, current, finished, cancelled ]
    const { data: orders, isLoading } = useGetOrders(lang, subFilter, page);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang'));
        }

    }, []);
    const paginate = orders?.paginate || {};
    const totalPages = paginate.lastPage || 1;
    const currentPage = paginate.currentPage || 1;
    const perPage = paginate.perPage || 20;
    const total = paginate.total || 0;
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
        <div className="news-wrapper-cont my-orders-wrapper" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>

            <div className="container">
                <div className="btns-wrapper">
                    <div className="orders-header-d">
                        <h2>{t(lang, 'follow_up_orders')}</h2>
                        <p>{t(lang, 'follow_up_orders_description')}</p>
                    </div>
                    <div className="sub-btns-cont">
                        <button
                            className={`sub-filter-btn ${subFilter === 'pending' ? 'active' : ''}`}
                            onClick={() => {
                                setSubFilter('pending')
                                setPage(1)
                            }}
                        >
                            {t(lang, 'new_orders')}
                        </button>
                        <button
                            className={`sub-filter-btn ${subFilter === 'accepted' ? 'active' : ''}`}
                            onClick={() => {
                                setSubFilter('accepted')
                                setPage(1)
                            }}
                        >
                            {t(lang, 'accepted_orders')}
                        </button>
                        <button
                            className={`sub-filter-btn ${subFilter === 'current' ? 'active' : ''}`}
                            onClick={() => {
                                setSubFilter('current')
                                setPage(1)
                            }}
                        >
                            {t(lang, 'current_orders')}
                        </button>
                        <button
                            className={`sub-filter-btn ${subFilter === 'finished' ? 'active' : ''}`}
                            onClick={() => {
                                setSubFilter('finished')
                                setPage(1)
                            }}
                        >
                            {t(lang, 'finished_orders')}
                        </button>
                        <button
                            className={`sub-filter-btn ${subFilter === 'cancelled' ? 'active' : ''}`}
                            onClick={() => {
                                setSubFilter('cancelled')
                                setPage(1)
                            }}
                        >
                            {t(lang, 'cancelled_orders_filter')}
                        </button>
                    </div>
                </div>

                {
                    isLoading ? <p className="no-orders"><span className="loader-btn"></span></p> :
                        orders?.data?.length > 0 ?
                            <div className="auctions-grid">
                                {
                                    orders?.data?.map((order) => (
                                        <div key={order.id}>
                                            <OrderCard order={order} lang={lang} />
                                        </div>
                                    ))
                                }
                            </div>
                            : <p className="no-orders">{t(lang, 'no_orders_found')}</p>

                }


                {totalPages > 1 && (
                    <div className="players-pagination">
                        <div className="pagination-info">
                            {t(lang, "showing")} {orders?.data?.length} {t(lang, "of")} {totalPages} {t(lang, "pages")}
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
    )
}