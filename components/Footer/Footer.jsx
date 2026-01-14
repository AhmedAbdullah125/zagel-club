"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/src/assets/images/logo.png";
import Link from "next/link";
import { t } from "@/lib/i18n";

export default function Footer() {
    const [lang, setLang] = useState("ar");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("lang");
            if (stored) setLang(stored);
        }
    }, []);

    const navItems = [
        { label: "الرئيسية", href: "/", lable_en: "Home" },
        { label: "طلباتي", href: "/orders", lable_en: "Orders" },
        { label: "قائمه اللاعبين", href: "/players", lable_en: "Players" },
        { label: "اضافه لاعب", href: "/add-player", lable_en: "Add Player" },
    ];

    return (
        <footer className="footer" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <div className="container">
                <div className="footer-bottom">
                    <div className="footer-copy">
                        <div className="dashboard-links">
                            {
                                navItems.map((item, index) => {
                                    return (
                                        <Link href={item.href} key={index} className={`navItem`}> {lang == "ar" ? item.label : item.lable_en} </Link>
                                    );
                                })
                            }
                        </div>
                        <h5>{t(lang, "footer_copyright_title")} {new Date().getFullYear()}</h5>
                        <div className="dashboard-links">
                            <Link href="/terms-and-conditions">{t(lang, "terms_and_conditions")}</Link>
                            <Link href="/privacy-policy">{t(lang, "privacy-policy")}</Link>

                        </div>
                    </div>
                    <div className="footer-logos">
                        <div className="footer-logo-box">
                            <Image src={logo} alt="شعار السعودية" width={80} height={40} />
                        </div>
                        <div className="footer-logo-box">
                            <Image src={logo} alt="شعار السعودية" width={80} height={40} />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}