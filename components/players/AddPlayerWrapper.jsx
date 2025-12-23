"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { t } from "@/lib/i18n";
import Image from "next/image";
import profileIcon from "@/src/assets/images/license/profileIcon.svg";
import nationalCardIcon from "@/src/assets/images/license/nationalCardIcon.svg";
import uploadFile from "@/src/assets/images/license/uploadFile.svg";
import healthy from "@/src/assets/images/license/healthy.svg";
import calenderIcon from "@/src/assets/images/license/calender.svg";
import pdfIcon from "@/src/assets/images/pdficon.svg";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ContactHero from "../Contact/ContactHero";
import CongatsCard from "../global/CongatsCard";
import "flag-icons/css/flag-icons.min.css";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import { addNewPlayer } from "../Requests/AddNewPlayer";
import { useGetCities } from "../Requests/useGetCities";
import { useDropzone } from "react-dropzone";


const makePlayerSchema = (lang) =>
    z
        .object({
            fullName: z
                .string()
                .min(1, { message: t(lang, "name_required") })
                .transform((v) => v.trim().replace(/\s+/g, " "))
                .refine((v) => {
                    const parts = v.split(" ");
                    return parts.length === 3 && parts.every((p) => p.length >= 2);
                }, { message: t(lang, "name_must_be_three_words") }),

            nationalId: z
                .string()
                .min(1, { message: t(lang, "national_id_required") })
                .regex(/^[0-9]+$/, { message: t(lang, "national_id_numbers_only") })
                .length(10, { message: t(lang, "national_id_must_be_10_digits") }),

            nationality: z.string().min(1, { message: t(lang, "nationality_required") }),
            birthDate: z.string().min(1, { message: t(lang, "birth_date_required") }),

            phone: z
                .string()
                .min(1, { message: t(lang, "phone_required") })
                .regex(/^[0-9]+$/, { message: t(lang, "phone_numbers_only") })
                .min(9, { message: t(lang, "phone_min_length") }),

            country: z.string().min(1, { message: t(lang, "country_required") }),
            city: z.string().min(1, { message: t(lang, "city_required") }),

            email: z
                .string()
                .min(1, { message: t(lang, "email_required") })
                .email({ message: t(lang, "email_invalid") }),

            address: z
                .string()
                .min(1, { message: t(lang, "address_required") })
                .min(5, { message: t(lang, "address_min_length") }),

            nationalIdPhoto: z
                .any()
                .refine((files) => files?.length > 0, t(lang, "national_id_photo_required"))
                .refine((files) => {
                    if (!files || files.length === 0) return true;
                    return files[0].size <= 2 * 1024 * 1024;
                }, t(lang, "image_size_max_2mb")),

            personalPhoto: z
                .any()
                .refine((files) => files?.length > 0, t(lang, "personal_photo_required"))
                .refine((files) => {
                    if (!files || files.length === 0) return true;
                    return files[0].size <= 2 * 1024 * 1024;
                }, t(lang, "image_size_max_2mb")),

            fitnessCertificate: z
                .any()
                .optional()
                .refine((files) => {
                    if (!files || files.length === 0) return true;
                    return files[0].size <= 10 * 1024 * 1024;
                }, t(lang, "pdf_size_max_10mb")),

            clubApproval: z
                .any()
                .optional()
                .refine((files) => {
                    if (!files || files.length === 0) return true;
                    return Array.from(files).every((file) => file.size <= 10 * 1024 * 1024);
                }, t(lang, "pdf_size_max_10mb")),
        })
        .superRefine(({ nationality, nationalId }, ctx) => {
            const isSaudi = nationality === "SAUDI";
            if (isSaudi && !nationalId.startsWith("1")) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["nationalId"],
                    message: t(lang, "national_id_saudi_must_start_1"),
                });
            }
            if (!isSaudi && !nationalId.startsWith("2")) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["nationalId"],
                    message: t(lang, "national_id_non_saudi_must_start_2"),
                });
            }
        });


function DropUpload({
    lang,
    id,
    name,
    accept,
    multiple = false,
    value,
    hasError,
    descKey,
    onFiles,
    children,
}) {
    const hasFile = value && value.length > 0;

    const onDrop = useCallback(
        (acceptedFiles) => {
            onFiles(acceptedFiles);
        },
        [onFiles]
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        accept,
        multiple,
        noClick: true, // we control click manually (button/label)
        onDrop,
    });

    return (
        <div
            {...getRootProps()}
            className={`file-upload-wrapper 
        ${hasError ? "error-input" : hasFile ? "success-input" : ""} 
        ${isDragActive ? "drag-active" : ""}`}
        >
            <input
                {...getInputProps({
                    id,
                    name,
                })}
            />

            {/* NOTE: label is fine but button is more reliable. We'll keep the same UI. */}
            <div className="file-upload-label">
                <div className="upload-content">
                    <Image src={uploadFile} alt="Upload" className="upload-icon" />
                    <p className="upload-text">
                        {isDragActive ? t(lang, "drop_here") : t(lang, descKey)}
                    </p>
                    <p className="upload-or">{t(lang, "or")}</p>

                    {/* browse - opens file picker */}
                    <button type="button" className="browse-btn" onClick={open}>
                        {t(lang, "browse_files")}
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}

/* =========================
   Main Component
========================= */
export default function AddPlayerWrapper() {
    const [lang, setLang] = useState("ar");
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [nationalIdPreview, setNationalIdPreview] = useState(null);
    const [personalPhotoPreview, setPersonalPhotoPreview] = useState(null);
    const [fitnessCertificatePreview, setFitnessCertificatePreview] = useState(null);
    const [clubApprovalPreview, setClubApprovalPreview] = useState([]);

    const { data: cities } = useGetCities(lang);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLang(localStorage.getItem("lang") || "ar");
        }
    }, []);

    const playerSchema = useMemo(() => makePlayerSchema(lang), [lang]);

    const form = useForm({
        resolver: zodResolver(playerSchema),
        defaultValues: {
            fullName: "",
            nationalId: "",
            birthDate: "",
            nationality: "",
            phone: "",
            country: "+966 SA",
            city: "",
            email: "",
            address: "",
            // IMPORTANT: use arrays for dropzone
            nationalIdPhoto: [],
            personalPhoto: [],
            fitnessCertificate: [],
            clubApproval: [],
        },
    });

    const countries = getCountries();
    const nationalities = [
        { id: 1, name: "Saudi", value: "SAUDI" },
        { id: 2, name: "Not_Saudi", value: "NOT_SAUDI" },
    ];

    const setSinglePreviewFromFiles = (files, setPreview) => {
        const file = files?.[0];
        if (!file) {
            setPreview(null);
            return;
        }
        if (file.type === "application/pdf") {
            setPreview("pdf");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const setMultiPreviewFromFiles = (files, setPreview) => {
        if (!files || files.length === 0) {
            setPreview([]);
            return;
        }

        const previews = [];
        let done = 0;

        files.forEach((file, index) => {
            if (file.type === "application/pdf") {
                previews.push({ type: "pdf", name: file.name, index });
                done++;
                if (done === files.length) setPreview([...previews]);
            } else {
                const reader = new FileReader();
                reader.onloadend = () => {
                    previews.push({ type: "image", src: reader.result, name: file.name, index });
                    done++;
                    if (done === files.length) setPreview([...previews]);
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const onSubmit = (data) => {
        addNewPlayer(data, setLoading, lang, form, setShowSuccess);
    };

    return (
        <div className="player-wrapper license-content" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
            <ContactHero lang={lang} subtitle={t(lang, "add_player")} />

            <div className="personal-data-form">
                <div className="container">
                    <div className="personal-data-form-content">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="license-form">
                                {/* Header */}
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
                                        render={({ field }) => (
                                            <FormItem className="form-field">
                                                <FormLabel className="field-label">
                                                    {t(lang, "full_name")} <span className="required">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        placeholder={t(lang, "full_name")}
                                                        className={`field-input ${form.formState.errors.fullName ? "error-input" : field.value ? "success-input" : ""
                                                            }`}
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
                                                                        form.formState.errors.birthDate ? "error-input" : field.value ? "success-input" : ""
                                                                    )}
                                                                >
                                                                    <CalendarIcon className="date-icon-picker" size={20} />
                                                                    {field.value ? (
                                                                        format(new Date(field.value), "PPP", {
                                                                            locale: lang === "ar" ? ar : enUS,
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
                                        render={({ field }) => (
                                            <FormItem className="form-field">
                                                <FormLabel className="field-label">
                                                    {t(lang, "nationality")} <span className="required">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <SelectTrigger
                                                            className={`field-input select-trigger disabled:opacity-1 ${lang == "ar" ? "ar-select-trigger" : "en-select-trigger"
                                                                } ${form.formState.errors.nationality ? "error-input" : field.value ? "success-input" : ""
                                                                }`}
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
                                                        className={`field-input ${form.formState.errors.nationalId ? "error-input" : field.value ? "success-input" : ""
                                                            }`}
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
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-mobile">
                                                <FormLabel className="field-label">
                                                    {t(lang, "Phone_Number")} <span className="required">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <div
                                                        className={`input-of-mobile-num ${form.formState.errors.phone || form.formState.errors.country
                                                            ? "error-mob-input"
                                                            : form.formState.isDirty &&
                                                                field.value &&
                                                                !form.formState.errors.phone &&
                                                                !form.formState.errors.country
                                                                ? "success-mob-input"
                                                                : ""
                                                            }`}
                                                    >
                                                        <div className="country-select">
                                                            <FormField
                                                                control={form.control}
                                                                name="country"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            <Select value={field.value} onValueChange={field.onChange}>
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
                                                    {form.formState.errors.country && (
                                                        <p className="country-error">{form.formState.errors.country?.message}</p>
                                                    )}
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    {/* City */}
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem className="form-field">
                                                <FormLabel className="field-label">
                                                    {t(lang, "city")} <span className="required">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <SelectTrigger
                                                            className={`field-input select-trigger disabled:opacity-1 ${lang == "ar" ? "ar-select-trigger" : "en-select-trigger"
                                                                } ${form.formState.errors.city ? "error-input" : field.value ? "success-input" : ""}`}
                                                        >
                                                            <SelectValue placeholder={t(lang, "city_placeholder")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {cities?.map((city) => (
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
                                        render={({ field }) => (
                                            <FormItem className="form-field">
                                                <FormLabel className="field-label">
                                                    {t(lang, "detailed_address")} <span className="required">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        placeholder={t(lang, "address_placeholder")}
                                                        className={`field-input ${form.formState.errors.address ? "error-input" : field.value ? "success-input" : ""
                                                            }`}
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
                                        render={({ field }) => (
                                            <FormItem className="form-field">
                                                <FormLabel className="field-label">
                                                    {t(lang, "email")} <span className="required">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        placeholder={t(lang, "email_placeholder")}
                                                        className={`field-input ${form.formState.errors.email ? "error-input" : field.value ? "success-input" : ""
                                                            }`}
                                                    />
                                                </FormControl>
                                                <FormMessage className="field-error" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* ========== Uploads ========== */}

                                {/* National ID Photo */}
                                <div className="section-header">
                                    <div className="section-icon">
                                        <Image src={nationalCardIcon} alt="National ID Icon" />
                                    </div>
                                    <h3 className="section-title">{t(lang, "national_id_photo")}</h3>
                                </div>
                                <div className="form-grid-single">
                                    <FormField
                                        control={form.control}
                                        name="nationalIdPhoto"
                                        render={({ field }) => (
                                            <FormItem className="form-field">
                                                <FormControl>
                                                    <DropUpload
                                                        lang={lang}
                                                        id="nationalIdPhoto"
                                                        name={field.name}
                                                        accept={{ "image/*": [] }}
                                                        multiple={false}
                                                        value={field.value}
                                                        hasError={!!form.formState.errors.nationalIdPhoto}
                                                        descKey="national_id_desc"
                                                        onFiles={(files) => {
                                                            field.onChange(files);
                                                            setSinglePreviewFromFiles(files, setNationalIdPreview);
                                                            form.trigger("nationalIdPhoto");
                                                        }}
                                                    >
                                                        {nationalIdPreview && (
                                                            <div className="file-preview">
                                                                <img src={nationalIdPreview} alt="Preview" className="preview-image" />
                                                            </div>
                                                        )}
                                                    </DropUpload>
                                                </FormControl>
                                                <FormMessage className="field-error" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Personal Photo */}
                                <div className="section-header">
                                    <div className="section-icon">
                                        <Image src={nationalCardIcon} alt="Profile Icon" />
                                    </div>
                                    <h3 className="section-title">{t(lang, "personal_photo")}</h3>
                                </div>
                                <div className="form-grid-single">
                                    <FormField
                                        control={form.control}
                                        name="personalPhoto"
                                        render={({ field }) => (
                                            <FormItem className="form-field">
                                                <FormControl>
                                                    <DropUpload
                                                        lang={lang}
                                                        id="personalPhoto"
                                                        name={field.name}
                                                        accept={{ "image/*": [] }}
                                                        multiple={false}
                                                        value={field.value}
                                                        hasError={!!form.formState.errors.personalPhoto}
                                                        descKey="personal_photo_desc"
                                                        onFiles={(files) => {
                                                            field.onChange(files);
                                                            setSinglePreviewFromFiles(files, setPersonalPhotoPreview);
                                                            form.trigger("personalPhoto");
                                                        }}
                                                    >
                                                        {personalPhotoPreview && (
                                                            <div className="file-preview">
                                                                <img src={personalPhotoPreview} alt="Preview" className="preview-image" />
                                                            </div>
                                                        )}
                                                    </DropUpload>
                                                </FormControl>
                                                <FormMessage className="field-error" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Fitness Certificate */}
                                <div className="section-header">
                                    <div className="section-icon">
                                        <Image src={healthy} alt="Document Icon" />
                                    </div>
                                    <h3 className="section-title">{t(lang, "fitness_certificate")}</h3>
                                </div>
                                <div className="form-grid-single">
                                    <FormField
                                        control={form.control}
                                        name="fitnessCertificate"
                                        render={({ field }) => (
                                            <FormItem className="form-field">
                                                <FormControl>
                                                    <DropUpload
                                                        lang={lang}
                                                        id="fitnessCertificate"
                                                        name={field.name}
                                                        accept={{ "application/pdf": [] }}
                                                        multiple={false}
                                                        value={field.value}
                                                        hasError={!!form.formState.errors.fitnessCertificate}
                                                        descKey="fitness_certificate_desc"
                                                        onFiles={(files) => {
                                                            field.onChange(files);
                                                            setSinglePreviewFromFiles(files, setFitnessCertificatePreview);
                                                            form.trigger("fitnessCertificate");
                                                        }}
                                                    >
                                                        {fitnessCertificatePreview && (
                                                            <div className="file-preview">
                                                                {fitnessCertificatePreview === "pdf" ? (
                                                                    <div className="pdf-indicator">
                                                                        <p className="pdf-text">PDF {t(lang, "file_selected")}</p>
                                                                    </div>
                                                                ) : (
                                                                    <img src={fitnessCertificatePreview} alt="Preview" className="preview-image" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </DropUpload>
                                                </FormControl>
                                                <FormMessage className="field-error" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Club Approval */}
                                <div className="section-header">
                                    <div className="section-icon">
                                        <Image src={pdfIcon} alt="Document Icon" />
                                    </div>
                                    <h3 className="section-title">{t(lang, "club_approval")}</h3>
                                </div>
                                <div className="form-grid-single">
                                    <FormField
                                        control={form.control}
                                        name="clubApproval"
                                        render={({ field }) => (
                                            <FormItem className="form-field">
                                                <FormControl>
                                                    <DropUpload
                                                        lang={lang}
                                                        id="clubApproval"
                                                        name={field.name}
                                                        accept={{ "application/pdf": [] }}
                                                        multiple={true}
                                                        value={field.value}
                                                        hasError={!!form.formState.errors.clubApproval}
                                                        descKey="club_approval_desc"
                                                        onFiles={(files) => {
                                                            field.onChange(files);
                                                            setMultiPreviewFromFiles(files, setClubApprovalPreview);
                                                            form.trigger("clubApproval");
                                                        }}
                                                    >
                                                        {clubApprovalPreview && clubApprovalPreview.length > 0 && (
                                                            <div
                                                                className="file-preview"
                                                                style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}
                                                            >
                                                                {clubApprovalPreview.map((preview, idx) => (
                                                                    <div key={idx} style={{ flex: "0 0 auto" }}>
                                                                        {preview.type === "pdf" ? (
                                                                            <div className="pdf-indicator">
                                                                                <p className="pdf-text" style={{ fontSize: 12, marginTop: 5 }}>
                                                                                    {preview.name}
                                                                                </p>
                                                                            </div>
                                                                        ) : (
                                                                            <div>
                                                                                <img
                                                                                    src={preview.src}
                                                                                    alt="Preview"
                                                                                    className="preview-image"
                                                                                    style={{ maxWidth: 100, maxHeight: 100 }}
                                                                                />
                                                                                <p style={{ fontSize: 12, marginTop: 5 }}>{preview.name}</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </DropUpload>
                                                </FormControl>
                                                <FormMessage className="field-error" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Submit */}
                                <div className="form-actions">
                                    <Button type="submit" className="submit-license-btn" disabled={loading}>
                                        {loading ? <span className="loader-btn"></span> : <span>{t(lang, "add_player")}</span>}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>

            {showSuccess && <CongatsCard title="تهانينا" description="تم اضافه اللاعب بنجاح" />}
        </div>
    );
}
