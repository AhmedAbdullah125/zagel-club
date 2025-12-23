'use client'
import React, { useEffect, useState } from "react";
import Login from "./Login";
import Verify from "./Verify";

import langImage from "@/src/assets/images/lang2.svg";
import logo from "@/src/assets/images/logo.svg";
import Image from "next/image";
export default function LoginWrapper() {

    const [step, setStep] = useState("login");
    const [formData, setFormData] = useState({
        phone: "",
        code: "",
    })
    const [lang, setLang] = useState('ar');
    console.log(formData);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('lang')) {
                setLang(localStorage.getItem('lang'));
            }
            else {
                localStorage.setItem('lang', 'ar');
                setLang('ar');
            }
        }
    }, []);
    return (
        <div className="login-wrapper" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
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
                    step === "login" ? <Login formData={formData} setFormData={setFormData} step={step} setStep={setStep} lang={lang} /> :
                        <Verify formData={formData} setFormData={setFormData} step={step} setStep={setStep} lang={lang} link="/" />
                }
            </div>
        </div>
    )
}