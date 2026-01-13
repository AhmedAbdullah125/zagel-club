"use client"
import React from "react";
import { t } from "@/lib/i18n";
import Image from "next/image";
import profileIcon from "@/src/assets/images/license/profileIcon.svg";
import usersIcon from '@/src/assets/images/license/usersIcon.svg';
import attachementsIcon from '@/src/assets/images/attachementsIcon.svg';
import calenderIcon from '@/src/assets/images/license/calender.svg';
import { Input } from "@/components/ui/input";
import pdf from '@/src/assets/images/pdf.svg';
import FancyboxWrapper from "../ui/FancyboxWrapper";

export default function PersonalAndClubData({ lang, userInfo }) {
  if (!userInfo) return null;
  return (
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
              className={`field-input ${userInfo.personalInfo.fullName ? "success-mob-input" : ""}`}
            />
          </div>

          <div className="form-field">
            <label className="field-label">{t(lang, "national_id_number")}</label>
            <Input
              type="text"
              value={userInfo.personalInfo.nationalId}
              readOnly
              className={`field-input ${userInfo.personalInfo.nationalId ? "success-mob-input" : ""}`}
            />
          </div>

          <div className="form-field">
            <label className="field-label">{t(lang, "birth_date")}</label>
            <div className="relative">
              <Input
                type="text"
                value={userInfo.personalInfo.dateOfBirth}
                readOnly
                className={`field-input ${userInfo.personalInfo.dateOfBirth ? "success-mob-input" : ""}`}
              />
              <Image src={calenderIcon} alt="calendar-icon" className="date-icon" />
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">{t(lang, "nationality")}</label>
            <Input
              type="text"
              value={userInfo.personalInfo.nationality}
              readOnly
              className={`field-input ${userInfo.personalInfo.nationality ? "success-mob-input" : ""}`}
            />
          </div>

          <div className="form-field">
            <label className="field-label">{t(lang, "Phone_Number")}</label>
            <div className="input-of-mobile-num success-mob-input">
              <div className="country-select">
                <div className="country-code-display">
                  {userInfo.personalInfo.mobileCountryCode}
                </div>
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
            <Input
              type="text"
              value={userInfo.personalInfo.city.name}
              readOnly
              className={`field-input ${userInfo.personalInfo.city.name ? "success-mob-input" : ""}`}
            />
          </div>

          <div className="form-field full-width">
            <label className="field-label">{t(lang, "detailed_address")}</label>
            <Input
              type="text"
              value={userInfo.personalInfo.fullAddress}
              readOnly
              className={`field-input ${userInfo.personalInfo.fullAddress ? "success-mob-input" : ""}`}
            />
          </div>
          {/* 
          {userInfo.typeText && (
            <div className="form-field">
              <label className="field-label">{t(lang, "service_type_label")}</label>
              <Input
                type="text"
                value={userInfo.typeText}
                readOnly
                className={`field-input ${userInfo.typeText ? "success-mob-input" : ""}`}
              />
            </div>
          )}

          {userInfo.licenseTypeText && (
            <div className="form-field">
              <label className="field-label">{t(lang, "license_type_label")}</label>
              <Input
                type="text"
                value={userInfo.licenseTypeText}
                readOnly
                className={`field-input ${userInfo.licenseTypeText ? "success-mob-input" : ""}`}
              />
            </div>
          )} */}
        </div>
      </div>

      {/* Club Information Section */}
      <div className="order-section">
        <div className="order-section-header">
          <div className="img-cont">
            <Image src={usersIcon} alt="club-icon" />
          </div>
          <span>{t(lang, "club_info")}</span>
        </div>

        <div className="form-grid">
          <div className="form-field full-width">
            <label className="field-label">{t(lang, "club_name")}</label>
            <Input
              type="text"
              value={userInfo.clubInfo.clubName}
              readOnly
              className={`field-input ${userInfo.clubInfo.clubName ? "success-mob-input" : ""}`}
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
          {userInfo.attachments.clubApproval.url && (
            <div className="attachment-item">
              <label className="field-label">{userInfo.attachments.clubApproval.label}</label>
              <div className="attachment-preview pdf">
                <FancyboxWrapper>
                  <a href={userInfo.attachments.clubApproval.url} data-fancybox="pdfs" data-type="iframe" data-preload="false" data-toolbar="true" data-small-btn="true" data-iframe='{"preload":false}'>
                    <Image src={pdf} alt="pdf-icon" />
                  </a>
                </FancyboxWrapper>

              </div>
            </div>
          )}

          {userInfo.attachments.idPhoto.url && (
            <div className="attachment-item">
              <label className="field-label">{userInfo.attachments.idPhoto.label}</label>
              <div className="attachment-preview image">
                <FancyboxWrapper>
                  <a href={userInfo.attachments.idPhoto.url} data-fancybox="gallery">
                    <Image src={userInfo.attachments.idPhoto.url} alt="ID Photo" width={120} height={90} className="preview-img" unoptimized />
                  </a>
                </FancyboxWrapper>
              </div>
            </div>
          )}

          {userInfo.attachments.personalPhoto.url && (
            <div className="attachment-item">
              <label className="field-label">{userInfo.attachments.personalPhoto.label}</label>
              <div className="attachment-preview image">
                <FancyboxWrapper>
                  <a href={userInfo.attachments.personalPhoto.url} data-fancybox="gallery">
                    <Image src={userInfo.attachments.personalPhoto.url} alt="Personal Photo" width={120} height={90} className="preview-img" unoptimized />
                  </a>
                </FancyboxWrapper>
              </div>
            </div>
          )}

          {userInfo.attachments.fitnessCertificate?.url && (
            <div className="attachment-item">
              <label className="field-label">{userInfo.attachments.fitnessCertificate.label}</label>
              <div className="attachment-preview pdf">
                <FancyboxWrapper>
                  <a href={userInfo.attachments.fitnessCertificate.url} data-fancybox="pdfs" data-type="iframe" data-preload="false" data-toolbar="true" data-small-btn="true" data-iframe='{"preload":false}'>
                    <Image src={pdf} alt="pdf-icon" />
                  </a>
                </FancyboxWrapper>
              </div>
            </div>
          )}
          {
            userInfo.serviceFiles?.length > 0 &&
            <div className="attachment-item ">
              <label className="field-label">{t(lang, "management_attachments")}</label>
              <div className="response-grid">
                {
                  userInfo.serviceFiles.map((file) => (
                    <div className="attachment-preview pdf" key={file}>
                      <FancyboxWrapper>
                        <a href={file} data-fancybox="pdfs" data-type="iframe" data-preload="false" data-toolbar="true" data-small-btn="true" data-iframe='{"preload":false}'>
                          <Image src={pdf} alt="pdf-icon" />
                        </a>
                      </FancyboxWrapper>
                    </div>
                  ))
                }
              </div>
            </div>

          }
        </div>
      </div>

    </div>
  )
}