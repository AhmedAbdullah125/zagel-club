"use client"
import React, { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import Image from "next/image";
import glassHour from '@/src/assets/images/glassHour.gif'
import attachment from '@/src/assets/images/newsImg.png'
import ContactHero from "../Contact/ContactHero";
import { useGetComplaint } from "../Requests/useGetComplaint";
import Loading from "@/src/app/loading";

export default function SingleComplaintWrapper({ id }) {
    const [lang, setLang] = useState('ar');
    const { data, isLoading } = useGetComplaint(lang, id)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang'));
        }
    }, []);


    // Status colors
    const statusConfig = {
        new: {
            label: "complaint_status_new",
            color: "#2D9CDB",
            bgColor: "#2D9CDB40"
        },
        in_progress: {
            label: "complaint_status_in_progress",
            color: "#F2994A",
            bgColor: "#F2994A40"
        },
        replied: {
            label: "complaint_status_replied",
            color: "#1B8354",
            bgColor: "#1B835440"
        }
    };

    const currentStatus = statusConfig[data?.status];

    return (
        <div className="single-complaint-wrapper" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <ContactHero lang={lang} title={t(lang, "my_complaints_title")} subtitle={t(lang, "complaint_details")} />

            {
                isLoading || !data ? <Loading /> :
                    <div className="container">
                        <div className="somplaint-wraper">
                            <div className="complaint-header">
                                <div className="complaint-header-info">
                                    <div className="complaint-meta">
                                        <span className="complaint-label">{t(lang, "complaint_number")}</span>
                                        <span className="complaint-value">{data?.complaintNumber}</span>
                                    </div>
                                    <div className="complaint-meta">
                                        <span className="complaint-label">{t(lang, "complaint_date")}</span>
                                        <span className="complaint-value">{data?.createdAt}</span>
                                    </div>
                                </div>
                                <div
                                    className="complaint-status-badge-large"
                                    style={{
                                        backgroundColor: currentStatus.bgColor,
                                        color: currentStatus.color
                                    }}
                                >
                                    {data?.statusText}
                                </div>
                            </div>

                            {/* Complaint Details Section */}
                            <div className="complaint-details-section">
                                <h3 className="complaint-section-title" style={{ color: "#E65248" }}>
                                    ✖ {t(lang, "complaint_details_title")}
                                </h3>
                                <div className="complaint-details-box" style={{
                                    backgroundColor: "#FCE8E6",
                                    border: "1px solid #F5C6CB",
                                    padding: "20px",
                                    borderRadius: "8px",
                                    marginTop: "16px"
                                }}>
                                    <h4 style={{
                                        color: "#E65248",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        marginBottom: "12px"
                                    }}>
                                        {data?.reason}
                                    </h4>
                                    <p style={{
                                        color: "#E65248",
                                        fontSize: "14px",
                                        lineHeight: "1.8",
                                        margin: 0
                                    }}>
                                        {data?.details}
                                    </p>
                                </div>
                            </div>

                            {/* Attachments Section */}
                            <div className="complaint-attachments-section">
                                <h3 className="complaint-section-title">{t(lang, "attachments")}</h3>
                                <div className="attachments-grid">
                                    <div key={attachment.id} className="attachment-item">
                                        <Image
                                            src={data?.image}
                                            alt="attachment"
                                            width={200}
                                            height={200}
                                            style={{ borderRadius: "8px", objectFit: "cover" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Admin Response Section */}
                            <div className="admin-response-section">
                                <h3 className="complaint-section-title">{t(lang, "admin_response_title")}</h3>

                                {data?.status === "replied" ? (
                                    <div className="admin-response-box" style={{
                                        backgroundColor: "#D5F4E6",
                                        border: "1px solid #C3E6CB",
                                        padding: "20px",
                                        borderRadius: "8px",
                                        marginTop: "16px"
                                    }}>
                                        <p style={{
                                            color: "#155724",
                                            fontSize: "14px",
                                            lineHeight: "1.8",
                                            margin: 0
                                        }}>
                                            {data?.reply}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="under-review-box" style={{
                                        backgroundColor: "#D5F4E6",
                                        border: "1px solid #C3E6CB",
                                        padding: "40px 20px",
                                        borderRadius: "8px",
                                        marginTop: "16px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "16px"
                                    }}>
                                        <Image
                                            src={glassHour}
                                            alt="under review"
                                            width={60}
                                            height={60}
                                        />
                                        <p style={{
                                            color: "#155724",
                                            fontSize: "16px",
                                            margin: 0,
                                            textAlign: "center"
                                        }}>
                                            {t(lang, "under_review_message")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
            }
        </div>
    );
}