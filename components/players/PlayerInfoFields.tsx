"use client";
import React from "react";
import Image from "next/image";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import profileIcon from "@/src/assets/images/license/profileIcon.svg";
import calenderIcon from "@/src/assets/images/license/calender.svg";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";

type Props = {
    lang: string;
    form: any;
    cities: any[];
    nationalities: { id: number; name: string; value: string }[];
};

function PlayerInfoFieldsBase({ lang, form, cities, nationalities }: Props) {
    const countries = getCountries();

    return (
        <>
            <div className="section-header">
                <div className="section-icon">
                    <Image src={profileIcon} alt="Profile Icon" />
                </div>
                <h3 className="section-title">{t(lang, "player_info")}</h3>
            </div>

            <div className="form-grid">
                {/* Full Name */}
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }: any) => (
                        <FormItem className="form-field">
                            <FormLabel className="field-label">
                                {t(lang, "full_name")} <span className="required">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder={t(lang, "full_name")}
                                    className={`field-input ${form.formState.errors.fullName ? "error-input" : field.value ? "success-input" : ""}`}
                                />
                            </FormControl>
                            <FormMessage className="field-error" />
                        </FormItem>
                    )}
                />

                {/* Birth Date */}
                <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }: any) => (
                        <FormItem className="form-field">
                            <FormLabel className="field-label">
                                {t(lang, "birth_date")} <span className="required">*</span>
                            </FormLabel>

                            <div className="relative">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "field-input w-full justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground",
                                                    form.formState.errors.birthDate ? "error-input" : field.value ? "success-input" : ""
                                                )}
                                            >
                                                <CalendarIcon className="date-icon-picker" size={20} />
                                                {field.value ? (
                                                    format(new Date(field.value), "PPP", { locale: lang === "ar" ? ar : enUS })
                                                ) : (
                                                    <span>{t(lang, "birth_date_placeholder")}</span>
                                                )}
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value ? new Date(field.value) : undefined}
                                            onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                            initialFocus
                                            locale={lang === "ar" ? ar : enUS}
                                            captionLayout="dropdown"
                                            fromYear={1900}
                                            toYear={new Date().getFullYear()}
                                            dir={lang === "ar" ? "rtl" : "ltr"}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Image src={calenderIcon} alt="Calender Icon" className="date-icon" />
                            </div>

                            <FormMessage className="field-error" />
                        </FormItem>
                    )}
                />

                {/* Nationality */}
                <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }: any) => (
                        <FormItem className="form-field">
                            <FormLabel className="field-label">
                                {t(lang, "nationality")} <span className="required">*</span>
                            </FormLabel>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger
                                        className={`field-input select-trigger disabled:opacity-1 ${lang === "ar" ? "ar-select-trigger" : "en-select-trigger"
                                            } ${form.formState.errors.nationality ? "error-input" : field.value ? "success-input" : ""}`}
                                    >
                                        <SelectValue placeholder={t(lang, "nationality_placeholder")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {nationalities.map((item) => (
                                            <SelectItem key={item.id} value={item.value}>
                                                {t(lang, item.name)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage className="field-error" />
                        </FormItem>
                    )}
                />

                {/* National ID */}
                <FormField
                    control={form.control}
                    name="nationalId"
                    render={({ field }: any) => (
                        <FormItem className="form-field">
                            <FormLabel className="field-label">
                                {t(lang, "national_id_number")} <span className="required">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder={t(lang, "national_id_placeholder")}
                                    className={`field-input ${form.formState.errors.nationalId ? "error-input" : field.value ? "success-input" : ""}`}
                                />
                            </FormControl>
                            <FormMessage className="field-error" />
                        </FormItem>
                    )}
                />

                {/* Phone */}
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }: any) => (
                        <FormItem className="from-input-wrapper-mobile">
                            <FormLabel className="field-label">
                                {t(lang, "Phone_Number")} <span className="required">*</span>
                            </FormLabel>
                            <FormControl>
                                <div
                                    className={`input-of-mobile-num ${form.formState.errors.phone || form.formState.errors.country
                                            ? "error-mob-input"
                                            : form.formState.isDirty && field.value && !form.formState.errors.phone && !form.formState.errors.country
                                                ? "success-mob-input"
                                                : ""
                                        }`}
                                >
                                    <div className="country-select">
                                        <FormField
                                            control={form.control}
                                            name="country"
                                            render={({ field: cField }: any) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select value={cField.value} onValueChange={cField.onChange}>
                                                            <SelectTrigger className="country-select-trigger">
                                                                <SelectValue placeholder={t(lang, "Country")} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    {countries?.map((iso2, index) => (
                                                                        <SelectItem value={`+${getCountryCallingCode(iso2)} ${iso2}`} key={index}>
                                                                            <div className="code-country-slug-cont">
                                                                                <div className="select-country-item-cont">
                                                                                    <span>
                                                                                        <span className={`fi fi-${iso2.toLowerCase()}`} /> +{getCountryCallingCode(iso2)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectGroup>
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
                                        style={{ direction: lang === "ar" ? "rtl" : "ltr" }}
                                        placeholder={t(lang, "Phone_Number")}
                                        {...field}
                                    />
                                </div>
                            </FormControl>

                            <div className="flex items-center justify-between">
                                <FormMessage id="phone-error" />
                                {form.formState.errors.country && <p className="country-error">{form.formState.errors.country?.message}</p>}
                            </div>
                        </FormItem>
                    )}
                />

                {/* City */}
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }: any) => (
                        <FormItem className="form-field">
                            <FormLabel className="field-label">
                                {t(lang, "city")} <span className="required">*</span>
                            </FormLabel>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger
                                        className={`field-input select-trigger disabled:opacity-1 ${lang === "ar" ? "ar-select-trigger" : "en-select-trigger"
                                            } ${form.formState.errors.city ? "error-input" : field.value ? "success-input" : ""}`}
                                    >
                                        <SelectValue placeholder={t(lang, "city_placeholder")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities?.map((city: any) => (
                                            <SelectItem key={city.id} value={city.id}>
                                                {city.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage className="field-error" />
                        </FormItem>
                    )}
                />

                {/* Address */}
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }: any) => (
                        <FormItem className="form-field">
                            <FormLabel className="field-label">
                                {t(lang, "detailed_address")} <span className="required">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder={t(lang, "address_placeholder")}
                                    className={`field-input ${form.formState.errors.address ? "error-input" : field.value ? "success-input" : ""}`}
                                />
                            </FormControl>
                            <FormMessage className="field-error" />
                        </FormItem>
                    )}
                />

                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }: any) => (
                        <FormItem className="form-field">
                            <FormLabel className="field-label">
                                {t(lang, "email")} <span className="required">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder={t(lang, "email_placeholder")}
                                    className={`field-input ${form.formState.errors.email ? "error-input" : field.value ? "success-input" : ""}`}
                                />
                            </FormControl>
                            <FormMessage className="field-error" />
                        </FormItem>
                    )}
                />
            </div>
        </>
    );
}

export const PlayerInfoFields = React.memo(PlayerInfoFieldsBase);
