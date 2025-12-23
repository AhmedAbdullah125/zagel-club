"use client"
import React, { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import ContactHero from "../Contact/ContactHero";
import Image from "next/image";
import lockIcon from '@/src/assets/images/lock.svg';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import CongatsCard from "../global/CongatsCard";
import { changePassword } from "../Requests/changePassword";
import { useRouter } from "next/navigation";

// Zod validation schema
const passwordFormSchema = (lang) => z.object({
    currentPassword: z.string().min(1, {
        message: t(lang, "current_password_required")
    }),
    newPassword: z
        .string()
        .min(1, { message: t(lang, "password_required") })
        .min(8, { message: t(lang, "repassword_min_length") })
        .regex(/[a-z]/, { message: t(lang, "password_lowercase_required") })   // min 1 lowercase
        .regex(/[A-Z]/, { message: t(lang, "password_uppercase_required") })   // min 1 uppercase
        .regex(/[0-9]/, { message: t(lang, "password_number_required") })      // min 1 number
        .regex(/[^A-Za-z0-9]/, { message: t(lang, "password_symbol_required") }) // min 1 symbol
        .regex(/[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/, { message: t(lang, "password_symbol_required") }),
    confirmPassword: z.string().min(1, {
        message: t(lang, "confirm_password_required")
    })
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: t(lang, "passwords_dont_match"),
    path: ["confirmPassword"]
});

export default function EditPasswordWrapper() {
    const [lang, setLang] = useState('ar');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter()
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang'));
        }
    }, []);

    // Initialize form with react-hook-form and Zod
    const form = useForm({
        resolver: zodResolver(passwordFormSchema(lang)),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });


    // Form submit handler
    const onSubmit = async (data) => {
        changePassword(data, setIsSubmitting, lang, router, setShowSuccess);
    };

    return (
        <div className="home-page-content" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <ContactHero lang={lang} subtitle={t(lang, "edit_password")} />

            <div className="container">
                <div className="profile-content-wrapper">
                    {/* Personal Club Section */}
                    <div className="personal-club-content">
                        <div className="order-section">
                            {/* Header */}
                            <div className="order-section-header">
                                <div className="img-cont">
                                    <Image src={lockIcon} alt="user-icon" />
                                </div>
                                <span>{t(lang, "user_info")}</span>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="form-grid-single">
                                    {/* Current Password */}
                                    <FormField
                                        control={form.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-password">
                                                <FormLabel className="password-label">{t(lang, "current_password")}</FormLabel>
                                                <FormControl>
                                                    <div className={`password-input-wrapper ${form.formState.errors.currentPassword ? 'error-password' : ''}`}>
                                                        <Input
                                                            {...field}
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder={t(lang, "current_password_placeholder")}
                                                            className="password-input"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="field-icon"
                                                        >
                                                            {showPassword ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="password-error" />
                                            </FormItem>
                                        )}
                                    />

                                    {/* New Password */}
                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-password">
                                                <FormLabel className="password-label">{t(lang, "new_password")}</FormLabel>
                                                <FormControl>
                                                    <div className={`password-input-wrapper ${form.formState.errors.newPassword ? 'error-password' : ''}`}>
                                                        <Input
                                                            {...field}
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder={t(lang, "new_password_placeholder")}
                                                            className="password-input"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="field-icon"
                                                        >
                                                            {showPassword ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="password-error" />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Confirm New Password */}
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-password">
                                                <FormLabel className="password-label">{t(lang, "confirm_new_password")}</FormLabel>
                                                <FormControl>
                                                    <div className={`password-input-wrapper ${form.formState.errors.confirmPassword ? 'error-password' : ''}`}>
                                                        <Input
                                                            {...field}
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder={t(lang, "confirm_new_password_placeholder")}
                                                            className="password-input"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="field-icon"
                                                        >
                                                            {showPassword ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="password-error" />
                                            </FormItem>
                                        )}
                                    />
                                    {/* Save Button */}
                                    <div className="form-field full-width">
                                        <Button
                                            type="submit"
                                            className="submit-license-btn"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting
                                                ? <span className="loader-btn"></span>
                                                : t(lang, "save_changes")
                                            }
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Card */}
            {showSuccess && (
                <CongatsCard
                    title={t(lang, "congratulations")}
                    description={t(lang, "password_changed_successfully")}
                />
            )}
        </div>
    )
}