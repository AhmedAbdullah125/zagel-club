"use client"
import React, { useEffect, useState } from "react";
import Membership from "./Membership";

export default function HomeWrapper() {
  const [lang, setLang] = useState('ar');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLang(localStorage.getItem('lang'));
    }
  }, []);
  return (
    <div className="home-page-content" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>      
      <Membership lang={lang} />
    </div>
  )
}
