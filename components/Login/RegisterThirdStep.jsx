"use client"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import loginImage from "@/src/assets/images/registeration/login.jpg"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useRouter } from "next/navigation"
import termsIcon from '@/src/assets/images/registeration/termsIcon.svg'
import termsArr from '@/src/assets/images/registeration/termsArr.svg'
import CongatsCard from "../global/CongatsCard"
import { t } from "@/lib/i18n"
import { register } from "../Requests/register"
import { useGetFixedPages } from "../Requests/useGetFixedPages"
import parse from 'html-react-parser';

export default function RegisterThirdStep({ step, formData, setStep, setFormData, lang }) {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [showTermsModal, setShowTermsModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const { data: fixedPage, isLoading } = useGetFixedPages(lang, "terms")
    const loginSchema = z.object({
        password: z
            .string()
            .min(1, { message: t(lang, "password_required") })
            .min(8, { message: t(lang, "repassword_min_length") })
            .regex(/[a-z]/, { message: t(lang, "password_lowercase_required") })   // min 1 lowercase
            .regex(/[A-Z]/, { message: t(lang, "password_uppercase_required") })   // min 1 uppercase
            .regex(/[0-9]/, { message: t(lang, "password_number_required") })      // min 1 number
            .regex(/[^A-Za-z0-9]/, { message: t(lang, "password_symbol_required") }) // min 1 symbol
            .regex(/[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/, { message: t(lang, "password_symbol_required") }),

        repassword: z.string().min(1, { message: t(lang, "repassword_required") }).min(6, { message: t(lang, "repassword_min_length") }),
        terms: z.boolean().refine((val) => val === true, {
            message: t(lang, "terms_required")
        })
    }).refine((data) => data.password === data.repassword, {
        message: t(lang, "password_mismatch"),
        path: ["repassword"],
    })

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            password: "",
            repassword: "",
            terms: false,
        },
    })

    const onSubmit = (data) => {
        setFormData({ ...formData, ...data })
        const neededData = { ...formData, ...data }
        register(neededData, setLoading, lang, setStep, router, setShowSuccessModal)
    }

    return (
        <>
            {showSuccessModal && (
                <CongatsCard
                    title="تهانينا"
                    description="تم انشاء الحساب بنجاح ستتمكن من استخدم المنصه بعد مراجعه الطلب"
                />
            )}

            <div className="register-progress-cont">
                <div className={step === 1 ? "step active" : "step"}></div>
                <div className={step === 2 ? "step active" : "step"}></div>
                <div className={step === 3 ? "step active" : "step"}></div>
            </div>
            <div className="login-container" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
                {showTermsModal && (
                    <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
                        <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
                            <button
                                className="terms-modal-close"
                                onClick={() => setShowTermsModal(false)}
                                type="button"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                            </button>
                            <div className="terms-modal-header-cont">
                                <div className="terms-modal-header">
                                    <div className="terms-modal-icon">
                                        <Image src={termsIcon} alt="terms-icon" />
                                    </div>
                                    <h2 className="terms-modal-title">{t(lang, "terms_modal_title")}</h2>
                                    <div className="terms-modal-arr">
                                        <Image src={termsArr} alt="terms-icon" />
                                    </div>
                                </div>
                            </div>

                            <div className="terms-modal-content">
                                <h3 className="terms-modal-subtitle">{t(lang, "terms_modal_subtitle")}</h3>
                                <div className="terms-modal-text">
                                    {parse(fixedPage?.description)}
                                </div>
                            </div>

                            <Button
                                type="button"
                                className="terms-modal-button"
                                onClick={() => {
                                    form.setValue('terms', true)
                                    setShowTermsModal(false)
                                }}
                            >
                                {t(lang, "accept_terms_button")}
                            </Button>
                        </div>
                    </div>
                )}
                <div className="login-card">
                    <div className="login-grid">
                        <div className="login-form-section">
                            <div className="login-header">
                                <h1 className="login-title">{t(lang, "login_data_and_agreement")}</h1>
                                <p className="login-subtitle">{t(lang, "register_subtitle")}</p>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="login-form">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-password">
                                                <FormLabel className="password-label">
                                                    {t(lang, "password_label")}
                                                </FormLabel>
                                                <FormControl>
                                                    <div className={`password-input-wrapper ${form.formState.errors.password ? 'error-password' : form.formState.isDirty && field.value ? 'success-password' : ''}`}>
                                                        <Input
                                                            {...field}
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder={t(lang, "password_placeholder")}
                                                            className="password-input"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="field-icon"
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff className="eye-icon" />
                                                            ) : (
                                                                <Eye className="eye-icon" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="password-error" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="repassword"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-password">
                                                <FormLabel className="password-label">
                                                    {t(lang, "confirm_password_label")}
                                                </FormLabel>
                                                <FormControl>
                                                    <div className={`password-input-wrapper ${form.formState.errors.password ? 'error-password' : form.formState.isDirty && field.value ? 'success-password' : ''}`}>
                                                        <Input
                                                            {...field}
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder={t(lang, "confirm_password_placeholder")}
                                                            className="password-input"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="field-icon"
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff className="eye-icon" />
                                                            ) : (
                                                                <Eye className="eye-icon" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="password-error" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="terms"
                                        render={({ field }) => (
                                            <FormItem className="terms-checkbox-wrapper">
                                                <div className="terms-checkbox-container">
                                                    <FormControl>
                                                        <input
                                                            type="checkbox"
                                                            checked={field.value}
                                                            onChange={field.onChange}
                                                            className="terms-checkbox"
                                                            id="terms"
                                                        />
                                                    </FormControl>
                                                    <label htmlFor="terms" className="terms-label">
                                                        {t(lang, "agree_terms")} <button type="button" onClick={(e) => { e.preventDefault(); setShowTermsModal(true) }} className="terms-link">{t(lang, "terms_and_conditions")}</button>
                                                    </label>
                                                </div>
                                                <FormMessage className="terms-error" />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" className="submit-btn" disabled={!form.formState.isValid && !form.formState.isDirty}>
                                        {loading ? (
                                            <span className="loader-btn"></span>
                                        ) : (
                                            <span>{t(lang, "register_button")}</span>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </div>

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
        </>
    )
}