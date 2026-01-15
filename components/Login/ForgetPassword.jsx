"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import loginImage from "@/src/assets/images/registeration/forgetuser.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { t } from "@/lib/i18n";

import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import "flag-icons/css/flag-icons.min.css";

import { sendCode } from "../Requests/sendCode";

// ✅ Combobox imports (Shadcn)
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Zod validation schema
const makeLoginSchema = (lang) =>
    z.object({
        phone: z
            .string()
            .min(1, { message: t(lang, "phone_required") })
            .regex(/^[0-9]+$/, { message: t(lang, "phone_numbers_only") })
            .min(9, { message: t(lang, "phone_min_length") }),

        country: z.string().min(1, { message: t(lang, "country_required") }),
    });

/** ✅ Country code searchable combobox (same structure as ContactWrapper) */
function CountryCodeCombobox({
    value,
    onChange,
    lang,
    placeholder,
}) {
    const [open, setOpen] = useState(false);

    const countries = useMemo(() => getCountries(), []);

    const items = useMemo(() => {
        return countries.map((iso2) => {
            const calling = getCountryCallingCode(iso2);
            const v = `+${calling}`;

            return {
                iso2,
                calling,
                value: v,
                searchValue: `${iso2} ${calling} +${calling}`,
            };
        });
    }, [countries]);

    const selected = useMemo(() => {
        if (!value) return null;
        const digits = value.replace("+", "").trim();
        return items.find((x) => x.calling === digits) || null;
    }, [value, items]);

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
                                {selected?.iso2 ? <span className={`fi fi-${selected.iso2.toLowerCase()}`} /> : null}
                                <span className="opacity-80">{value}</span>
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
                            <CommandItem
                                key={c.iso2}
                                value={c.searchValue}
                                onSelect={() => {
                                    onChange(c.value);
                                    setOpen(false);
                                }}
                            >
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

export default function ForgetPassword({ formData, setFormData, step, setStep, lang }) {
    const [loading, setLoading] = useState(false);

    const loginSchema = useMemo(() => makeLoginSchema(lang), [lang]);

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            phone: formData?.phone || "",
            country: formData?.country || "+966",
        },
        mode: "onChange",
    });
    const nextStep = () => {
        setStep(2);

    }
    const onSubmit = (data) => {
        setFormData({ ...formData, ...data });
        sendCode(data, setLoading, lang, nextStep)
    };

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
                                            <FormLabel className="password-label">{t(lang, "phone_label")}</FormLabel>

                                            <FormControl>
                                                <div
                                                    className={`input-of-mobile-num ${form.formState.errors.phone || form.formState.errors.country
                                                        ? "error-mob-input"
                                                        : form.formState.isDirty && field.value && form.getValues("country")
                                                            ? "success-mob-input"
                                                            : ""
                                                        }`}
                                                >
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
                                                        placeholder={t(lang, "phone_placeholder")}
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

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={!!form.formState.errors.phone || !!form.formState.errors.country || loading}
                                >
                                    {loading ? <span className="loader-btn"></span> : <span>{t(lang, "send_verification_code")}</span>}
                                </Button>
                            </form>
                        </Form>
                    </div>

                    {/* Image Section */}
                    <div className="login-image-section">
                        <Image src={loginImage} alt="login" fill className="login-image" priority />
                    </div>
                </div>
            </div>
        </div>
    );
}
