import React from "react";
import Image from "next/image";
import Link from "next/link";
import { t } from "@/lib/i18n";
import nationalCardIcon from '@/src/assets/images/license/nationalCardIcon.svg'

export default function OrderCard({ order, lang }) {
    // Status colors based on order status
    const statusColors = {
        pending: "#2D9CDB",
        accepted: "#1B8354",
        current: "#F2994A",
        finished: "#1B8354",
        cancelled: "#E5252A"
    };

    // Status background colors (lighter versions)
    const statusBgColors = {
        pending: "#D6EAF8",
        accepted: "#D5F4E6",
        current: "#FCE8D6",
        finished: "#D5F4E6",
        cancelled: "#FDEAEA"
    };
    // Icon colors match the status colors
    const iconColor = statusColors[order.status] || "#2D9CDB";
    const statusBgColor = statusBgColors[order.status] || "#D6EAF8";

    return (
        <div className="order-card" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
            <div className="order-card-header">
                <div className="order-info-top">
                    <span className="order-label">{t(lang, "order_number")}</span>
                    <span className="order-number">{order.requestNumber}</span>
                </div>
                <div className="order-status-badge" style={{ backgroundColor: statusBgColor, color: statusColors[order.status] }}>
                    {t(lang, order.statusText)}
                </div>

            </div>

            <div className="order-card-body">
                <div className="order-main-info">
                    <div className="order-icon" style={{ backgroundColor: iconColor }}>
                        <Image src={nationalCardIcon} alt=""></Image>
                    </div>

                    <div className="order-type-info">
                        <span className="order-type">{order.typeText}</span>
                        <span className="complain-description">{order.playerName}</span>
                    </div>
                </div>

                <div className="order-club-name">
                    {order.club}
                </div>
            </div>

            <Link href={`/order/${order.id}`} className="order-details-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t(lang, "view_details")}
            </Link>
        </div>
    );
}