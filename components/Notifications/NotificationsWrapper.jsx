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
    const { data: notificationsData, isLoading: notificationsLoading } = useGetNotifications(lang)
    const [notifications, setNotifications] = useState(notificationsData || []);
    const { data: profile, isLoading: profileLoading } = useGetProfile(lang)
    const [isNotify, setIsNotify] = useState(profile?.isNotify);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang'));
        }
        setNotifications(notificationsData || []);
        setIsNotify(profile?.isNotify);
    }, [notificationsData]);


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

    return (
        <div className="home-page-content" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <ContactHero lang={lang} subtitle={t(lang, "notifications")} />
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

                            {/* Notifications List */}

                            <div className="notifications-list">
                                {notifications.length === 0 ? (
                                    <div className="no-notifications">
                                        <p>{t(lang, "no_notifications")}</p>
                                    </div>
                                ) : (
                                    notifications?.map((notification) => (
                                        <div key={notification.id} className="notification-card">
                                            <div className="notification-icon">
                                                <Image src={bill} alt="notification" width={40} height={40} />
                                            </div>
                                            <div className="notification-content">
                                                <p className="notification-message">{notification.title}</p>
                                                <span className="notification-time">{notification.timeAdd}</span>
                                            </div>
                                            <button
                                                className="delete-notification-btn"
                                                onClick={() => deleteNotificationHandler(notification.id)}
                                            >
                                                <Trash2 size={20} />
                                            </button>

                                        </div>
                                    ))
                                )}
                            </div>

                        </div>
                    </div>
            }
        </div>
    )
}