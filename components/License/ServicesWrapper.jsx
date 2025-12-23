"use client"
import React, { useEffect, useState } from "react";
import LicenseHero from "./LicenseHero";
import Membership from "../Home/Membership";
import { t } from "@/lib/i18n";
export default function ServicesWrapper() {
  const [lang, setLang] = useState('ar');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLang(localStorage.getItem('lang'));
    }
  }, []);
  return (
    <div className="license-content" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
      <LicenseHero lang={lang} title={t(lang, 'license_hero_title_2')} description={t(lang, 'license_hero_description_2')} />
      <Membership lang={lang} />
    </div>
  )
}
