// components/Header/DeleteAccountModal.jsx
"use client"
import React, { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import worning from '@/src/assets/images/worning.gif'
import { deleteAccount } from "../Requests/deleteAccount";
import { useRouter } from "next/navigation";

export default function DeleteAccountModal({ isOpen, onClose, lang }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (!isOpen) return null;

    const handleConfirm = () => {
        deleteAccount(setLoading, lang, router)
    };

    return (
        <div className="complaint-modal-overlay" onClick={onClose}>
            <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="logout-modal-body">
                    <div className="logout-icon">
                        <Image src={worning} alt="warning" width={120} height={120} />
                    </div>

                    <h2 className="logout-modal-title">هل أنت متأكد أنك تريد حذف الحساب؟</h2>

                    <div className="logout-actions">
                        <Button className="logout-cancel-btn" onClick={onClose} disabled={loading} > تراجع </Button>
                        <Button className="logout-confirm-btn delete-btn" onClick={handleConfirm} disabled={loading} >
                            {loading ? <span className="loader-btn"></span> : "حذف"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
