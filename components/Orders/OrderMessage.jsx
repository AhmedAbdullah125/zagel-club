"use client"
import React, { useState } from "react";
import ComplaintModal from "./ComplaintModal";
import PaymentModal from "./PaymentModal";
import CongatsCard from "../global/CongatsCard";
import { t } from "@/lib/i18n";
import Rating from "./Rating";

export default function OrderMessage({ orderInfo, cost, lang }) {
    const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [showComplaintSuccess, setShowComplaintSuccess] = useState(false);

    const handleComplaintClick = () => {
        setIsComplaintModalOpen(true);
    };

    const handleCloseComplaintModal = () => {
        setIsComplaintModalOpen(false);
    };

    const handleComplaintSuccess = () => {
        setShowComplaintSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
            setShowComplaintSuccess(false);
        }, 3000);
    };

    // Use API provided message if available, otherwise fallback to translations
    const displayMessage = orderInfo.statusMessage || t(lang, `order_${orderInfo.status}_message`);

    // Define actions based on API flags
    const actions = [];
    if (orderInfo.paymentStatusBtn) {
        actions.push({
            text: t(lang, "confirm_payment"),
            type: "primary",
            onClick: () => setIsPaymentModalOpen(true)
        });
    }
    if (orderInfo.isServiceReceivedBtn) {
        actions.push({ text: t(lang, "service_received"), type: "primary" });
    }
    if (orderInfo.showComplaintBtn) {
        actions.push({ text: t(lang, "submit_complaint_btn"), type: "danger", onClick: handleComplaintClick });
    }

    // Determine message type (info, error) based on status
    const messageType = orderInfo.status === "cancelled" ? "error" : "info";

    // Don't render if no message and no actions (though API usually provides message)
    if (!displayMessage && actions.length === 0) {
        return null;
    }

    return (
        <>
            <div className={`order-message ${messageType}`}>
                <div className="message-content">
                    <div className="icon-container">
                        {messageType === "error" ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
                                <path d="M10 6V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="10" cy="14" r="1" fill="currentColor" />
                            </svg>
                        )}
                    </div>
                    <p className="message-text">{displayMessage}</p>
                </div>
                {
                    orderInfo.showRatingBtn && (
                        <div className="rating-container">
                            <Rating lang={lang} id={orderInfo.id} />
                        </div>
                    )
                }
                {actions.length > 0 && (
                    <div className="message-actions">
                        {actions.map((action, index) => (
                            <button
                                key={index}
                                className={`action-btn ${action.type}`}
                                onClick={action.onClick}
                            >
                                {action.text}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <ComplaintModal
                isOpen={isComplaintModalOpen}
                onClose={handleCloseComplaintModal}
                onSuccess={handleComplaintSuccess}
                lang={lang}
                requestId={orderInfo.id}
            />

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                lang={lang}
                orderInfo={orderInfo}
                cost={cost?.totalAmount}

            />

            {showComplaintSuccess && (
                <CongatsCard
                    title={t(lang, "congratulations")}
                    description={t(lang, "complaint_sent_successfully")}
                />
            )}
        </>
    )
}