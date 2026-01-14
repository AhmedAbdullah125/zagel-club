"use client"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import mailIcon from '@/src/assets/images/registeration/mailIcon.svg'
import loginImage from "@/src/assets/images/registeration/login.jpg"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { t } from "@/lib/i18n"
import "flag-icons/css/flag-icons.min.css";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";


export default function RegisterSecStep({ step, formData, setFormData, lang, setStep }) {
    const [country, setCountry] = useState("")
    const countries = getCountries();
    const registerSchema = z.object({
        phone: z.string().min(1, { message: t(lang, "phone_required") }).regex(/^[0-9]+$/, { message: t(lang, "phone_numbers_only") })
            .min(9, { message: t(lang, "phone_min_length") }),
        country: z.string().min(1, { message: t(lang, "country_required") }),
        email: z.string().email({ message: t(lang, "email_required") }),
        licenseNumber: z.string().min(3, { message: t(lang, "license_number_required") }),
    })


    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            phone: formData?.phone || "",
            country: "+966 SA" || formData?.country || "",
            email: formData?.email || "",
            licenseNumber: formData?.licenseNumber || "",
        },
    })

    const onSubmit = (data) => {
        setStep(3)
        setFormData({ ...formData, ...data })
    }

    return (
        <>
            <div className="register-progress-cont">
                <div className={step === 1 ? "step active" : "step"}></div>
                <div className={step === 2 ? "step active" : "step"}></div>
                <div className={step === 3 ? "step active" : "step"}></div>
            </div>
            <div className="login-container" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
                <div className="login-card">
                    <div className="login-grid">
                        <div className="login-form-section">
                            <div className="login-header">
                                <h1 className="login-title">{t(lang, "license_and_contact")}</h1>
                                <p className="login-subtitle">{t(lang, "register_subtitle")}</p>
                            </div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="login-form">
                                    {/* License Name Field */}
                                    <FormField
                                        control={form.control}
                                        name="licenseNumber"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-password">
                                                <FormLabel className="password-label">{t(lang, "license_number")}</FormLabel>
                                                <FormControl >
                                                    <div className={`password-input-wrapper ${form.formState.errors.licenseNumber ? 'error-password' : form.formState.isDirty && field.value ? 'success-password' : ''}`}>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            placeholder={t(lang, "license_number")}
                                                            className="password-input name-input"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="password-error" />
                                            </FormItem>
                                        )}
                                    />
                                    {/* Email Field */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-password">
                                                <FormLabel className="password-label">{t(lang, "email_label")}</FormLabel>
                                                <FormControl >
                                                    <div className={`password-input-wrapper ${form.formState.errors.email ? 'error-password' : form.formState.isDirty && field.value ? 'success-password' : ''}`}>
                                                        <Input
                                                            {...field}
                                                            type="email"
                                                            placeholder={t(lang, "email_placeholder")}
                                                            className="password-input name-input"
                                                        />
                                                        <div className="field-icon">
                                                            <Image className="eye-icon" src={mailIcon} alt="mailIcon" />
                                                        </div>
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
                                                <FormLabel className="password-label">
                                                    {t(lang, "phone_label")}
                                                </FormLabel>
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
                                                                                <SelectTrigger className="country-select-trigger ">
                                                                                    <SelectValue placeholder={t(lang, "Country")} />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {countries?.map((iso2, index) => (
                                                                                        <SelectItem value={`+${getCountryCallingCode(iso2)} ${iso2}`} key={index}>
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
                                                            placeholder={t(lang, "phone_placeholder")}
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
                                    <Button type="submit" className="submit-btn" disabled={!form.formState.isValid && !form.formState.isDirty}>
                                        <span>{t(lang, "next")}</span>
                                    </Button>
                                </form>
                            </Form>
                        </div>
                        <div className="login-image-section">
                            <Image src={loginImage} alt="login" fill className="login-image" priority />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}