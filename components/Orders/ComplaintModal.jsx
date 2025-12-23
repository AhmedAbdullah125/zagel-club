"use client"
import React, { useState } from "react";
import Image from "next/image";
import complaintImage from "@/src/assets/images/registeration/contactimg.jpg";
import { Button } from "../ui/button";
import { t } from "@/lib/i18n";
import { sendComplaint } from "../Requests/sendComplaint";

export default function ComplaintModal({ isOpen, onClose, onSuccess, lang, requestId }) {
    const [reason, setReason] = useState('');
    const [details, setDetails] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {

        const data = { reason, details, image, requestId: requestId, };

        // Reset form
        sendComplaint(data, setLoading, requestId ? requestId : null, lang, onSuccess).then(() => {
            setReason('');
            setDetails('');
            setImage(null);
            setImagePreview(null);

            onClose();
        });
    };


    return (
        <div className="complaint-modal-overlay" onClick={onClose}>
            <div className="complaint-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="complaint-modal-close" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="complaint-modal-grid">
                    {/* Form Section */}
                    <div className="complaint-modal-form">
                        <h2 className="complaint-modal-title">{t(lang, "submit_complaint")}</h2>
                        {/* Reason Input */}
                        <div className="complaint-form-group">
                            <label className="complaint-label">{t(lang, "complaint_reason")}</label>
                            <input
                                type="text"
                                placeholder={t(lang, "complaint_reason")}
                                value={reason}
                                required
                                minLength={5}
                                onChange={(e) => setReason(e.target.value)}
                                className="complaint-input"
                                dir="rtl"
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="complaint-form-group">
                            <label className="complaint-label">{t(lang, "add_image")}</label>
                            <div className="complaint-upload-wrapper">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="complaint-file-input"
                                    id="complaint-image-upload"
                                />
                                <label htmlFor="complaint-image-upload" className="complaint-upload-label">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>{t(lang, "share_complaint_image")}</span>
                                </label>
                                {imagePreview && (
                                    <div className="complaint-image-preview">
                                        <img src={imagePreview} alt="preview" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details Textarea */}
                        <div className="complaint-form-group">
                            <label className="complaint-label">{t(lang, "complaint_details")}</label>
                            <textarea
                                placeholder={t(lang, "complaint_details")}
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className="complaint-textarea"
                                dir="rtl"
                                rows={4}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            className="complaint-submit-btn"
                            onClick={handleSubmit}
                            disabled={!reason.trim() || !details.trim()}
                        >
                            {
                                loading ? (
                                    <span className="loader-btn"></span>
                                ) : (
                                    t(lang, "send_complaint")
                                )
                            }
                        </Button>
                    </div>
                    {/* Image Section */}
                    <div className="complaint-modal-image">
                        <Image
                            src={complaintImage}
                            alt="complaint"
                            fill
                            className="complaint-image"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
