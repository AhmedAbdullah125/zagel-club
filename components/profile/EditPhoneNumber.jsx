"use client"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import "flag-icons/css/flag-icons.min.css";
import { changePhone } from "../Requests/changePhone";
export default function EditPhoneNumber({ lang, nextStep, setNewPhone, setNewCountyCode }) {
    const [loading, setLoading] = useState(false);
    const phoneSchema = z.object({
        phone: z.string()
            .min(1, { message: t(lang, "phone_required") })
            .regex(/^[0-9]+$/, { message: t(lang, "phone_numbers_only") })
            .min(9, { message: t(lang, "phone_min_length") }),
        country: z.string().min(1, { message: t(lang, "country_required") }),
    });


    const form = useForm({
        resolver: zodResolver(phoneSchema),
        defaultValues: {
            phone: "",
            country: "+966 SA",
        },
    });

    const onSubmit = (data) => {
        const countryCode = data.country.split(" ")[0];
        const phone = data.phone;
        changePhone(countryCode, phone, setLoading, lang, nextStep, setNewPhone, setNewCountyCode)
    };
    const countries = getCountries();
    return (
        <div className="settings-form-container my-16">
            <div className="container">
                <h2 className="settings-section-title">{t(lang, "edit_phone_number")}</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="settings-form">
                        {/* Phone Number */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="from-input-wrapper-mobile">
                                    <FormLabel className="password-label">{t(lang, "new_phone_number")}</FormLabel>
                                    <FormControl>
                                        <div className={`input-of-mobile-num ${form.formState.errors.phone || form.formState.errors.country ? 'error-mob-input' : ''}`}>
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
                                                placeholder={t(lang, "new_phone_number_placeholder")}
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button type="submit" className="submit-license-btn" disabled={loading}>
                            {loading ? <span className="loader-btn"></span> : <span>{t(lang, "next")}</span>}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}