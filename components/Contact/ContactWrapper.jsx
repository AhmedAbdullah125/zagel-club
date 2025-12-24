"use client"
import React, { useEffect, useMemo, useState } from "react";
import loginImage from "@/src/assets/images/registeration/contactimg.jpg"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Select, SelectGroup, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import flag from "@/src/assets/images/flag.svg"
import { t } from "@/lib/i18n"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import greenMobIcon from "@/src/assets/images/registeration/greenMobIcon.svg"
import greenMailIcon from "@/src/assets/images/registeration/greenMainIcon.svg"
import greenLocationIcon from "@/src/assets/images/registeration/greenLocationIcon.svg"
import ContactHero from "./ContactHero";
import CongatsCard from "../global/CongatsCard";
import { useGetProfile } from "../Requests/useGetProfile";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import "flag-icons/css/flag-icons.min.css";
import { contactUs } from "../Requests/contactUs";
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
                return parts.length === 3 && parts.every((p) => p.length >= 2);
            }, { message: t(lang, "name_must_be_three_words") }),

        message: z
            .string()
            .min(1, { message: t(lang, "message_required") })
            .min(10, { message: t(lang, "message_min_length") }),

        country: z.string().min(1, { message: t(lang, "country_required") }),
    });

export default function ContactWrapper() {
    const [lang, setLang] = useState('ar');
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang'));
        }
    }, []);
    const [showCongrats, setShowCongrats] = useState(false)
    const [country, setCountry] = useState("")
    const [loading, setLoading] = useState(false)
    const contactSchema = useMemo(() => makeContactSchema(lang), [lang]);
    const { data: profile } = useGetProfile(lang);
    const form = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            phone: profile?.phone,
            name: profile?.name,
            message: "",
            country: profile?.countryCode,
        },
    })

    const onSubmit = (data) => {
        contactUs(data, setLoading, lang, form, setShowCongrats)
    }

    const countries = getCountries();

    useEffect(() => {
        form.setValue("country", profile?.countryCode)
        form.setValue("phone", profile?.phone)
        form.setValue("name", profile?.name)
    }, [profile])

    return (
        <div className="contact-page-content" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
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
                                    {/* Name Field */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-password">
                                                <FormControl>
                                                    <div className={`password-input-wrapper ${form.formState.errors.name ? 'error-password' : form.formState.isDirty && field.value ? 'success-password' : ''}`}>
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

                                    {/* Phone Number Field */}
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-mobile">
                                                <FormControl>
                                                    <div className={`input-of-mobile-num ${form.formState.errors.phone || form.formState.errors.country
                                                        ? 'error-mob-input'
                                                        : form.formState.isDirty && (field.value && country && !form.formState.errors.phone && !form.formState.errors.country)
                                                            ? 'success-mob-input'
                                                            : ''
                                                        }`}>
                                                        <div className="country-select">
                                                            <FormField
                                                                control={form.control}
                                                                name="country"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Select
                                                                                value={field.value}
                                                                                onValueChange={(value) => {
                                                                                    setCountry(value);
                                                                                    field.onChange(value);
                                                                                }}
                                                                            >
                                                                                <SelectTrigger className="country-select-trigger">
                                                                                    <SelectValue placeholder={t(lang, "Country")} />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectGroup>
                                                                                        {countries?.map((iso2, index) => (
                                                                                            <SelectItem value={`+${getCountryCallingCode(iso2)}`} key={index}>
                                                                                                <div className="code-country-slug-cont">
                                                                                                    <div className="select-country-item-cont">
                                                                                                        <span>
                                                                                                            <span className={`fi fi-${iso2.toLowerCase()}`} />{" "}
                                                                                                            +{getCountryCallingCode(iso2)}
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </SelectItem>
                                                                                        ))}
                                                                                    </SelectGroup>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </FormControl>
                                                                        <FormMessage className="hidden" id="country-error" />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        <Input
                                                            type="tel"
                                                            className="phone-input"
                                                            style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                                                            placeholder={t(lang, "Phone_Number")}
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <div className="flex items-center justify-between">
                                                    <FormMessage id="phone-error" />
                                                    {
                                                        form.formState.errors.country && (
                                                            <p className="country-error">{form.formState.errors.country?.message}</p>
                                                        )
                                                    }
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Message Textarea Field */}
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-textarea">
                                                <FormControl>
                                                    <div className={`textarea-wrapper ${form.formState.errors.message ? 'error-textarea' : form.formState.isDirty && field.value ? 'success-textarea' : ''}`}>
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

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="submit-btn"
                                        disabled={loading}
                                    >
                                        {
                                            loading ? (
                                                <span className="loader-btn"></span>
                                            ) : (
                                                <span>{t(lang, "send")}</span>
                                            )
                                        }
                                    </Button>
                                </form>
                            </Form>
                        </div>
                        {/* Image Section */}
                        <div className="login-image-section">
                            <Image
                                src={loginImage}
                                alt="contact"
                                fill
                                className="login-image"
                                priority
                            />
                        </div>
                    </div>
                    <div className="contact-info-section">
                        <h1>{t(lang, "stay_in_touch")}</h1>
                        <p className="contact_subtitle">{t(lang, "stay_in_touch_subtitle")}</p>

                        <div className="contact-cards-grid">
                            {/* Address Card */}
                            <div className="contact-card">
                                <div className="contact-card-icon">
                                    <Image src={greenLocationIcon} alt="Location" width={24} height={24} />
                                </div>
                                <h3 className="contact-card-title">{t(lang, "address_title")}</h3>
                                <p className="contact-card-subtitle">{t(lang, "address_location")}</p>
                                <p className="contact-card-value">{t(lang, "address_details")}</p>
                            </div>

                            {/* Email Card */}
                            <div className="contact-card">
                                <div className="contact-card-icon">
                                    <Image src={greenMailIcon} alt="Email" width={24} height={24} />
                                </div>
                                <h3 className="contact-card-title">{t(lang, "contact_title")}</h3>
                                <p className="contact-card-subtitle">{t(lang, "contact_inquiries")}</p>
                                <a
                                    href={`mailto:${t(lang, "contact_email")}`}
                                    className="contact-card-link"
                                >
                                    {t(lang, "contact_email")}
                                </a>
                            </div>

                            {/* Phone Card */}
                            <div className="contact-card">
                                <div className="contact-card-icon">
                                    <Image src={greenMobIcon} alt="Phone" width={24} height={24} />
                                </div>
                                <h3 className="contact-card-title">{t(lang, "phone_contact_title")}</h3>
                                <p className="contact-card-subtitle">{t(lang, "phone_contact_subtitle")}</p>
                                <a
                                    href={`tel:${t(lang, "phone_number_display").replace(/\s/g, '')}`}
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
                <CongatsCard
                    title="تهانينا"
                    description="تم ارسال طلب شكوتك بنجاح"
                />
            )}
        </div>
    )
}