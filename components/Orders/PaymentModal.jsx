"use client"
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { t } from "@/lib/i18n";
import { payRequest } from "../Requests/payRequest";

export default function PaymentModal({ isOpen, onClose, lang, orderInfo }) {
    const [activeTab, setActiveTab] = useState('wallet'); // 'wallet' or 'bank'
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = () => {
        payRequest({ requestId: orderInfo.id, paymentMethod: activeTab }, setLoading, lang).then(() => {
            onClose();
        });
    };

    return (
        <div className="complaint-modal-overlay" onClick={onClose} style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <div className="complaint-modal-content payment-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="complaint-modal-close" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="payment-modal-form">
                    <h2 className="payment-modal-title">{t(lang, "select_payment_method")}</h2>

                    <div className="payment-tabs">
                        <button
                            className={`payment-tab ${activeTab === 'wallet' ? 'active' : ''}`}
                            onClick={() => setActiveTab('wallet')}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="tab-icon">
                                <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 12C12.5523 12 13 11.5523 13 11C13 10.4477 12.5523 10 12 10C11.4477 10 11 10.4477 11 11C11 11.5523 11.4477 12 12 12Z" fill="currentColor" />
                                <path d="M16 12C16.5523 12 17 11.5523 17 11C17 10.4477 16.5523 10 16 10C15.4477 10 15 10.4477 15 11C15 11.5523 15.4477 12 16 12Z" fill="currentColor" />
                            </svg>
                            <span>{t(lang, "wallet")}</span>
                        </button>
                        <button
                            className={`payment-tab ${activeTab === 'bank' ? 'active' : ''}`}
                            onClick={() => setActiveTab('bank')}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="tab-icon">
                                <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M5 6L12 3L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M4 10V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M20 10V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>{t(lang, "bank_account")}</span>
                        </button>
                    </div>

                    <div className="payment-form-groups">
                        <div className="payment-form-group">
                            <div className="input-with-icon">
                                <Input
                                    type="text"
                                    placeholder={t(lang, "bank_account_number")}
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    className="payment-input"
                                />
                                <div className="input-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M5 6L12 3L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4 10V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M20 10V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="payment-form-group">
                            <div className="input-with-icon">
                                <Input
                                    type="text"
                                    placeholder={t(lang, "amount_to_transfer")}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="payment-input"
                                />
                                <div className="input-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <path d="M12 8V12L14.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M10 12L12 15L14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        className="payment-submit-btn"
                        onClick={handleSubmit}
                        disabled={!accountNumber || !amount}
                    >
                        {t(lang, "complete_payment")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
