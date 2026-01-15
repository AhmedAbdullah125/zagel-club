"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Image from "next/image"
import loginImage from "@/src/assets/images/registeration/otpUser.jpg"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot, } from "@/components/ui/input-otp"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { t } from "@/lib/i18n"
import { verifyRequest } from "../Requests/verifyRequest"
import { sendCode } from "../Requests/sendCode"
// Zod validation schema
// helper to build schema with the current language
const makeLoginSchema = (lang) =>
    z.object({
        code: z
            .string()
            .length(4, { message: t(lang, "verify_code_length") })
            .regex(/^[0-9]+$/, { message: t(lang, "verify_code_numbers_only") }),
    });

export default function Verify({ formData, setFormData, step, setStep, lang, link }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const loginSchema = useMemo(() => makeLoginSchema(lang), [lang]);

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            code: "",
        },
    });

    const onSubmit = (data) => {
        const neededData = { ...formData, ...data }
        setFormData(neededData)
        verifyRequest(neededData, setLoading, lang, setStep, step, link, router)

    };

    const [resendCooldown, setResendCooldown] = useState(30);

    useEffect(() => {
        if (resendCooldown <= 0) return;

        const intervalId = setInterval(() => {
            setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [resendCooldown]);
    const nextStep = () => {
        setResendCooldown(30);

    }
    const handleResendOTP = () => {
        if (resendCooldown > 0) return;
        sendCode(formData, setLoading, lang, nextStep)
    };
    console.log(formData);

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-grid">
                    {/* Form Section */}
                    <div className="login-form-section">
                        <div className="login-header">
                            <h1 className="login-title">{t(lang, "verify")}</h1>
                            <p className="login-subtitle">{t(lang, "verify_subtitle_part1")} <span dir="ltr">{formData?.country?.split(" ")[0] + formData?.phone}</span> {t(lang, "verify_subtitle_part2")}</p>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                {/* otp Number Field */}
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem className="from-input-wrapper-mobile">
                                            <FormLabel className="password-label">
                                                {t(lang, "enter_verification_code")}
                                            </FormLabel>
                                            <FormControl>
                                                <InputOTP
                                                    maxLength={4}
                                                    {...field}
                                                    className="input-of-otp"
                                                >
                                                    <InputOTPGroup className="gap-4 w-full justify-between" style={{ direction: "ltr", }}>
                                                        {[0, 1, 2, 3].map((index) => (
                                                            <InputOTPSlot
                                                                key={index}
                                                                index={index}
                                                                className={cn(
                                                                    "h-[70px] w-full  text-2xl rounded-lg border-2",
                                                                    form.formState.errors.code ? 'error-mob-input' : field.value?.[index] ? 'success-mob-input' : ''
                                                                )}
                                                            />
                                                        ))}
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <div className="flex items-center justify-between">
                                                <FormMessage id="phone-error" />
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
                                            <span>{t(lang, "confirm_code")}</span>
                                        )
                                    }
                                </Button>
                                <div className="signup-wrapper">
                                    {t(lang, "didnt_receive_code")}{" "}
                                    <Button onClick={handleResendOTP}

                                        type="button" className="signup-btn">
                                        {resendCooldown > 0
                                            ? `${resendCooldown} ${t(lang, "seconds")}`
                                            :
                                            t(lang, "resend_verification_code")}</Button>
                                </div>
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