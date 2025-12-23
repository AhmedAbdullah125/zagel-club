"use client"
import React, { useMemo, useState } from "react"
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
import { t } from "@/lib/i18n"
import CongatsCard from "../global/CongatsCard"
import { resetPassword } from "../Requests/resetPassword"

// Zod validation schema with translations
const makeLoginSchema = (lang) =>
    z.object({
        password: z.string().min(1, { message: t(lang, "password_required") })
            .min(8, { message: t(lang, "repassword_min_length") })
            .regex(/[a-z]/, { message: t(lang, "password_lowercase_required") })   // min 1 lowercase
            .regex(/[A-Z]/, { message: t(lang, "password_uppercase_required") })   // min 1 uppercase
            .regex(/[0-9]/, { message: t(lang, "password_number_required") })      // min 1 number
            .regex(/[^A-Za-z0-9]/, { message: t(lang, "password_symbol_required") }) // min 1 symbol
            .regex(/[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/, { message: t(lang, "password_symbol_required") }),

        repassword: z.string().min(1, { message: t(lang, "repassword_required") }).min(6, { message: t(lang, "password_min_length") }),
    })
        .refine((data) => data.password === data.repassword, { message: t(lang, "password_mismatch"), path: ["repassword"], });

export default function ResetPassword({ formData, setFormData, lang }) {
    const loginSchema = useMemo(() => makeLoginSchema(lang), [lang]);
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const router = useRouter()
    const form = useForm({ resolver: zodResolver(loginSchema), defaultValues: { password: "", repassword: "", }, })
    const onSubmit = (data) => {
        const neededData = { ...formData, ...data }
        setFormData({ ...formData, ...data })
        resetPassword(neededData, setLoading, lang, router, setShowSuccessModal)

    }
    return (
        <div className="login-container">
            {/* Success Modal */}
            {showSuccessModal && (
                <CongatsCard title={t(lang, "congratulations")} description={t(lang, "password_changed_successfully")} />
            )}
            <div className="login-card">
                <div className="login-grid">
                    {/* Form Section */}
                    <div className="login-form-section">
                        <div className="login-header">
                            <h1 className="login-title">{t(lang, "reset_password_title")}</h1>
                            <p className="login-subtitle">{t(lang, "reset_password_subtitle")}</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="login-form">


                                {/* Password Field */}
                                <FormField

                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="from-input-wrapper-password">
                                            <FormLabel className="password-label">{t(lang, "Password")} </FormLabel>
                                            <FormControl >
                                                <div className={`password-input-wrapper ${form.formState.errors.password ? 'error-password' : form.formState.isDirty && field.value ? 'success-password' : ''}`}>
                                                    <Input
                                                        {...field}
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder={t(lang, "Password")}
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
                                {/* RePassword Field */}
                                <FormField

                                    control={form.control}
                                    name="repassword"
                                    render={({ field }) => (
                                        <FormItem className="from-input-wrapper-password">
                                            <FormLabel className="password-label">
                                                {t(lang, "confirm_password")}
                                            </FormLabel>
                                            <FormControl >
                                                <div className={`password-input-wrapper ${form.formState.errors.password ? 'error-password' : form.formState.isDirty && field.value ? 'success-password' : ''}`}>
                                                    <Input
                                                        {...field}
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder={t(lang, "confirm_password")}
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
                                            <span>{t(lang, "reset_password_button")}</span>
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