"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import Image from "next/image";
import mailIcon from "@/src/assets/images/registeration/mailIcon.svg";
import loginImage from "@/src/assets/images/registeration/login.jpg";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { t } from "@/lib/i18n";

import "flag-icons/css/flag-icons.min.css";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";

// ✅ Combobox imports (Shadcn)
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** ✅ Country code searchable combobox (value: "+966 SA") */
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
            const v = `+${calling} ${iso2}`; // ✅ matches your SelectItem value before

            return {
                iso2,
                calling,
                value: v,
                searchValue: `${iso2} ${calling} +${calling} ${v}`,
            };
        });
    }, [countries]);

    // best-effort selected item from stored value
    const selected = useMemo(() => {
        if (!value) return null;
        // expected: "+966 SA"
        const parts = value.trim().split(/\s+/);
        const maybeIso2 = parts?.[1];
        if (maybeIso2) {
            const found = items.find((x) => x.iso2.toUpperCase() === maybeIso2.toUpperCase());
            if (found) return found;
        }
        // fallback by calling code
        const digits = value.replace("+", "").split(" ")[0];
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
                                <span className="opacity-70">{c.iso2}</span>

                                <Check className={cn("ml-auto h-4 w-4", value === c.value ? "opacity-100" : "opacity-0")} />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default function RegisterSecStep({ step, formData, setFormData, lang, setStep }) {
    const registerSchema = z.object({
        phone: z
            .string()
            .min(1, { message: t(lang, "phone_required") })
            .regex(/^[0-9]+$/, { message: t(lang, "phone_numbers_only") })
            .min(9, { message: t(lang, "phone_min_length") }),

        country: z.string().min(1, { message: t(lang, "country_required") }),
        email: z.string().email({ message: t(lang, "email_required") }),
        licenseNumber: z.string().min(3, { message: t(lang, "license_number_required") }),
    });

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            phone: formData?.phone || "",
            country: formData?.country || "+966 SA",
            email: formData?.email || "",
            licenseNumber: formData?.licenseNumber || "",
        },
        mode: "onChange",
    });

    const onSubmit = (data) => {
        setStep(3);
        setFormData({ ...formData, ...data });
    };

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
                                    {/* License Number */}
                                    <FormField
                                        control={form.control}
                                        name="licenseNumber"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-password">
                                                <FormLabel className="password-label">{t(lang, "license_number")}</FormLabel>
                                                <FormControl>
                                                    <div
                                                        className={`password-input-wrapper ${form.formState.errors.licenseNumber ? "error-password" : form.formState.isDirty && field.value ? "success-password" : ""
                                                            }`}
                                                    >
                                                        <Input {...field} type="text" placeholder={t(lang, "license_number")} className="password-input name-input" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="password-error" />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Email */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-password">
                                                <FormLabel className="password-label">{t(lang, "email_label")}</FormLabel>
                                                <FormControl>
                                                    <div
                                                        className={`password-input-wrapper ${form.formState.errors.email ? "error-password" : form.formState.isDirty && field.value ? "success-password" : ""
                                                            }`}
                                                    >
                                                        <Input {...field} type="email" placeholder={t(lang, "email_placeholder")} className="password-input name-input" />
                                                        <div className="field-icon">
                                                            <Image className="eye-icon" src={mailIcon} alt="mailIcon" />
                                                        </div>
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
    );
}
