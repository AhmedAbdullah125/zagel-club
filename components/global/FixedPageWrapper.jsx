"use client"
import React, { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import ContactHero from "../Contact/ContactHero";
import Image from "next/image";
import FancyboxWrapper from "../ui/FancyboxWrapper";
import termsIcon from '@/src/assets/images/registeration/termsIcon.svg'
import { useGetFixedPages } from "../Requests/useGetFixedPages";
import Loading from "@/src/app/loading";
import parse from 'html-react-parser';
export default function FixedPageWrapper({ type, title }) {
    const [lang, setLang] = useState('ar');
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang'));
        }
    }, []);
    const { data: fixedPage, isLoading } = useGetFixedPages(lang, type)
    // Sample news data - replace with actual data fetching based on id
    const newsData = {
        title: t(lang, title),
        description: fixedPage?.description,
        image: fixedPage?.image
    };

    return (
        <div className="home-page-content" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <ContactHero lang={lang} subtitle={t(lang, title)} />
            {
                isLoading ? <Loading /> :
                    <div className="single-news-content">
                        <div className="terms-modal-header">
                            <div className="terms-modal-icon">
                                <Image src={termsIcon} alt="terms-icon" />
                            </div>
                            <h2 className="terms-modal-title">{t(lang, title)}</h2>
                        </div>
                        <div className="container">
                            <div className="news-article">
                                {/* News Image */}
                                <div className="news-image-wrapper">
                                    <FancyboxWrapper>
                                        <a data-fancybox={`fixed`} href={newsData.image.src} className="main-auction-img">
                                            <Image
                                                src={newsData.image}
                                                alt={newsData.title}
                                                className="news-main-image"

                                                width={1700}
                                                height={750}
                                                priority
                                            />
                                        </a>
                                    </FancyboxWrapper>
                                </div>

                                {/* News Content */}
                                <div className="news-content-wrapper">
                                    <h1 className="news-article-title">{newsData.title}</h1>
                                    <div className="news-article-description">{parse(newsData.description)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}