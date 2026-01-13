"use client";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { mapNotificationToUI, IncomingNotification } from "./notificationMapper";
import { useGetNotifications } from "@/components/Requests/useGetNotifications";
import { t } from "@/lib/i18n";
const SOUND_URL = "/sounds/notification.mp3";
const REFRESH_MS = 12000;
const LS_LAST_ID = "last_toast_notification_id";
const LS_INIT_DONE = "notifications_listener_initialized";
export default function NotificationListener() {
    const router = useRouter();
    const [lang, setLang] = useState<"ar" | "en">("ar");
    const { data: notificationsData, refetch } = useGetNotifications(lang) as any;
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const lastShownIdRef = useRef<string | null>(null);

    useEffect(() => {
        const saved = (localStorage.getItem("lang") as "ar" | "en" | null) ?? "ar";
        setLang(saved);
    }, []);

    useEffect(() => {
        audioRef.current = new Audio(SOUND_URL);
        audioRef.current.preload = "auto";
    }, []);


    const playSound = async () => {
        try {
            await audioRef.current?.play();
        } catch { }
    };

    const showToast = (n: IncomingNotification) => {
        const idStr = String(n.id);
        if (lastShownIdRef.current === idStr) return;
        lastShownIdRef.current = idStr;
        const ui = mapNotificationToUI(n);
        const toastFn =
            ui.tone === "success"
                ? toast.success
                : ui.tone === "error"
                    ? toast.error
                    : ui.tone === "warning"
                        ? toast.warning
                        : toast;

        setTimeout(() => {
            toastFn(n.title || ui.label, {
                description: n.message,
                duration: 6000,
                className: "notif-toast",
                action: {
                    label: t(lang, "open_notification"),
                    onClick: () => router.push(ui.route),
                },
                style: {
                    background: "#1B8354",
                    color: "#fff",
                    borderRadius: "10px",
                    boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.1)",
                },
            });
        }, 0);

        localStorage.setItem(LS_LAST_ID, idStr);
        playSound();
    };
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) return;
        if (typeof refetch !== "function") return;

        const interval = setInterval(() => {
            refetch();
        }, REFRESH_MS);

        return () => clearInterval(interval);
    }, [refetch]);
    useEffect(() => {
        const list: IncomingNotification[] = notificationsData?.data || [];
        if (!Array.isArray(list) || list.length === 0) return;
        const newest = list[0];
        const newestId = String(newest.id);
        const lastStored = localStorage.getItem(LS_LAST_ID);
        const initDone = localStorage.getItem(LS_INIT_DONE);
        if (!initDone) {
            localStorage.setItem(LS_INIT_DONE, "1");
            localStorage.setItem(LS_LAST_ID, newestId);
            lastShownIdRef.current = newestId;
            return;
        }
        if (lastStored === newestId) return;
        showToast(newest);
    }, [notificationsData]);
    return null;
}