import React from "react";
import { t } from "@/lib/i18n";

export default function LicenseHero({ lang, title, description }) {
    return (
        <div className="hero license-hero">
            <video className="video" autoPlay muted loop playsInline >
                <source src="/images/new.mp4" type="video/mp4" />
                {t(lang, 'video_not_supported')}
            </video>
            <div
                className="scroll-down"
                onClick={() => {
                    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
                }}
            >
                <div className="scroll-icon">↓</div>
            </div>
            <div className="overlay">
                <div className="container">
                    <div className="license-hero-cont">
                        <h2>{title}</h2>
                        <p>{description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}