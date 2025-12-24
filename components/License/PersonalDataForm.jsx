"use client"
import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectGroup, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { t } from "@/lib/i18n"
import profileIcon from "@/src/assets/images/license/profileIcon.svg"
import Image from "next/image"
import { cn } from "@/lib/utils"
import locationIcon from "@/src/assets/images/license/locationIcon.svg"
import usersIcon from "@/src/assets/images/license/usersIcon.svg"
import phoneIcon from "@/src/assets/images/license/phoneIcon.svg"
import calenderIcon from "@/src/assets/images/license/calender.svg"
import flag from '@/src/assets/images/flag.svg'

// Zod validation schema with translations
const makeFormSchema = (lang) =>
    z.object({
        fullName: z
            .string()
            .min(1, { message: t(lang, "full_name_required") })
            .min(3, { message: t(lang, "full_name_min_length") }),
        nationalId: z
            .string()
            .min(1, { message: t(lang, "national_id_required") })
            .regex(/^[0-9]+$/, { message: t(lang, "national_id_numbers_only") })
            .length(10, { message: t(lang, "national_id_length") }),
        birthDate: z
            .string()
            .min(1, { message: t(lang, "birth_date_required") }),
        nationality: z
            .string()
            .min(1, { message: t(lang, "nationality_required") }),
        phone: z
            .string()
            .min(1, { message: t(lang, "phone_required") })
            .regex(/^[0-9]+$/, { message: t(lang, "phone_numbers_only") })
            .min(9, { message: t(lang, "phone_min_length") }),
        country: z
            .string()
            .min(1, { message: t(lang, "country_required") }),
        email: z
            .string()
            .min(1, { message: t(lang, "email_required") })
            .email({ message: t(lang, "email_invalid") }),
        clubAffiliated: z
            .string()
            .min(1, { message: t(lang, "club_affiliated_required") }),
        licenseType: z
            .string()
            .min(1, { message: t(lang, "license_type_required") }),
        detailedAddress: z
            .string()
            .min(1, { message: t(lang, "detailed_address_required") }),
    });

export default function PersonalDataForm({ lang, formData, setFormData, setStep, progress, setProgress, setMaxProgress }) {
    const [loading, setLoading] = useState(false);
    const formSchema = useMemo(() => makeFormSchema(lang), [lang]);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: formData?.fullName || "",
            nationalId: formData?.nationalId || "",
            birthDate: formData?.birthDate || "",
            nationality: formData?.nationality || "",
            phone: formData?.phone || "",
            country: formData?.country || "",
            email: formData?.email || "",
            clubAffiliated: formData?.clubAffiliated || "",
            licenseType: formData?.licenseType || "",
            detailedAddress: formData?.detailedAddress || "",
        },
    });

    useEffect(() => {
        const subscription = form.watch((value) => {
            let filledInputs = 0;
            const totalInputs = 10;

            if (value.fullName && value.fullName.trim() !== "") filledInputs++;
            if (value.nationalId && value.nationalId.trim() !== "") filledInputs++;
            if (value.birthDate && value.birthDate.trim() !== "") filledInputs++;
            if (value.nationality && value.nationality.trim() !== "") filledInputs++;
            if (value.phone && value.phone.trim() !== "") filledInputs++;
            if (value.country && value.country.trim() !== "") filledInputs++;
            if (value.email && value.email.trim() !== "") filledInputs++;
            if (value.clubAffiliated && value.clubAffiliated.trim() !== "") filledInputs++;
            if (value.licenseType && value.licenseType.trim() !== "") filledInputs++;
            if (value.detailedAddress && value.detailedAddress.trim() !== "") filledInputs++;

            setProgress(filledInputs);
            setMaxProgress(totalInputs);
        });

        return () => subscription.unsubscribe();
    }, [form, setProgress, setMaxProgress]);

    const onSubmit = (data) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setFormData({ ...formData, ...data });
            setProgress(0); // Reset progress for next step
            setStep(2); // Move to next step
        }, 1000);
    };
    const nationalities = [
        { id: 1, name: t(lang, "saudi"), value: "saudi", key: "+966", flag: flag },
        { id: 2, name: t(lang, "egyptian"), value: "egyptian", key: "+20", flag: flag },
        { id: 3, name: t(lang, "emirati"), value: "emirati", key: "+971", flag: flag },
        { id: 4, name: t(lang, "kuwaiti"), value: "kuwaiti", key: "+965", flag: flag },
    ];
    const clubs = [
        { id: 1, name: t(lang, "saudi") + " " + t(lang, "club_selection"), value: "saudi_club" },
        { id: 2, name: t(lang, "egyptian") + " " + t(lang, "club_selection"), value: "egyptian_club" },
        { id: 3, name: t(lang, "emirati") + " " + t(lang, "club_selection"), value: "emirati_club" },
    ];

    const licenseTypes = [
        { id: 1, name: t(lang, "license_type_individual"), value: "individual" },
        { id: 2, name: t(lang, "license_type_club"), value: "club" },
        { id: 3, name: t(lang, "license_type_organization"), value: "organization" },
    ];

    return (
        <div className="personal-data-form">
            <div className="container">
                <div className="personal-data-form-content">
                    <div className="form-header">
                        <h2 className="form-title">{t(lang, "license_request_data")}</h2>
                        <p className="form-subtitle">{t(lang, "license_request_subtitle")}</p>
                    </div>

                    <Form {...form}>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="license-form">
                            <div className="section-header">
                                <div className="section-icon">
                                    <Image src={profileIcon} alt="Profile Icon" />
                                </div>
                                <h3 className="section-title">{t(lang, "personal_data")}</h3>
                            </div>
                            <div className="form-grid">
                                {/* Full Name Field */}
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem className="form-field">
                                            <FormLabel className="field-label">
                                                {t(lang, "full_name")} <span className="required">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} type="text" placeholder={t(lang, "full_name")}
                                                    className={`field-input ${form.formState.errors.fullName ? 'error-input' : field.value ? 'success-input' : ''}`}

                                                />
                                            </FormControl>
                                            <FormMessage className="field-error" />
                                        </FormItem>
                                    )}
                                />

                                {/* National ID Field */}
                                <FormField
                                    control={form.control}
                                    name="nationalId"
                                    render={({ field }) => (
                                        <FormItem className="form-field">
                                            <FormLabel className="field-label">
                                                {t(lang, "national_id_number")} <span className="required">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder={t(lang, "national_id_placeholder")}
                                                    className={`field-input ${form.formState.errors.nationalId ? 'error-input' : field.value ? 'success-input' : ''}`}
                                                />
                                            </FormControl>
                                            <FormMessage className="field-error" />
                                        </FormItem>
                                    )}
                                />

                                {/* Birth Date Field */}
                                <FormField
                                    control={form.control}
                                    name="birthDate"
                                    className="date-input-wrapper"
                                    render={({ field }) => (
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
                                                                    form.formState.errors.birthDate ? 'error-input' : field.value ? 'success-input' : ''
                                                                )}
                                                            >
                                                                <CalendarIcon className="date-icon-picker" size={20} />
                                                                {field.value ? (
                                                                    format(new Date(field.value), "PPP", {
                                                                        locale: lang === "ar" ? ar : enUS
                                                                    })
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
                                                            onSelect={(date) => { field.onChange(date ? format(date, "yyyy-MM-dd") : "") }}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
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

                                {/* Nationality Field */}
                                <FormField
                                    control={form.control}
                                    name="nationality"
                                    render={({ field }) => (
                                        <FormItem className="form-field">
                                            <FormLabel className="field-label">
                                                {t(lang, "nationality")} <span className="required">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger className={`field-input select-trigger disabled:opacity-1 ${lang == "ar" ? "ar-select-trigger" : "en-select-trigger"} ${form.formState.errors.nationality ? 'error-input' : field.value ? 'success-input' : ''}`}>
                                                        <SelectValue placeholder={t(lang, "nationality_placeholder")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {nationalities.map((item) => (
                                                            <SelectItem key={item.id} value={item.value}>
                                                                {item.name}
                                                            </SelectItem>
                                                        ))}

                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage className="field-error" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="section-header">
                                <div className="section-icon">
                                    <Image src={phoneIcon} alt="Profile Icon" />
                                </div>
                                <h3 className="section-title">{t(lang, "contact_data")}</h3>
                            </div>
                            <div className="form-grid">
                                {/* Phone Number Field */}
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem className="from-input-wrapper-mobile">
                                            <FormLabel className="field-label">
                                                {t(lang, "Phone_Number")} <span className="required">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className={`input-of-mobile-num ${form.formState.errors.phone || form.formState.errors.country
                                                    ? 'error-mob-input'
                                                    : form.formState.isDirty && (field.value && !form.formState.errors.phone && !form.formState.errors.country)
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
                                                                                field.onChange(value);
                                                                            }}
                                                                        >
                                                                            <SelectTrigger className="country-select-trigger">
                                                                                <SelectValue placeholder={t(lang, "Country")} />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectGroup>
                                                                                    {nationalities?.map((item, index) => (
                                                                                        <SelectItem value={item.key} key={index}>
                                                                                            <div className="code-country-slug-cont">
                                                                                                <div className="select-country-item-cont">
                                                                                                    <Image
                                                                                                        src={item.flag}
                                                                                                        alt={item.name}
                                                                                                        width={20}
                                                                                                        height={20}
                                                                                                        className="country-flag"
                                                                                                    />
                                                                                                </div>
                                                                                                <p>({item.key})</p>
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
                                                        style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                                                        placeholder={t(lang, "Phone_Number")}
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
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="form-field">
                                            <FormLabel className="field-label">
                                                {t(lang, "email")} <span className="required">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder={t(lang, "email_placeholder")}
                                                    className={`field-input ${form.formState.errors.email ? 'error-input' : field.value ? 'success-input' : ''}`}
                                                />
                                            </FormControl>
                                            <FormMessage className="field-error" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* Club Selection Section */}
                            <div className="section-header">
                                <div className="section-icon">
                                    <Image src={usersIcon} alt="Users Icon" />
                                </div>
                                <h3 className="section-title">{t(lang, "club_selection")}</h3>
                            </div>
                            <div className="form-grid">
                                {/* Club Affiliated Field */}
                                <FormField
                                    control={form.control}
                                    name="clubAffiliated"
                                    render={({ field }) => (
                                        <FormItem className="form-field">
                                            <FormLabel className="field-label">
                                                {t(lang, "club_affiliated")} <span className="required">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder={t(lang, "club_affiliated_placeholder")}
                                                    className={`field-input ${form.formState.errors.clubAffiliated ? 'error-input' : field.value ? 'success-input' : ''}`}
                                                />
                                            </FormControl>
                                            <FormMessage className="field-error" />
                                        </FormItem>
                                    )}
                                />

                                {/* License Type Field */}
                                <FormField
                                    control={form.control}
                                    name="licenseType"
                                    render={({ field }) => (
                                        <FormItem className="form-field">
                                            <FormLabel className="field-label">
                                                {t(lang, "license_type")} <span className="required">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger className={`field-input select-trigger disabled:opacity-1 ${lang == "ar" ? "ar-select-trigger" : "en-select-trigger"} ${form.formState.errors.licenseType ? 'error-input' : field.value ? 'success-input' : ''}`}>
                                                        <SelectValue placeholder={t(lang, "license_type_placeholder")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {licenseTypes.map((item) => (
                                                            <SelectItem key={item.id} value={item.value}>
                                                                {item.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage className="field-error" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Detailed Address Section */}
                            <div className="section-header">
                                <div className="section-icon">
                                    <Image src={locationIcon} alt="Location Icon" />
                                </div>
                                <h3 className="section-title">{t(lang, "detailed_address")}</h3>
                            </div>
                            <div className="form--single">
                                {/* Detailed Address Field */}
                                <FormField
                                    control={form.control}
                                    name="detailedAddress"
                                    render={({ field }) => (
                                        <FormItem className="form-field">
                                            <FormLabel className="field-label">
                                                {t(lang, "detailed_address")} <span className="required">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder={t(lang, "detailed_address_placeholder")}
                                                    className={`field-input ${form.formState.errors.detailedAddress ? 'error-input' : field.value ? 'success-input' : ''}`}
                                                />
                                            </FormControl>
                                            <FormMessage className="field-error" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="form-actions">
                                <Button
                                    type="submit"
                                    className="submit-license-btn"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="loader-btn"></span>
                                    ) : (
                                        <span>{t(lang, "next")}</span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}