"use client"
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { sendCode } from "../Requests/sendCode";
import { verifyRequest } from "../Requests/verifyRequest";
import { verifyRequestCustom } from "../Requests/verifyRequestCustom";

export default function EditPhoneNumberOTPConfirm({ lang, countryCode, phone, nextStep }) {
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(39);
    const hasCodeBeenSent = useRef(false);
    const otpSchema = z.object({ code: z.string().length(4, { message: t(lang, "verify_code_length") }).regex(/^[0-9]+$/, { message: t(lang, "verify_code_numbers_only") }), });
    const form = useForm({ resolver: zodResolver(otpSchema), defaultValues: { code: "" }, });
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const onSubmit = (data) => {
        verifyRequestCustom(data, countryCode, phone, setLoading, lang, nextStep);
    };

    const handleResend = () => {
        if (phone && countryCode) {
            const data = {
                phone: phone,
                country: countryCode
            };
            sendCode(data, setLoading, lang);
            setTimer(39);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="settings-form-container my-16" >
            <h2 className="settings-section-title">{t(lang, "verification_code")}</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="otp-form">
                    <p className="otp-description">
                        {t(lang, "verification_sent")} <span className="phone-highlight">{countryCode + phone}</span>
                    </p>

                    {/* OTP Field */}
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem className="from-input-wrapper-mobile w-full max-w-[500px]">
                                <FormControl>
                                    <InputOTP
                                        maxLength={4}
                                        {...field}
                                        className="input-of-otp"
                                    >
                                        <InputOTPGroup className="gap-4 w-full justify-between" style={{ direction: "ltr" }}>
                                            {[0, 1, 2, 3].map((index) => (
                                                <InputOTPSlot
                                                    key={index}
                                                    index={index}
                                                    className={cn(
                                                        "h-[70px] w-full text-2xl rounded-lg border-2",
                                                        form.formState.errors.code ? 'error-mob-input' : field.value?.[index] ? 'success-mob-input' : ''
                                                    )}
                                                />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="settings-submit-btn w-full max-w-[500px]" disabled={loading}>
                        {loading ? <span className="loader-btn"></span> : <span>{t(lang, "next")}</span>}
                    </Button>

                    <div className="otp-footer">
                        <div className="timer">{formatTime(timer)}</div>
                        <div className="resend-section">
                            <span className="resend-text">{t(lang, "verification_not_received")}</span>
                            <button
                                type="button"
                                className="resend-button"
                                onClick={handleResend}
                                disabled={timer > 0}
                            >
                                {t(lang, "resend_code")}
                            </button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}