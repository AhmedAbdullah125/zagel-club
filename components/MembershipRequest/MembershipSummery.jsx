"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Add this import
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import serviceIcon from "@/src/assets/images/calculatoe.svg";
import rialIcon from "@/src/assets/images/SAR.svg";
import CongatsCard from "../global/CongatsCard";
import { createNewRequest } from "../Requests/createNewRequest";

export default function MembershipSummery({ lang, selectedPlayer, setStep, type }) {
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const router = useRouter(); // Add this line
    // Cost calculation
    const licenseFee = 25500;
    const vatRate = 0.15; // 15% VAT
    const vatAmount = licenseFee * vatRate;
    const totalAmount = licenseFee + vatAmount;
    const handleSubmit = () => {

        createNewRequest("membership", { id: selectedPlayer }, setLoading, lang, setShowSuccessModal, router)
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US').format(amount);
    };

    return (
        <div className="license-summery-container">
            {showSuccessModal && (
                <CongatsCard title={t(lang, "congratulations")} description={t(lang, "Subscribe_req_success")} />
            )}
            <div className="container">
                <div className="license-summery">
                    <h2 className="summery-title">{t(lang, "cost_details")}</h2>
                    <div className="summery-content">
                        {/* Service Account Section */}
                        <div className="summery-section">
                            <div className="section-header-summery">
                                <div className="section-icon">
                                    <Image src={serviceIcon} alt="Service Icon" />
                                </div>
                                <h3 className="section-title-summery">{t(lang, "service_account")}</h3>
                            </div>

                            <div className="cost-breakdown">
                                {/* License Fee */}
                                <div className="cost-item">
                                    <span className="cost-label">{t(lang, "license_fee")}</span>
                                    <span className="cost-value">
                                        {formatCurrency(licenseFee)} <Image src={rialIcon} alt="SAR" />
                                    </span>
                                </div>

                                {/* VAT */}
                                <div className="cost-item">
                                    <span className="cost-label">{t(lang, "vat")}</span>
                                    <span className="cost-value">
                                        {formatCurrency(vatAmount)} <Image src={rialIcon} alt="SAR" />
                                    </span>
                                </div>

                                {/* Total */}
                                <div className="cost-item total-item">
                                    <span className="cost-label-total">{t(lang, "total")}</span>
                                    <span className="cost-value-total">
                                        {formatCurrency(totalAmount)} <Image src={rialIcon} alt="SAR" />
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="summery-actions">
                            <Button
                                type="button"
                                onClick={() => setStep(1)}
                                className="previous-license-btn"
                            >
                                {t(lang, "previous")}
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                className="submit-license-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loader-btn"></span>
                                ) : (
                                    <span>{t(lang, "submit_request")}</span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}