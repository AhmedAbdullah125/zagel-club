// components/Orders/CancelOrderModal.jsx
"use client"
import React, { useState } from "react";
import { Button } from "../ui/button";
import { t } from "@/lib/i18n";
import { cancelOrder } from "../Requests/cancelOrder";

export default function CancelOrderModal({ id, isOpen, onClose, onSuccess, lang, reasons, reasonsLoading }) {
    const [selectedReason, setSelectedReason] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;


    const handleSubmit = () => {
        if (!selectedReason) return;
        // setLoading(true);
        // setTimeout(() => {
        //     setLoading(false);
        //     onClose();
        //     if (onSuccess) onSuccess();
        // }, 3000);
        cancelOrder(id, selectedReason, onSuccess, lang, onClose);
    };

    return (
        <div className="complaint-modal-overlay" onClick={onClose} style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <div className="complaint-modal-content cancel-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="complaint-modal-close" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="cancel-modal-form">
                    <h2 className="cancel-modal-title">{t(lang, "cancel_select_reason_title")}</h2>

                    {
                        reasonsLoading || !reasons ?
                            <span className="loader-btn"></span> :
                            <div className="cancel-reasons-grid">
                                {reasons.map((reason, index) => (
                                    <label key={index} className="cancel-reason-item">
                                        <span className="cancel-reason-text">{reason.name}</span>
                                        <input type="radio" name="cancelReason" value={reason.id}
                                            checked={selectedReason === reason.id}
                                            onChange={(e) => setSelectedReason(e.target.value)}
                                            className="cancel-reason-radio"
                                        />
                                    </label>
                                ))}
                            </div>
                    }

                    <Button
                        className="cancel-submit-btn"
                        onClick={handleSubmit}
                        disabled={!selectedReason || loading}
                    >
                        {loading ? <span className="loader-btn"></span> : t(lang, "cancel_order_button")}
                    </Button>
                </div>
            </div>
        </div>
    );
}