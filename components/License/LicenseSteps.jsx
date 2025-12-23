import React from "react";
import { t } from "@/lib/i18n";

export default function LicenseSteps({ lang, step, progress, maxProgress }) {
    const steps = [
        { id: 1, label: t(lang, "enter_data") },
        { id: 2, label: t(lang, "upload_attachments") },
        { id: 3, label: t(lang, "send_request") },
    ];

    return (
        <div className="license-steps-container">
            <div className="container">
                <div className="license-steps">
                    {steps.map((stepItem, index) => (
                        <div className="step-item" key={stepItem.id}>
                            <div className={`step-circle ${step > stepItem.id ? 'completed' : step === stepItem.id ? 'active' : 'upcoming'}`}>
                                {stepItem.id}
                            </div>
                            <span className="step-label">{stepItem.label}</span>
                            <div className="progress-cont">
                                {
                                    stepItem.id < step ? <div className="progr-value"></div> :
                                        stepItem.id === step ? <div className="progr-value" style={{ width: `${progress / maxProgress * 100}%` }}></div> :
                                            null
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}