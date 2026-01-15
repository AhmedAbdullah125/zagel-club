'use client'
import React, { useEffect, useState } from "react";
import Verify from "./Verify";
import Register from "./Register";
import RegisterSecStep from "./RegisterSecStep";
import RegisterThirdStep from "./RegisterThirdStep";
import Image from "next/image";
import langImage from "@/src/assets/images/lang2.svg";
import logo from "@/src/assets/images/logo.png";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
export default function RegisterWrapper() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({})

    const [lang, setLang] = useState('ar');
    const router = useRouter();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang'));
        }
    }, []);

    return (
        <div className="login-wrapper" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div className="container">
                <div className="login-header-action">
                    <div className="lang-back-btn">
                        <Button className="langBtn" type="button"
                            onClick={() => {
                                if (step == 1) {
                                    router.back()
                                }
                                else {
                                    setStep(step - 1)
                                }
                            }
                            }
                        >
                            {
                                lang == 'ar' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-move-right-icon lucide-move-right"><path d="M18 8L22 12L18 16" /><path d="M2 12H22" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-move-left-icon lucide-move-left"><path d="M6 8L2 12L6 16" /><path d="M22 12H2" /></svg>
                                )
                            }
                        </Button>
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

                    </div>
                    <Image src={logo} alt="login" width={1000} height={1000} />
                </div>
                {
                    step === 1 ? <Register formData={formData} setFormData={setFormData} step={step} setStep={setStep} lang={lang} /> :
                        step === 2 ? <RegisterSecStep formData={formData} setFormData={setFormData} step={step} setStep={setStep} lang={lang} /> :
                            <RegisterThirdStep formData={formData} setFormData={setFormData} step={step} setStep={setStep} lang={lang} />
                }
            </div>
        </div>
    )
}