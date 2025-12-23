import React from "react";
import { t } from "@/lib/i18n";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function ContactHero({ lang, title, subtitle }) {
    return (
        <div className="hero contact-hero">
            <video className="video" autoPlay muted loop playsInline >
                <source src="/images/new.mp4" type="video/mp4" />
                {t(lang, 'video_not_supported')}
            </video>

            <div className="overlay">
                <div className="container">
                    <div className="contact-hero-cont">
                        {
                            title && <h3>{title}</h3>
                        }
                        {
                            subtitle && title ? lang == "ar" ? <ChevronLeft /> : <ChevronRight /> : null
                        }
                        {subtitle && <h2>{subtitle}</h2>}

                    </div>
                </div>
            </div>
        </div>
    );
}