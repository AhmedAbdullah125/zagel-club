"use client"
import React, { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import ContactHero from "../Contact/ContactHero";
import Image from "next/image";
import usersIcon from '@/src/assets/images/usersIcon.svg';
import flagIcon from '@/src/assets/images/flag.svg';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetProfile } from "../Requests/useGetProfile";
import Loading from "@/src/app/loading";

export default function ProfileWrapper() {
    const [lang, setLang] = useState('ar');
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang'));
        }
    }, []);
    const { data: profileData, isLoading: profileLoading } = useGetProfile(lang)
    return (
        <div className="home-page-content" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <ContactHero lang={lang} subtitle={t(lang, "profile")} />
            {
                profileLoading ? <Loading /> :
                    <div className="container">
                        <div className="profile-content-wrapper">
                            {/* Personal Club Section */}
                            <div className="personal-club-content">

                                <div className="order-section">
                                    {/* Header with Download Button */}
                                    <div className="order-section-header">
                                        <div className="img-cont">
                                            <Image src={usersIcon} alt="user-icon" />
                                        </div>
                                        <span>{t(lang, "user_info")}</span>
                                    </div>

                                    <div className="form-grid">
                                        {/* Club Logo */}
                                        <div className="form-field full-width">
                                            <label className="field-label">{t(lang, "club_logo")}</label>
                                            <div className="club-logo-container-profile">
                                                <Image
                                                    src={profileData.logo}
                                                    alt="Club Logo"
                                                    width={120}
                                                    height={120}
                                                    className="club-logo-image-profile"
                                                />
                                            </div>
                                        </div>

                                        {/* Club Name and National Address - Two Columns */}
                                        <div className="form-field">
                                            <label className="field-label">{t(lang, "club_name")}</label>
                                            <Input
                                                type="text"
                                                value={profileData.name}
                                                readOnly
                                                className="field-input"
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label className="field-label">{t(lang, "national_address")}</label>
                                            <Input
                                                type="text"
                                                value={profileData?.address || ''}
                                                readOnly
                                                className="field-input"
                                            />
                                        </div>

                                        {/* City and Administrative Region - Two Columns */}
                                        <div className="form-field">
                                            <label className="field-label">{t(lang, "city")}</label>
                                            <Input
                                                type="text"
                                                value={profileData?.city?.name || ''}
                                                readOnly
                                                className="field-input"
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label className="field-label">{t(lang, "administrative_region")}</label>
                                            <Input
                                                type="text"
                                                value={profileData?.area?.name || ''}
                                                readOnly
                                                className="field-input"
                                            />
                                        </div>

                                        {/* License Number and Official Email - Two Columns */}
                                        <div className="form-field">
                                            <label className="field-label">{t(lang, "license_number")}</label>
                                            <Input
                                                type="text"
                                                value={profileData?.licenseNumber || ''}
                                                readOnly
                                                className="field-input"
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label className="field-label">{t(lang, "official_email")}</label>
                                            <Input
                                                type="email"
                                                value={profileData?.email || ''}
                                                readOnly
                                                className="field-input"
                                            />
                                        </div>

                                        {/* Mobile Number - Full Width */}
                                        <div className="form-field full-width">
                                            <label className="field-label">{t(lang, "mobile_number")}</label>
                                            <div className="input-of-mobile-num">
                                                <div className="country-select">
                                                    <Select value={profileData?.countryCode || '+966'} disabled>
                                                        <SelectTrigger className="country-select-trigger">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={profileData?.countryCode || '+966'}>
                                                                <div className="code-country-slug-cont">
                                                                    <div className="select-country-item-cont">
                                                                        <Image
                                                                            src={flagIcon}
                                                                            alt="flag"
                                                                            width={20}
                                                                            height={20}
                                                                            className="country-flag"
                                                                        />
                                                                    </div>
                                                                    <p>({profileData?.countryCode || '+966'})</p>
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <Input
                                                    type="tel"
                                                    className="phone-input"
                                                    style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                                                    value={profileData?.phone || ''}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}