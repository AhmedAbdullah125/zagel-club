"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import loginImage from "@/src/assets/images/registeration/contactimg.jpg";
import greenMobIcon from "@/src/assets/images/registeration/greenMobIcon.svg";
import greenMailIcon from "@/src/assets/images/registeration/greenMainIcon.svg";
import greenLocationIcon from "@/src/assets/images/registeration/greenLocationIcon.svg";

import { t } from "@/lib/i18n";
import "flag-icons/css/flag-icons.min.css";

import { getCountries, getCountryCallingCode } from "react-phone-number-input";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import ContactHero from "./ContactHero";
import CongatsCard from "../global/CongatsCard";
import { useGetProfile } from "../Requests/useGetProfile";
import { contactUs } from "../Requests/contactUs";

// ✅ Combobox imports (Shadcn)
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const makeContactSchema = (lang) =>
    z.object({
        phone: z
            .string()
            .min(1, { message: t(lang, "phone_required") })
            .regex(/^[0-9]+$/, { message: t(lang, "phone_numbers_only") })
            .min(9, { message: t(lang, "phone_min_length") }),

        name: z
            .string()
            .min(1, { message: t(lang, "name_required") })
            .transform((v) => v.trim().replace(/\s+/g, " "))
            .refine((v) => {
                const parts = v.split(" ");
                return parts.length >= 2 && parts.every((p) => p.length >= 1);
            }, { message: t(lang, "name_must_be_two_words") }),

        message: z
            .string()
            .min(1, { message: t(lang, "message_required") })
            .min(10, { message: t(lang, "message_min_length") }),

        country: z.string().min(1, { message: t(lang, "country_required") }),
    });

/** ✅ Country code searchable combobox (no focus problems) */
function CountryCodeCombobox({
    value,
    onChange,
    lang,
    placeholder,
}) {
    const [open, setOpen] = useState(false);

    // stable list
    const countries = useMemo(() => getCountries(), []);

    // Build items
    const items = useMemo(() => {
        return countries.map((iso2) => {
            const calling = getCountryCallingCode(iso2);
            const v = `+${calling} ${iso2}`; // ✅ same format you used in ContactWrapper

            return {
                iso2,
                calling,
                value: v,
                // used for searching inside Command
                searchValue: `${iso2} ${calling} +${calling}`,
            };
        });
    }, [countries]);
    console.log(value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="country-select-trigger"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}
                >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        {value ? (
                            <>
                                {/* try to show selected flag if we can infer it */}
                                <span className={`fi fi-${items.find((item) => item.calling === value.split("+")[1].split(" ")[0])?.iso2.toLowerCase()}`} />
                                <span className="opacity-80">{value.split(" ")[0]}</span>
                            </>
                        ) : (
                            <span className="opacity-70">{placeholder}</span>
                        )}
                    </span>

                    <ChevronsUpDown className="h-4 w-4 opacity-60" />
                </button>
            </PopoverTrigger>

            <PopoverContent className="p-0 w-[280px]" align="start">
                <Command dir={lang === "ar" ? "rtl" : "ltr"}>
                    <CommandInput placeholder={t(lang, "search_country")} />
                    <CommandEmpty>{t(lang, "no_countries_found")}</CommandEmpty>

                    <CommandGroup className="max-h-60 overflow-auto">
                        {items.map((c) => (
                            <CommandItem key={c.iso2} value={c.searchValue} onSelect={() => {
                                onChange(c.value);
                                setOpen(false);
                            }}>
                                <span className={`fi fi-${c.iso2.toLowerCase()}`} />
                                <span className="mx-2">+{c.calling}</span>

                                <Check className={cn("ml-auto h-4 w-4", value === c.value ? "opacity-100" : "opacity-0")} />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default function ContactWrapper() {
    const [lang, setLang] = useState("ar");
    useEffect(() => {
        if (typeof window !== "undefined") {
            setLang(localStorage.getItem("lang") || "ar");
        }
    }, []);

    const [showCongrats, setShowCongrats] = useState(false);
    const [loading, setLoading] = useState(false);

    const contactSchema = useMemo(() => makeContactSchema(lang), [lang]);
    const { data: profile } = useGetProfile(lang);

    const form = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            phone: "",
            name: "",
            message: "",
            country: "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        // ✅ update values when profile arrives
        if (!profile) return;
        form.setValue("country", profile?.countryCode || "");
        form.setValue("phone", profile?.phone || "");
        form.setValue("name", profile?.name || "");
    }, [profile]); // eslint-disable-line react-hooks/exhaustive-deps

    const onSubmit = (data) => {
        contactUs(data, setLoading, lang, form, setShowCongrats);
    };

    return (
        <div className="contact-page-content" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
            <ContactHero lang={lang} title={t(lang, "contact_us")} />

            <div className="container">
                <div className="contact-content">
                    <h1>{t(lang, "contact_us")}</h1>
                    <p className="contact_subtitle">{t(lang, "contact_subtitle")}</p>

                    <div className="login-grid">
                        {/* Form Section */}
                        <div className="login-form-section">
                            <h3 className="contact-title-mes">{t(lang, "message_label")}</h3>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="login-form">
                                    {/* Name */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-password">
                                                <FormControl>
                                                    <div
                                                        className={`password-input-wrapper ${form.formState.errors.name ? "error-password" : form.formState.isDirty && field.value ? "success-password" : ""
                                                            }`}
                                                    >
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            placeholder={t(lang, "client_name")}
                                                            className="password-input name-input"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="password-error" />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Phone + Country */}
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-mobile">
                                                <FormControl>
                                                    <div
                                                        className={`input-of-mobile-num ${form.formState.errors.phone || form.formState.errors.country
                                                            ? "error-mob-input"
                                                            : form.formState.isDirty && field.value && form.getValues("country")
                                                                ? "success-mob-input"
                                                                : ""
                                                            }`}
                                                    >
                                                        {/* ✅ Country combobox */}
                                                        <div className="country-select">
                                                            <FormField
                                                                control={form.control}
                                                                name="country"
                                                                render={({ field: countryField }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <CountryCodeCombobox
                                                                                value={countryField.value}
                                                                                onChange={(v) => countryField.onChange(v)}
                                                                                lang={lang}
                                                                                placeholder={t(lang, "Country")}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage className="hidden" id="country-error" />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>

                                                        <Input
                                                            type="tel"
                                                            className="phone-input"
                                                            style={{ direction: lang === "ar" ? "rtl" : "ltr" }}
                                                            placeholder={t(lang, "Phone_Number")}
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>

                                                <div className="flex items-center justify-between">
                                                    <FormMessage id="phone-error" />
                                                    {form.formState.errors.country && (
                                                        <p className="country-error">{(form.formState.errors.country)?.message}</p>
                                                    )}
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Message */}
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-textarea">
                                                <FormControl>
                                                    <div
                                                        className={`textarea-wrapper ${form.formState.errors.message ? "error-textarea" : form.formState.isDirty && field.value ? "success-textarea" : ""
                                                            }`}
                                                    >
                                                        <Textarea
                                                            {...field}
                                                            placeholder={t(lang, "message_content")}
                                                            className="message-textarea"
                                                            rows={5}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="textarea-error" />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" className="submit-btn" disabled={loading}>
                                        {loading ? <span className="loader-btn"></span> : <span>{t(lang, "send")}</span>}
                                    </Button>
                                </form>
                            </Form>
                        </div>

                        {/* Image Section */}
                        <div className="login-image-section">
                            <Image src={loginImage} alt="contact" fill className="login-image" priority />
                        </div>
                    </div>

                    <div className="contact-info-section">
                        <h1>{t(lang, "stay_in_touch")}</h1>
                        <p className="contact_subtitle">{t(lang, "stay_in_touch_subtitle")}</p>

                        <div className="contact-cards-grid">
                            <div className="contact-card">
                                <div className="contact-card-icon">
                                    <Image src={greenLocationIcon} alt="Location" width={24} height={24} />
                                </div>
                                <h3 className="contact-card-title">{t(lang, "address_title")}</h3>
                                <p className="contact-card-subtitle">{t(lang, "address_location")}</p>
                                <p className="contact-card-value">{t(lang, "address_details")}</p>
                            </div>

                            <div className="contact-card">
                                <div className="contact-card-icon">
                                    <Image src={greenMailIcon} alt="Email" width={24} height={24} />
                                </div>
                                <h3 className="contact-card-title">{t(lang, "contact_title")}</h3>
                                <p className="contact-card-subtitle">{t(lang, "contact_inquiries")}</p>
                                <a href={`mailto:${t(lang, "contact_email")}`} className="contact-card-link">
                                    {t(lang, "contact_email")}
                                </a>
                            </div>

                            <div className="contact-card">
                                <div className="contact-card-icon">
                                    <Image src={greenMobIcon} alt="Phone" width={24} height={24} />
                                </div>
                                <h3 className="contact-card-title">{t(lang, "phone_contact_title")}</h3>
                                <p className="contact-card-subtitle">{t(lang, "phone_contact_subtitle")}</p>
                                <a
                                    href={`tel:${t(lang, "phone_number_display").replace(/\s/g, "")}`}
                                    className="contact-card-link"
                                    dir="ltr"
                                >
                                    {t(lang, "phone_number_display")}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showCongrats && (
                <CongatsCard title="تهانينا" description="تم ارسال طلب شكوتك بنجاح" />
            )}
        </div>
    );
}
