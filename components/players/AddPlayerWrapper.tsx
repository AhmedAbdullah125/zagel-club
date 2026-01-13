"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import ContactHero from "../Contact/ContactHero";
import CongatsCard from "../global/CongatsCard";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";

import { addNewPlayer } from "../Requests/AddNewPlayer";
import { useGetCities } from "../Requests/useGetCities";

import { makePlayerSchema, defaultPlayerValues } from "./AddPlayer.schema";
import { PlayerInfoFields } from "./PlayerInfoFields";
import { UploadSections } from "./UploadSections";
import { useRouter } from "next/navigation";

export default function AddPlayerWrapper() {
    const [lang, setLang] = useState("ar");
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (typeof window !== "undefined") setLang(localStorage.getItem("lang") || "ar");
    }, []);

    const { data: cities } = useGetCities(lang);

    const playerSchema = useMemo(() => makePlayerSchema(lang), [lang]);

    const form = useForm({
        resolver: zodResolver(playerSchema),
        defaultValues: defaultPlayerValues,
    });

    const nationalities = useMemo(
        () => [
            { id: 1, name: "Saudi", value: "SAUDI" },
            { id: 2, name: "Not_Saudi", value: "NOT_SAUDI" },
        ],
        []
    );

    const onSubmit = useCallback(
        (data: any) => {
            addNewPlayer(data, setLoading, lang, router, setShowSuccess);
        },
        [lang, form]
    );

    return (
        <div className="player-wrapper license-content" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
            <ContactHero lang={lang} subtitle={t(lang, "add_player")} />

            <div className="personal-data-form">
                <div className="container">
                    <div className="personal-data-form-content">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="license-form">
                                <PlayerInfoFields lang={lang} form={form} cities={cities || []} nationalities={nationalities} />
                                <UploadSections lang={lang} form={form} />

                                <div className="form-actions">
                                    <Button type="submit" className="submit-license-btn" disabled={loading}>
                                        {loading ? <span className="loader-btn" /> : <span>{t(lang, "add_player")}</span>}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>

            {showSuccess && <CongatsCard title="تهانينا" description="تم اضافه اللاعب بنجاح" />}
        </div>
    );
}
