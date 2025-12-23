"use client"
import React, { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import ContactHero from "../Contact/ContactHero";
import CongatsCard from "../global/CongatsCard";
import EditPhoneNumberOTP from "./EditPhoneNumberOTP";
import EditPhoneNumber from "./EditPhoneNumber";
import { useRouter } from "next/navigation";
import { useGetProfile } from "../Requests/useGetProfile";
import Loading from "@/src/app/loading";
import EditPhoneNumberOTPConfirm from "./EditPhoneNumberOTPConfirm";
export default function EditPhoneWrapper() {
    const [lang, setLang] = useState('ar');
    const [step, setStep] = useState('old_phone_OTP');
    const [newPhone, setNewPhone] = useState(null);
    const [newCountyCode, setNewCountyCode] = useState(null);
    const router = useRouter();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang'));
        }
    }, []);
    console.log(step);
    useEffect(() => {
        if (step === 'success') {
            setTimeout(() => {
                router.push("/")
            }, 3000);
        }
    }, [step])
    const { data: profile, isLoading: profileLoading } = useGetProfile(lang)
    const oldphone = profile?.phone;
    const oldCountryCode = profile?.countryCode;

    return (
        <div className="home-page-content " style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <ContactHero lang={lang} subtitle={t(lang, "edit_phone_number")} />
            {
                profileLoading ? <Loading /> :
                    <>

                        {
                            step === 'old_phone_OTP' && (
                                <EditPhoneNumberOTP lang={lang} countryCode={oldCountryCode} phone={oldphone} nextStep={() => setStep('new_phone')} />
                            )
                        }
                        {
                            step === 'new_phone' && (
                                <EditPhoneNumber lang={lang} setNewPhone={setNewPhone} setNewCountyCode={setNewCountyCode} nextStep={() => setStep('new_phone_OTP')} />
                            )
                        }
                        {
                            step === 'new_phone_OTP' && (
                                <EditPhoneNumberOTPConfirm lang={lang} countryCode={newCountyCode} phone={newPhone} nextStep={() => setStep('success')} />
                            )
                        }
                    </>

            }
            {/* Success Card */}
            {step === 'success' && (
                <CongatsCard
                    title="تهانينا"
                    description="تم حفظ التعديل بنجاج"
                />
            )}
        </div>
    )
}