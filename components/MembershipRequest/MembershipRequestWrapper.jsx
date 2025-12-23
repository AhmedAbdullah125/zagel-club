"use client"
import React, { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import LicenseHero from "../License/LicenseHero";
import SelectPlayerForMembership from "./SelectPlayerForMembership";
import MembershipSummery from "./MembershipSummery";

export default function MembershipRequestWrapper() {
    const [lang, setLang] = useState('ar');
    const [step, setStep] = useState(1)
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang'));
        }
    }, []);



    return (
        <div className="home-page-content" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <LicenseHero lang={lang} title={t(lang, 'membership_title_2')} description={t(lang, 'membership_card_description_2')} />
            {
                step == 1 &&
                <SelectPlayerForMembership lang={lang} selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer} setStep={setStep} />

            }
            {
                step == 2 && <MembershipSummery lang={lang} setStep={setStep} selectedPlayer={selectedPlayer} />
            }
        </div>
    )
}