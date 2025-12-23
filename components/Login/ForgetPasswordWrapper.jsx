'use client'
import React, { useEffect, useState } from "react";
import Verify from "./Verify";
import ForgetPassword from "./ForgetPassword";
import ResetPassword from "./ResetPassword";
import Image from "next/image";
import langImage from "@/src/assets/images/lang2.svg";
import logo from "@/src/assets/images/logo.svg";
export default function ForgetPasswordWrapper() {
    const [step, setStep] = useState("forget-password");
    const [fromData, setFormData] = useState({
        phone: "",
        code: "",
    })
    const [lang, setLang] = useState('ar');
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang'));
        }
    }, []);
    return (
        <div className="login-wrapper" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <div className="container">
                <div className="login-header-action">
                    <button className={"langBtn"} type="button"
                        onClick={() => {
                            if (lang === 'ar') {
                                localStorage.setItem('lang', 'en');
                                setLang('en');
                                window.location.reload();
                            }
                            else {
                                localStorage.setItem('lang', 'ar');
                                setLang('ar');
                                window.location.reload();
                            }
                        }}
                    >
                        <Image src={langImage} alt="lang" className={"langImage"} />
                        <span className={"langText"}>{lang === 'ar' ? 'English' : 'العربية'}</span>
                    </button>
                    <Image src={logo} alt="login" width={100} height={100} />
                </div>
                {
                    step === "forget-password" ? <ForgetPassword formData={fromData} setFormData={setFormData} step={step} setStep={setStep} lang={lang} /> :
                        step === "verify" ? <Verify formData={fromData} setFormData={setFormData} step={step} setStep={setStep} lang={lang} link="/reset-password" /> :
                            <ResetPassword formData={fromData} setFormData={setFormData} step={step} setStep={setStep} lang={lang} />
                }
            </div>
        </div>
    )
}