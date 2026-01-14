"use client"

import React, { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Select, SelectGroup, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import loginImage from "@/src/assets/images/registeration/forgetuser.jpg"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { t } from "@/lib/i18n"
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import "flag-icons/css/flag-icons.min.css";
import { sendCode } from "../Requests/sendCode"

// Zod validation schema - helper to build schema with the current language
const makeLoginSchema = (lang) =>
    z.object({
        phone: z
            .string()
            .min(1, { message: t(lang, "phone_required") })
            .regex(/^[0-9]+$/, { message: t(lang, "phone_numbers_only") })
            .min(9, { message: t(lang, "phone_min_length") }),
        country: z
            .string().min(1, { message: t(lang, "country_required") }),
    });

export default function ForgetPassword({ formData, setFormData, step, setStep, lang }) {
    const [country, setCountry] = useState("")
    const [loading, setLoading] = useState(false)
    const countries = getCountries();
    const loginSchema = useMemo(() => makeLoginSchema(lang), [lang]);

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            phone: formData?.phone || "",
            country: "+966" || "",
        },
    })

    const onSubmit = (data) => {
        sendCode(data, setLoading, lang).then(() => {
            setFormData({ ...formData, ...data })
            setStep(2)
        })
    }



    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-grid">
                    {/* Form Section */}
                    <div className="login-form-section">
                        <div className="login-header">
                            <h1 className="login-title">{t(lang, "Forgot_Password")}</h1>
                            <p className="login-subtitle">{t(lang, "Forgot_Password_subtitle")}</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="login-form">
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
                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={form.formState.errors.phone || form.formState.errors.password || form.formState.errors.country || !form.formState.isDirty}
                                >
                                    {
                                        loading ? (
                                            <span className="loader-btn"></span>
                                        ) : (
                                            <span>{t(lang, "send_verification_code")}</span>
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
                            alt="login"
                            fill
                            className="login-image"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}