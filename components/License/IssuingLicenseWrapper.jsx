"use client"
import React, { useEffect, useState } from "react";
import LicenseHero from "./LicenseHero";
import LicenseSteps from "./LicenseSteps";
import PersonalDataForm from "./PersonalDataForm";
import DocumentsForm from "./DocumentsForm";
import LicensSummery from "./LicensSummery";
import { t } from "@/lib/i18n";
import SelectPlayer from "../MembershipRequest/SelectPlayer";
export default function IssuingLicenseWrapper() {
  const [lang, setLang] = useState('ar');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLang(localStorage.getItem('lang'));
    }
  }, []);
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [maxProgress, setMaxProgress] = useState(6);
  const [formData, setFormData] = useState({})
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  console.log(formData);
  console.log(progress);
  console.log(maxProgress);

  return (
    <div className="license-content" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
      <LicenseHero lang={lang} title={t(lang, 'license_hero_title')} description={t(lang, 'license_hero_description')} />
      <LicenseSteps lang={lang} step={step} progress={progress} maxProgress={maxProgress} />
      {
        step == 1 ?
          <SelectPlayer lang={lang} formData={formData} title={t(lang, 'license_request_data')} description={t(lang, 'select_player_description')} setFormData={setFormData} setStep={setStep} setSelectedPlayer={setSelectedPlayer} progress={progress} setProgress={setProgress} setMaxProgress={setMaxProgress} />
          : step == 2 ?
            <DocumentsForm lang={lang} formData={formData} setFormData={setFormData} setStep={setStep} progress={progress} setProgress={setProgress} setMaxProgress={setMaxProgress} />
            : step == 3 ?
              <LicensSummery type="license" lang={lang} formData={formData} setStep={setStep} progress={progress} setProgress={setProgress} setMaxProgress={setMaxProgress} />
              : null
      }
    </div>
  )
}
