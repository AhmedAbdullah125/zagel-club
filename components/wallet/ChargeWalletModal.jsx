"use client"
import React from "react";
import Image from "next/image";
import gif from "@/src/assets/images/walletGit.gif";
import { Button } from "../ui/button";
import { t } from "@/lib/i18n";

export default function ChargeWalletModal({ isOpen, onClose, onConfirm, amount, setAmount, lang, type }) {
    if (!isOpen) return null;

    return (
        <div className="wallet-modal-overlay" onClick={onClose} style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <div className="wallet-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="wallet-modal-close" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="wallet-modal-icon">
                    <Image src={gif} alt="add to wallet" width={120} height={120} />
                </div>

                <h3 className="wallet-modal-title">{t(lang, type == "charge" ? "wallet_charge_message" : "withdraw_amount_label")}</h3>

                <div className="wallet-modal-input-wrapper">
                    <input
                        type="number"
                        placeholder={t(lang, type == "charge" ? "wallet_charge_message" : "withdraw_amount_label")}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="wallet-modal-input"
                    />
                    <span className="wallet-modal-currency"></span>
                </div>

                <Button className="wallet-modal-confirm-btn" onClick={onConfirm} disabled={!amount || amount <= 0} >
                    {t(lang, type == "charge" ? "confirm_wallet_charge" : "confirm_withdraw")}
                </Button>
            </div>
        </div>
    );
}
