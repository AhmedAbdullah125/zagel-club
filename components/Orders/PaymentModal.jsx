"use client"
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { t } from "@/lib/i18n";
import { payRequest } from "../Requests/payRequest";

export default function PaymentModal({ isOpen, onClose, lang, orderInfo, cost }) {
    const [activeTab, setActiveTab] = useState('wallet'); // 'wallet' or 'bank'
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState(cost.split(" ")[0]);
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-wallet-icon lucide-wallet"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></svg>
                            <span>{t(lang, "wallet")}</span>
                        </button>
                        <button
                            className={`payment-tab ${activeTab === 'bank' ? 'active' : ''}`}
                            onClick={() => setActiveTab('bank')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-landmark-icon lucide-landmark"><path d="M10 18v-7" /><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z" /><path d="M14 18v-7" /><path d="M18 18v-7" /><path d="M3 22h18" /><path d="M6 18v-7" /></svg>

                            <span>{t(lang, "bank_account")}</span>
                        </button>
                    </div>

                    <div className="payment-form-groups">
                        {
                            activeTab === 'bank' &&
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-landmark-icon lucide-landmark"><path d="M10 18v-7" /><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z" /><path d="M14 18v-7" /><path d="M18 18v-7" /><path d="M3 22h18" /><path d="M6 18v-7" /></svg>

                                    </div>
                                </div>
                            </div>
                        }

                        <div className="payment-form-group">
                            <div className="input-with-icon">
                                <Input
                                    type="text"
                                    placeholder={t(lang, "amount_to_transfer")}
                                    value={cost.split(" ")[0]}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="payment-input"
                                    disabled
                                />
                                <div className="input-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-circle-dollar-sign-icon lucide-circle-dollar-sign"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button className="payment-submit-btn" onClick={handleSubmit} disabled={activeTab === 'bank' ? (!accountNumber || !amount) : !amount}>
                        {t(lang, "complete_payment")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
