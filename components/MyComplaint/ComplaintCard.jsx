import React from "react";
import Link from "next/link";
import { t } from "@/lib/i18n";
import complainIcon from '@/src/assets/images/complainIcon.svg'
import Image from "next/image";
export default function ComplaintCard({ complaint, lang }) {
    // Status colors based on complaint status
    const statusColors = {
        new: "#2D9CDB",
        processing: "#F2994A",
        replied: "#1B8354"
    };

    // Status background colors (lighter versions)
    const statusBgColors = {
        new: "#D6EAF8",
        processing: "#FCE8D6",
        replied: "#D5F4E6"
    };

    // Icon colors match the status colors
    const iconColor = statusColors[complaint.status] || "#2D9CDB";
    const statusBgColor = statusBgColors[complaint.status] || "#D6EAF8";

    return (
        <div className="order-card" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
            <div className="order-card-header">
                <div className="order-info-top">
                    <span className="order-label">{t(lang, "complaint_number")}</span>
                    <span className="order-number">{complaint.complaintNumber}</span>
                </div>
                <div className="order-status-badge" style={{ backgroundColor: statusBgColor, color: statusColors[complaint.status] }}>
                    {complaint.statusText}
                </div>
            </div>

            <div className="order-card-body">
                <div className="order-main-info">
                    <div className="order-icon" style={{ backgroundColor: iconColor }}>
                        <Image src={complainIcon} alt="complain-order-icon" />
                    </div>

                    <div className="order-type-info">
                        <span className="order-type">{complaint.reason}</span>
                    </div>
                </div>
            </div>

            <div className="complaint-date-row">
                <span>{t(lang, "complaint_date")} :</span>
                <span>{complaint.createdAt}</span>
            </div>

            <Link href={`/complaint/${complaint.id}`} className="order-details-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t(lang, "view_details")}
            </Link>
        </div>
    );
}