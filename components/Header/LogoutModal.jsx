// components/Header/LogoutModal.jsx
"use client"
import React, { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import worning from '@/src/assets/images/worning.gif'
import { logout } from "../Requests/logout";
import { useRouter } from "next/navigation";

export default function LogoutModal({ isOpen, onClose, onConfirm, lang }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (!isOpen) return null;

    const handleConfirm = () => {
        setLoading(true);
        logout(setLoading, lang, router)
    };

    return (
        <div className="complaint-modal-overlay" onClick={onClose}>
            <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="logout-modal-body">
                    <div className="logout-icon">
                        <Image src={worning} alt="warning" width={120} height={120} />
                    </div>

                    <h2 className="logout-modal-title">هل انت متاكد انك تريد تسجيل الخروج</h2>

                    <div className="logout-actions">
                        <Button className="logout-cancel-btn" onClick={onClose} disabled={loading} > اغلق </Button>
                        <Button className="logout-confirm-btn" onClick={handleConfirm} disabled={loading} >
                            {loading ? <span className="loader-btn"></span> : "تسجيل الخروج"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}