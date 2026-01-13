"use client"
import React, { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import ContactHero from "../Contact/ContactHero";
import Image from "next/image";
import bill from '@/src/assets/images/bill.svg';
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { useGetNotifications } from "../Requests/useGetNotifications";
import Loading from "@/src/app/loading";
import { deleteNotification } from "../Requests/deleteNotification";
import { useGetProfile } from "../Requests/useGetProfile";
import { toggleNotifications } from "../Requests/toggleNotifications";

export default function NotificationsWrapper() {
    const [lang, setLang] = useState('ar');
    const [page, setPage] = useState(1);
    const { data: apiResponse, isLoading: notificationsLoading } = useGetNotifications(lang, page);
    const notificationsData = apiResponse?.data || [];
    const paginate = apiResponse?.paginate || {};
    const [notifications, setNotifications] = useState([]);
    const { data: profile, isLoading: profileLoading } = useGetProfile(lang)
    const [isNotify, setIsNotify] = useState(profile?.isNotify);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang'));
        }
        setNotifications(notificationsData);
        setIsNotify(profile?.isNotify);
    }, [notificationsData, profile]); // Include profile to update isNotify correctly

    const deleteNotificationHandler = (id) => {
        deleteNotification(id, lang, false).then(() => {
            setNotifications(notifications.filter(notif => notif.id !== id));
        });
    };

    const deleteAllNotifications = () => {
        deleteNotification("all", lang, true).then(() => {
            setNotifications([]);
        });
    };

    const [selectedNotification, setSelectedNotification] = useState(null);

    const totalPages = paginate.lastPage || 1;
    const currentPage = paginate.currentPage || 1;
    const perPage = paginate.perPage || 20;

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage === 1) pages.push(1, 2, 3);
            else if (currentPage === totalPages) pages.push(totalPages - 2, totalPages - 1, totalPages);
            else pages.push(currentPage - 1, currentPage, currentPage + 1);
        }
        return pages;
    };

    return (
        <div className="home-page-content" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <ContactHero lang={lang} subtitle={t(lang, "notifications")} />

            {/* Notification Details Modal */}
            {selectedNotification && (
                <div className="modal-overlay" onClick={() => setSelectedNotification(null)}>
                    <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="terms-modal-close"
                            onClick={() => setSelectedNotification(null)}
                            type="button"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                        </button>

                        <div className="terms-modal-content">
                            <h3 className="terms-modal-subtitle text-lg font-bold mb-4">{selectedNotification.title}</h3>
                            <p className="terms-modal-text text-gray-600">
                                {selectedNotification.message}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {
                notificationsLoading || profileLoading ? <Loading /> :
                    <div className="container">
                        <div className="notifications-wrapper">
                            {/* Header Controls */}
                            <h2 className="notifications-title">{t(lang, "notifications")}</h2>
                            <div className="notifications-header">
                                <div className="notifications-toggle" style={{ direction: "ltr" }}>
                                    <Switch
                                        checked={isNotify}
                                        onCheckedChange={() => toggleNotifications(lang, setIsNotify)}
                                        className="notification-switch"
                                    />
                                    <span className="toggle-label">{t(lang, "enable_notifications")}</span>
                                </div>
                                {
                                    notifications.length > 0 && (
                                        <button className="delete-all-btn" onClick={deleteAllNotifications} >
                                            {t(lang, "delete_all")}
                                        </button>
                                    )
                                }
                            </div>
                            <div className="notifications-list">
                                {notifications.length === 0 ? (
                                    <div className="no-notifications">
                                        <p>{t(lang, "no_notifications")}</p>
                                    </div>
                                ) : (
                                    notifications?.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="notification-card cursor-pointer hover:bg-gray-50 transition-colors"
                                            onClick={() => setSelectedNotification(notification)}
                                        >
                                            <div className="notification-icon">
                                                <Image src={bill} alt="notification" width={40} height={40} />
                                            </div>
                                            <div className="notification-content">
                                                <p className="notification-message">{notification.title}</p>
                                                <span className="notification-time">{notification.timeAdd}</span>
                                            </div>
                                            <button
                                                className="delete-notification-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotificationHandler(notification.id);
                                                }}
                                            >
                                                <Trash2 size={20} />
                                            </button>

                                        </div>
                                    ))
                                )}
                            </div>

                            {totalPages > 1 && (
                                <div className="players-pagination">
                                    <div className="pagination-info">
                                        {t(lang, "showing")} {perPage} {t(lang, "of")} {totalPages} {t(lang, "pages")}
                                    </div>

                                    <div className="pagination-controls">
                                        <button
                                            className="pagination-arrow"
                                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            {"‹"}
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
                                                <button className="pagination-number" onClick={() => setPage(totalPages)}>{totalPages}</button>
                                            </>
                                        )}

                                        <button
                                            className="pagination-arrow"
                                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            {"›"}
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
            }
        </div>
    )
}