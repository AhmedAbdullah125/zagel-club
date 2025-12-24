"use client"
import React, { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import Image from "next/image";
import profileIcon from "@/src/assets/images/license/profileIcon.svg";
import attachementsIcon from '@/src/assets/images/attachementsIcon.svg';
import flagIcon from '@/src/assets/images/flag.svg';
import calenderIcon from '@/src/assets/images/license/calender.svg';
import { Input } from "@/components/ui/input";
import pdf from '@/src/assets/images/pdf.svg';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ContactHero from "../Contact/ContactHero";
import { useGetSinglePlayer } from "../Requests/useGetSinglePlayer";
import Loading from "@/src/app/loading";
import FancyboxWrapper from "../ui/FancyboxWrapper";

export default function PlayerWrapper({ id }) {
    const [lang, setLang] = useState('ar');
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang') || 'ar');
        }
    }, []);
    const { data: playerData, isLoading } = useGetSinglePlayer(lang, id);

    if (isLoading) {
        return <Loading />;
    }

    // Map API data to component structure
    const userInfo = {
        personalInfo: {
            fullName: playerData?.fullName || "",
            nationalId: playerData?.nationalId || "",
            dateOfBirth: playerData?.dateOfBirth || "",
            nationality: playerData?.nationality || "",
            mobileNumber: playerData?.phone || "",
            mobileCountryCode: playerData?.countryCode || "+966",
            city: playerData?.city?.name || "",
            fullAddress: playerData?.address || "",
            email: playerData?.email || ""
        },
        documents: {
            nationalImage: playerData?.documents?.nationalImage || "",
            profilePhoto: playerData?.documents?.profilePhoto || "",
            fitnessCertificate: playerData?.documents?.fitnessCertificate || "",
            licensesMemberships: playerData?.documents?.licensesMemberships || []
        }
    };

    return (
        <div className="player-wrapper">
            <ContactHero lang={lang} title={t(lang, "registered_players_list")} subtitle={t(lang, "player_details")} />
            <div className="container">
                <div className="personal-club-content" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>

                    {/* User Information Section */}
                    <div className="order-section">
                        <div className="order-section-header">
                            <div className="img-cont">
                                <Image src={profileIcon} alt="user-icon" />
                            </div>
                            <span>{t(lang, "user_info")}</span>
                        </div>

                        <div className="form-grid">
                            <div className="form-field">
                                <label className="field-label">{t(lang, "full_name")}</label>
                                <Input
                                    type="text"
                                    value={userInfo.personalInfo.fullName}
                                    readOnly
                                    className="field-input"
                                />
                            </div>

                            <div className="form-field">
                                <label className="field-label">{t(lang, "national_id_number")}</label>
                                <Input
                                    type="text"
                                    value={userInfo.personalInfo.nationalId}
                                    readOnly
                                    className="field-input"
                                />
                            </div>

                            <div className="form-field">
                                <label className="field-label">{t(lang, "birth_date")}</label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        value={userInfo.personalInfo.dateOfBirth}
                                        readOnly
                                        className="field-input"
                                    />
                                    <Image src={calenderIcon} alt="calendar-icon" className="date-icon" />
                                </div>
                            </div>

                            <div className="form-field">
                                <label className="field-label">{t(lang, "nationality")}</label>
                                <Select value={userInfo.personalInfo.nationality} disabled >
                                    <SelectTrigger className={`field-input select-trigger disabled:opacity-1 ${lang == "ar" ? "ar-select-trigger" : "en-select-trigger"}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={userInfo.personalInfo.nationality}>
                                            {userInfo.personalInfo.nationality}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="form-field">
                                <label className="field-label">{t(lang, "Phone_Number")}</label>
                                <div className="input-of-mobile-num">
                                    <div className="country-select">
                                        <Select value={userInfo.personalInfo.mobileCountryCode} disabled>
                                            <SelectTrigger className="country-select-trigger disabled:opacity-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={userInfo.personalInfo.mobileCountryCode}>
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
                                                        <p>({userInfo.personalInfo.mobileCountryCode})</p>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Input
                                        type="tel"
                                        className="phone-input"
                                        style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                                        value={userInfo.personalInfo.mobileNumber}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="form-field">
                                <label className="field-label">{t(lang, "city")}</label>
                                <Select value={userInfo.personalInfo.city} disabled>
                                    <SelectTrigger className={`field-input select-trigger disabled:opacity-1 ${lang == "ar" ? "ar-select-trigger" : "en-select-trigger"}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={userInfo.personalInfo.city}>
                                            {userInfo.personalInfo.city}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="form-field">
                                <label className="field-label">{t(lang, "email")}</label>
                                <Input
                                    type="email"
                                    value={userInfo.personalInfo.email}
                                    readOnly
                                    className="field-input"
                                />
                            </div>

                            <div className="form-field ">
                                <label className="field-label">{t(lang, "detailed_address")}</label>
                                <Input
                                    type="text"
                                    value={userInfo.personalInfo.fullAddress}
                                    readOnly
                                    className="field-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Attachments Section */}
                    <div className="order-section">
                        <div className="order-section-header">
                            <div className="img-cont">
                                <Image src={attachementsIcon} alt="attachements-icon" />
                            </div>
                            <span>{t(lang, "attachments")}</span>
                        </div>

                        <div className="attachment-grid">
                            {/* Fitness Certificate - Optional */}
                            {userInfo.documents.fitnessCertificate && (
                                <div className="attachment-item">
                                    <label className="field-label">{t(lang, "fitness_certificate")}</label>
                                    <div className="attachment-preview pdf">
                                        <FancyboxWrapper>
                                            <a href={userInfo.documents.fitnessCertificate} data-fancybox="pdfs" data-type="iframe" data-preload="false" data-toolbar="true" data-small-btn="true" data-iframe='{"preload":false}'>
                                                <Image src={pdf} alt="pdf" />
                                            </a>
                                        </FancyboxWrapper>
                                    </div>
                                </div>
                            )}

                            {/* National ID Image */}
                            {userInfo.documents.nationalImage && (
                                <div className="attachment-item">
                                    <label className="field-label">{t(lang, "national_id_photo")}</label>
                                    <div className="attachment-preview image">
                                        <FancyboxWrapper>
                                            <a href={userInfo.documents.nationalImage} data-fancybox="gallery">
                                                <Image src={userInfo.documents.nationalImage} alt="National ID" width={200} height={200} />
                                            </a>
                                        </FancyboxWrapper>
                                    </div>
                                </div>
                            )}

                            {/* Profile Photo */}
                            {userInfo.documents.profilePhoto && (
                                <div className="attachment-item">
                                    <label className="field-label">{t(lang, "personal_photo")}</label>
                                    <div className="attachment-preview image">
                                        <FancyboxWrapper>
                                            <a href={userInfo.documents.profilePhoto} data-fancybox="gallery">
                                                <Image src={userInfo.documents.profilePhoto} alt="Profile Photo" width={200} height={200} />
                                            </a>
                                        </FancyboxWrapper>
                                    </div>
                                </div>
                            )}

                            {/* Licenses & Memberships - Multiple files */}
                            {userInfo.documents.licensesMemberships?.length > 0 && (
                                <div className="attachment-item">
                                    <label className="field-label">{t(lang, "club_approval")}</label>
                                    <div className="attachment-preview-multiple">
                                        {userInfo.documents.licensesMemberships.map((fileUrl, index) => (
                                            <div key={index} className="attachment-preview pdf small">
                                                <FancyboxWrapper>
                                                    <a href={fileUrl} data-fancybox="pdfs" data-type="iframe" data-preload="false" data-toolbar="true" data-small-btn="true" data-iframe='{"preload":false}' >
                                                        <Image src={pdf} alt="pdf" />
                                                    </a>
                                                </FancyboxWrapper>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}