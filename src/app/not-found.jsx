"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { t } from "@/lib/i18n";

export default function NotFound() {
    const [lang, setLang] = useState('ar');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang') || 'ar');
        }
    }, []);

    return (
        <main className="min-h-[70vh] flex items-center justify-center px-6 py-16" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
            <div className="max-w-2xl w-full text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
                    <span className="font-semibold">{t(lang, 'not_found_404')}</span>
                    <span className="opacity-70">|</span>
                    <span className="opacity-70">{t(lang, 'page_not_found')}</span>
                </div>

                {/* Title */}
                <h1 className="mt-6 text-3xl sm:text-4xl font-bold leading-tight">
                    {t(lang, 'page_not_found_title')}
                </h1>

                {/* Subtitle */}
                <p className="mt-4 text-base sm:text-lg opacity-80">
                    {t(lang, 'page_not_found_desc')}
                </p>

                {/* “Story” Card */}
                <div className="mt-8 rounded-2xl border p-6 text-start shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="text-3xl">🏆</div>
                        <div>
                            <p className="font-semibold">{t(lang, 'quick_links_title')}</p>
                            <p className="mt-1 opacity-80 text-sm">
                                {t(lang, 'quick_links_desc')}
                            </p>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Link
                                    href="/auctions"
                                    className="rounded-xl border px-4 py-3 hover:shadow-sm transition"
                                >
                                    <div className="font-semibold">🪙 {t(lang, 'auctions_card_title')}</div>
                                    <div className="text-sm opacity-75">{t(lang, 'auctions_card_desc')}</div>
                                </Link>

                                <Link
                                    href="/timeline"
                                    className="rounded-xl border px-4 py-3 hover:shadow-sm transition"
                                >
                                    <div className="font-semibold">📅 {t(lang, 'timeline_card_title')}</div>
                                    <div className="text-sm opacity-75">{t(lang, 'timeline_card_desc')}</div>
                                </Link>

                                <Link
                                    href="/clubs"
                                    className="rounded-xl border px-4 py-3 hover:shadow-sm transition"
                                >
                                    <div className="font-semibold">🧢 {t(lang, 'clubs_card_title')}</div>
                                    <div className="text-sm opacity-75">{t(lang, 'clubs_card_desc')}</div>
                                </Link>

                                <Link
                                    href="/"
                                    className="rounded-xl border px-4 py-3 hover:shadow-sm transition"
                                >
                                    <div className="font-semibold">🏠 {t(lang, 'home_card_title')}</div>
                                    <div className="text-sm opacity-75">{t(lang, 'home_card_desc')}</div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/auctions"
                        className="rounded-xl bg-black text-white px-5 py-3 text-sm font-semibold hover:opacity-90 transition w-full sm:w-auto"
                    >
                        {t(lang, 'go_to_live_auctions')}
                    </Link>
                    <Link
                        href="/services"
                        className="rounded-xl border px-5 py-3 text-sm font-semibold hover:shadow-sm transition w-full sm:w-auto"
                    >
                        {t(lang, 'view_services')}
                    </Link>
                </div>

                {/* Footer note */}
                <p className="mt-8 text-xs opacity-60">
                    {t(lang, 'footer_tip')}
                </p>
            </div>
        </main>
    );
}
