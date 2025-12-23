"use client"
import React, { useEffect, useState, useMemo } from "react";
import { t } from "@/lib/i18n";
import Image from "next/image";
import profileIcon from "@/src/assets/images/license/profileIcon.svg";
import nationalCardIcon from '@/src/assets/images/license/nationalCardIcon.svg'
import uploadFile from '@/src/assets/images/license/uploadFile.svg'
import healthy from "@/src/assets/images/license/healthy.svg"
import calenderIcon from '@/src/assets/images/license/calender.svg';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import pdfIcon from '@/src/assets/images/pdficon.svg'
import CongatsCard from "../global/CongatsCard";
import { useRouter } from "next/navigation";
import "flag-icons/css/flag-icons.min.css";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import { addNewPlayer } from "../Requests/AddNewPlayer";
import { useGetCities } from "../Requests/useGetCities";


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
                    return Array.from(files).every(file => file.size <= 10 * 1024 * 1024);
                }, t(lang, "pdf_size_max_10mb")),
        })
        .superRefine(({ nationality, nationalId }, ctx) => {
            // adjust these comparisons to match your actual stored values
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


export default function AddPlayerWrapper() {
    const [lang, setLang] = useState('ar');
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [nationalIdPreview, setNationalIdPreview] = useState(null);
    const [personalPhotoPreview, setPersonalPhotoPreview] = useState(null);
    const [fitnessCertificatePreview, setFitnessCertificatePreview] = useState(null);
    const [clubApprovalPreview, setClubApprovalPreview] = useState([]);
    const { data: cities, isLoading: citiesLoading } = useGetCities(lang)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang') || 'ar');
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
            nationalIdPhoto: null,
            personalPhoto: null,
            fitnessCertificate: null,
            clubApproval: null,
        },
    });
    const countries = getCountries();
    const nationalities = [
        { id: 1, name: "Saudi", value: "SAUDI" },
        { id: 2, name: "Not_Saudi", value: "NOT_SAUDI" },
    ];
    const handleFileChange = (e, fieldName, setPreview) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type === 'application/pdf') {
                setPreview('pdf');
            } else {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleMultipleFileChange = (e, setPreview) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const previews = [];
            Array.from(files).forEach((file, index) => {
                if (file.type === 'application/pdf') {
                    previews.push({ type: 'pdf', name: file.name, index });
                } else {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        previews.push({ type: 'image', src: reader.result, name: file.name, index });
                        if (previews.length === files.length) {
                            setPreview([...previews]);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
            // If all files are PDFs, set preview immediately
            if (previews.length === files.length) {
                setPreview([...previews]);
            }
        }
    };

    const onSubmit = (data) => {
        console.log("Form data:", data);
        addNewPlayer(data, setLoading, lang, form, setShowSuccess)
    };



    return (
        <div className="player-wrapper license-content" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
            <ContactHero lang={lang} subtitle={t(lang, "add_player")} />
            <div className="personal-data-form">
                <div className="container">
                    <div className="personal-data-form-content">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="license-form">
                                <div className="section-header">
                                    <div className="section-icon">
                                        <Image src={profileIcon} alt="Profile Icon" />
                                    </div>
                                    <h3 className="section-title">{t(lang, "player_info")}</h3>
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



                                    {/* Birth Date Field */}
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
                                    {/* City Field */}
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
                                                        <SelectTrigger className={`field-input select-trigger disabled:opacity-1 ${lang == "ar" ? "ar-select-trigger" : "en-select-trigger"} ${form.formState.errors.city ? 'error-input' : field.value ? 'success-input' : ''}`}>
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

                                    {/* Address Field */}
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
                                                        className={`field-input ${form.formState.errors.address ? 'error-input' : field.value ? 'success-input' : ''}`}
                                                    />
                                                </FormControl>
                                                <FormMessage className="field-error" />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Email Field */}
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
                                                        className={`field-input ${form.formState.errors.email ? 'error-input' : field.value ? 'success-input' : ''}`}
                                                    />
                                                </FormControl>
                                                <FormMessage className="field-error" />
                                            </FormItem>
                                        )}
                                    />


                                </div>

                                {/* National ID Photo Section */}
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
                                        render={({ field: { onChange, value, ...field } }) => (
                                            <FormItem className="form-field">
                                                <FormControl>
                                                    <div className={`file-upload-wrapper ${form.formState.errors.nationalIdPhoto ? 'error-input' : value && value.length > 0 ? 'success-input' : ''}`}>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            id="nationalIdPhoto"
                                                            className="file-input-hidden"
                                                            onChange={(e) => {
                                                                onChange(e.target.files);
                                                                handleFileChange(e, 'nationalIdPhoto', setNationalIdPreview);
                                                            }}
                                                            {...field}
                                                        />
                                                        <label htmlFor="nationalIdPhoto" className="file-upload-label">
                                                            <div className="upload-content">
                                                                <Image src={uploadFile} alt="Upload" className="upload-icon" />
                                                                <p className="upload-text">
                                                                    {t(lang, "national_id_desc")}
                                                                </p>
                                                                <p className="upload-or">{t(lang, "or")}</p>
                                                                <button type="button" className="browse-btn">
                                                                    {t(lang, "browse_files")}
                                                                </button>
                                                            </div>
                                                            {nationalIdPreview && (
                                                                <div className="file-preview">
                                                                    <img src={nationalIdPreview} alt="Preview" className="preview-image" />
                                                                </div>
                                                            )}
                                                        </label>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="field-error" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Personal Photo Section */}
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
                                        render={({ field: { onChange, value, ...field } }) => (
                                            <FormItem className="form-field">
                                                <FormControl>
                                                    <div className={`file-upload-wrapper ${form.formState.errors.personalPhoto ? 'error-input' : value && value.length > 0 ? 'success-input' : ''}`}>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            id="personalPhoto"
                                                            className="file-input-hidden"
                                                            onChange={(e) => {
                                                                onChange(e.target.files);
                                                                handleFileChange(e, 'personalPhoto', setPersonalPhotoPreview);
                                                            }}
                                                            {...field}
                                                        />
                                                        <label htmlFor="personalPhoto" className="file-upload-label">
                                                            <div className="upload-content">
                                                                <Image src={uploadFile} alt="Upload" className="upload-icon" />
                                                                <p className="upload-text">
                                                                    {t(lang, "personal_photo_desc")}
                                                                </p>
                                                                <p className="upload-or">{t(lang, "or")}</p>
                                                                <button type="button" className="browse-btn">
                                                                    {t(lang, "browse_files")}
                                                                </button>
                                                            </div>
                                                            {personalPhotoPreview && (
                                                                <div className="file-preview">
                                                                    <img src={personalPhotoPreview} alt="Preview" className="preview-image" />
                                                                </div>
                                                            )}
                                                        </label>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="field-error" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Fitness Certificate Section - Optional */}
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
                                        render={({ field: { onChange, value, ...field } }) => (
                                            <FormItem className="form-field">
                                                <FormControl>
                                                    <div className={`file-upload-wrapper ${form.formState.errors.fitnessCertificate ? 'error-input' : value && value.length > 0 ? 'success-input' : ''}`}>
                                                        <input
                                                            type="file"
                                                            accept=".pdf"
                                                            id="fitnessCertificate"
                                                            className="file-input-hidden"
                                                            onChange={(e) => {
                                                                onChange(e.target.files);
                                                                handleFileChange(e, 'fitnessCertificate', setFitnessCertificatePreview);
                                                            }}
                                                            {...field}
                                                        />
                                                        <label htmlFor="fitnessCertificate" className="file-upload-label">
                                                            <div className="upload-content">
                                                                <Image src={uploadFile} alt="Upload" className="upload-icon" />
                                                                <p className="upload-text">
                                                                    {t(lang, "fitness_certificate_desc")}
                                                                </p>
                                                                <p className="upload-or">{t(lang, "or")}</p>
                                                                <button type="button" className="browse-btn">
                                                                    {t(lang, "browse_files")}
                                                                </button>
                                                            </div>
                                                            {fitnessCertificatePreview && (
                                                                <div className="file-preview">
                                                                    {fitnessCertificatePreview === 'pdf' ? (
                                                                        <div className="pdf-indicator">
                                                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                <path d="M14 2V8H20" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                            </svg>
                                                                            <p className="pdf-text">PDF {t(lang, "file_selected")}</p>
                                                                        </div>
                                                                    ) : (
                                                                        <img src={fitnessCertificatePreview} alt="Preview" className="preview-image" />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </label>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="field-error" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Club Approval Section - Required */}
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
                                        render={({ field: { onChange, value, ...field } }) => (
                                            <FormItem className="form-field">
                                                <FormControl>
                                                    <div className={`file-upload-wrapper ${form.formState.errors.clubApproval ? 'error-input' : value && value.length > 0 ? 'success-input' : ''}`}>
                                                        <input
                                                            type="file"
                                                            accept=".pdf,"
                                                            id="clubApproval"
                                                            className="file-input-hidden"
                                                            multiple
                                                            onChange={(e) => {
                                                                onChange(e.target.files);
                                                                handleMultipleFileChange(e, setClubApprovalPreview);
                                                            }}
                                                            {...field}
                                                        />
                                                        <label htmlFor="clubApproval" className="file-upload-label">
                                                            <div className="upload-content">
                                                                <Image src={uploadFile} alt="Upload" className="upload-icon" />
                                                                <p className="upload-text">
                                                                    {t(lang, "club_approval_desc")}
                                                                </p>
                                                                <p className="upload-or">{t(lang, "or")}</p>
                                                                <button type="button" className="browse-btn">
                                                                    {t(lang, "browse_files")}
                                                                </button>
                                                            </div>
                                                            {clubApprovalPreview && clubApprovalPreview.length > 0 && (
                                                                <div className="file-preview" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                                                                    {clubApprovalPreview.map((preview, idx) => (
                                                                        <div key={idx} style={{ flex: '0 0 auto' }}>
                                                                            {preview.type === 'pdf' ? (
                                                                                <div className="pdf-indicator">
                                                                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                        <path d="M14 2V8H20" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                    </svg>
                                                                                    <p className="pdf-text" style={{ fontSize: '12px', marginTop: '5px' }}>{preview.name}</p>
                                                                                </div>
                                                                            ) : (
                                                                                <div>
                                                                                    <img src={preview.src} alt="Preview" className="preview-image" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                                                                    <p style={{ fontSize: '12px', marginTop: '5px' }}>{preview.name}</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </label>
                                                    </div>
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
                                            <span>{t(lang, "add_player")}</span>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>

            {/* Success Card */}
            {showSuccess && (
                <CongatsCard
                    title="تهانينا"
                    description="تم اضافه اللاعب بنجاح"
                />
            )}
        </div>
    )
}