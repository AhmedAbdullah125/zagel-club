"use client"
import React, { useEffect, useState } from "react";
import ContactHero from "../Contact/ContactHero";
import { t } from "@/lib/i18n";
import reportBg from "@/src/assets/images/reportBg.png";
import addToWallet from "@/src/assets/images/addToWallet.svg";
import Image from "next/image";
import { Button } from "../ui/button";
import gif from "@/src/assets/images/walletGit.gif";
import CongatsCard from "../global/CongatsCard";
import ChargeWalletModal from "./ChargeWalletModal";
import { useGetWallet } from "../Requests/useGetWallet";
import parse from "html-react-parser";
import { walletTransactions } from "../Requests/walletTransactions";

export default function WalletWrapper() {
    const [lang, setLang] = useState('ar');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('charge'); // 'charge' or 'withdraw'
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingWithdraw, setLoadingWithdraw] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [trigger, setTrigger] = useState(1);
    const { data: wallet, isLoading: walletLoading } = useGetWallet(lang, trigger);
    console.log(wallet);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang'));
        }
    }, []);

    const handleOpenModal = (type) => {
        setModalType(type);

        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAmount('');
    };

    const handleConfirm = () => {
        setIsModalOpen(false);
        if (modalType === 'withdraw') {
            walletTransactions(amount, setLoadingWithdraw, lang, setShowSuccess, setTrigger, modalType).then(() => {
                setAmount('');
            });
        } else {
            walletTransactions(amount, setLoading, lang, setShowSuccess, setTrigger, modalType).then(() => {
                setAmount('');
            });
        }

        // // Show loading for 1 seconds then show success
        // setTimeout(() => {
        //     setLoading(false);
        //     setLoadingWithdraw(false);
        //     setShowSuccess(true);
        //     // Hide success message after 1 seconds
        //     setTimeout(() => {
        //         setShowSuccess(false);
        //         setAmount('');
        //     }, 2000);
        // }, 1000);
    };

    return (
        <div className="wallet-page" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <ContactHero lang={lang} subtitle={t(lang, "digital_wallet")} />

            <div className="container">
                <div className="wallet-card">
                    <Image src={reportBg} alt="report-bg1" className="report-bg1" />
                    <Image src={reportBg} alt="report-bg2" className="report-bg2" />
                    <h3>{t(lang, "digital_wallet")}</h3>
                    <p>{t(lang, "wallet_description")}</p>
                    <div className="wallet-det-cont">
                        <div className="r-side">
                            <h2>{t(lang, "wallet_charge_message")} 💰</h2>
                            <Image src={addToWallet} alt="add to wallet" />

                            {/* Charge Wallet Button */}
                            <Button
                                className={`wallet-btn ${loading ? "loading" : ""}`}
                                onClick={() => handleOpenModal('charge')}
                                disabled={loading}
                            >
                                {loading ? <span className="loader-btn"></span> : t(lang, "charge_wallet")}
                            </Button>

                            {/* Withdraw Balance Button */}
                            <Button
                                className={`wallet-withdraw-btn ${loadingWithdraw ? "loading" : ""}`}
                                onClick={() => handleOpenModal('withdraw')}
                                disabled={loadingWithdraw}
                            >
                                {loadingWithdraw ? <span className="loader-btn"></span> : t(lang, "withdraw_balance")}
                            </Button>
                        </div>
                        <div className="l-side">
                            <div className="vid-container">
                                <Image src={gif} alt="wallet vid" />
                                <span>{t(lang, "wallet_balance")}</span>
                                {
                                    walletLoading ? <span className="loader-btn"></span> :
                                        <div className="wallet-balance">{parse(wallet)}</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ChargeWalletModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirm}
                amount={amount}
                setAmount={setAmount}
                lang={lang}
                type={modalType}
            />

            {showSuccess && (
                <CongatsCard
                    title={t(lang, "congratulations")}
                    description={
                        modalType === 'charge'
                            ? t(lang, "wallet_charged_successfully")
                            : t(lang, "wallet_withdrawn_successfully")
                    }
                />
            )}
        </div>
    )
}