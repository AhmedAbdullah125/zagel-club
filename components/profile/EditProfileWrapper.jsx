"use client";
import React, { useEffect, useMemo, useState } from "react";
import { t } from "@/lib/i18n";
import ContactHero from "../Contact/ContactHero";
import Image from "next/image";
import usersIcon from "@/src/assets/images/editProfileIcom.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import clubLogo from "@/src/assets/images/birds/7.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import CongatsCard from "../global/CongatsCard";
import { useGetProfile } from "../Requests/useGetProfile";
import Loading from "@/src/app/loading";
import { useGetCities } from "../Requests/useGetCities";
import { editProfile } from "../Requests/editProfile";
import { useRouter } from "next/navigation";

export default function EditProfileWrapper() {
    const [lang, setLang] = useState("ar");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [logoError, setLogoError] = useState("");
    const [logoPreview, setLogoPreview] = useState(null);

    const router = useRouter();

    const { data: profile, isLoading } = useGetProfile(lang);
    const { data: cities, isLoading: citiesLoading } = useGetCities(lang);

    const citiesArray = useMemo(() => {
        if (!cities) return [];
        if (Array.isArray(cities)) return cities;
        if (Array.isArray(cities?.data)) return cities.data;
        return [];
    }, [cities]);

    const citiesWithRegions = useMemo(() => {
        return citiesArray.filter(
            (c) => Array.isArray(c.regions) && c.regions.length > 0
        );
    }, [citiesArray]);

    const [selectedCity, setSelectedCity] = useState("");

    const selectedCityRegions = useMemo(() => {
        if (!selectedCity) return [];
        const cityObj = citiesArray.find((c) => c.id === selectedCity);
        return cityObj?.regions ?? [];
    }, [selectedCity, citiesArray]);

    const profileFormSchema = useMemo(
        () =>
            z.object({
                clubName: z.string().min(3, { message: t(lang, "club_name_min_length") }),
                nationalAddress: z
                    .string()
                    .min(3, { message: t(lang, "national_address_min_length") }),
                city: z
                    .string({ required_error: t(lang, "city_required") })
                    .min(1, { message: t(lang, "city_required") }),
                administrativeRegion: z
                    .string({ required_error: t(lang, "administrative_region_required") })
                    .min(1, { message: t(lang, "administrative_region_required") }),
                licenseNumber: z
                    .string()
                    .regex(/^[0-9]+$/, { message: t(lang, "license_number_digits_only") })
                    .min(1, { message: t(lang, "license_number_required") }),
                officialEmail: z.string().email({ message: t(lang, "official_email_invalid") }),
                clubLogo: z.any().optional(),
            }),
        [lang]
    );

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLang(localStorage.getItem("lang") || "ar");
        }
    }, []);

    const form = useForm({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            clubName: "",
            nationalAddress: "",
            city: "",
            administrativeRegion: "",
            licenseNumber: "",
            officialEmail: "",
            clubLogo: undefined,
        },
    });

    useEffect(() => {
        if (!profile) return;

        const cityId = profile?.city?.id || "";
        const areaId = profile?.area?.id || "";

        form.setValue("clubName", profile?.name || "");
        form.setValue("nationalAddress", profile?.address || "");
        form.setValue("city", cityId);
        form.setValue("administrativeRegion", areaId);
        form.setValue("licenseNumber", profile?.licenseNumber || "");
        form.setValue("officialEmail", profile?.email || "");

        setSelectedCity(cityId);
        setLogoPreview(profile?.logo || null);
    }, [profile, form]);

    // ✅ If selected city changes, ensure current region is valid
    useEffect(() => {
        const currentRegion = form.getValues("administrativeRegion");
        if (!selectedCity) return;

        const valid = selectedCityRegions.some((r) => r.id === currentRegion);
        if (!valid) {
            form.setValue("administrativeRegion", "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCity, selectedCityRegions]);

    const validateImageFile = (file) => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

        if (!file) return { valid: false, error: t(lang, "image_select_prompt") };
        if (!allowedTypes.includes(file.type))
            return { valid: false, error: t(lang, "image_type_not_supported") };
        if (file.size > maxSize)
            return { valid: false, error: t(lang, "image_too_large_5mb") };

        return { valid: true, error: null };
    };

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        setLogoError("");
        if (!file) return;

        const validation = validateImageFile(file);
        if (!validation.valid) {
            setLogoError(validation.error);
            toast.error(validation.error);
            e.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result);
        reader.readAsDataURL(file);

        form.setValue("clubLogo", file);
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        const formData = new FormData();
        if (data.clubLogo) formData.append("logo", data.clubLogo);

        formData.append("name", data.clubName);
        formData.append("address", data.nationalAddress);
        formData.append("city", data.city);
        formData.append("area", data.administrativeRegion);
        formData.append("licenseNumber", data.licenseNumber);
        formData.append("email", data.officialEmail);

        editProfile(formData, setIsSubmitting, lang, router, setShowSuccess);
    };

    return (
        <div className="home-page-content" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
            <ContactHero lang={lang} subtitle={t(lang, "profile_update_success_title")} />

            {isLoading || !profile || citiesLoading || !selectedCity ? (
                <Loading />
            ) : (
                <div className="container">
                    <div className="profile-content-wrapper">
                        <div className="personal-club-content">
                            <div className="order-section">
                                <div className="order-section-header">
                                    <div className="img-cont">
                                        <Image src={usersIcon} alt="user-icon" />
                                    </div>
                                    <span>{t(lang, "profile_update_success_title")}</span>
                                </div>

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="form-grid">
                                        {/* Logo */}
                                        <div className="form-field full-width">
                                            <label className="field-label">{t(lang, "club_logo")}</label>
                                            <label
                                                htmlFor="club-logo-upload"
                                                className="club-logo-container-profile"
                                                style={{ cursor: "pointer" }}
                                            >
                                                <Image
                                                    src={logoPreview ? logoPreview : clubLogo}
                                                    alt="Club Logo"
                                                    width={120}
                                                    height={120}
                                                    className="club-logo-image-profile"
                                                />
                                                <input
                                                    id="club-logo-upload"
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                                    onChange={handleLogoChange}
                                                    style={{ display: "none" }}
                                                />
                                            </label>

                                            {logoError && (
                                                <p
                                                    className="text-sm text-red-500 mt-1"
                                                    style={{ direction: lang === "ar" ? "rtl" : "ltr" }}
                                                >
                                                    {logoError}
                                                </p>
                                            )}
                                        </div>

                                        {/* Club Name */}
                                        <FormField
                                            control={form.control}
                                            name="clubName"
                                            render={({ field }) => (
                                                <FormItem className="form-field">
                                                    <FormLabel className="field-label">{t(lang, "club_name")}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            className={`field-input ${form.formState.errors.clubName ? "error" : "success-mob-input"
                                                                }`}
                                                            style={{ direction: lang === "ar" ? "rtl" : "ltr" }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* National Address */}
                                        <FormField
                                            control={form.control}
                                            name="nationalAddress"
                                            render={({ field }) => (
                                                <FormItem className="form-field">
                                                    <FormLabel className="field-label">{t(lang, "national_address")}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            className={`field-input ${form.formState.errors.nationalAddress ? "error" : "success-mob-input"
                                                                }`}
                                                            style={{ direction: lang === "ar" ? "rtl" : "ltr" }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* City */}
                                        <FormField
                                            control={form.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem className="form-field">
                                                    <FormLabel className="field-label">{t(lang, "city")}</FormLabel>

                                                    <Select
                                                        value={field.value}
                                                        onValueChange={(value) => {
                                                            setSelectedCity(value);
                                                            field.onChange(value);
                                                            form.setValue("administrativeRegion", "");
                                                        }}
                                                        disabled={citiesWithRegions.length === 0 || citiesLoading}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger
                                                                className={`field-input select-trigger disabled:opacity-1 ${lang === "ar" ? "ar-select-trigger" : "en-select-trigger"
                                                                    } ${form.formState.errors.city ? "error" : "success-mob-input"}`}
                                                            >
                                                                <SelectValue placeholder={t(lang, "city_placeholder")} />
                                                            </SelectTrigger>
                                                        </FormControl>

                                                        <SelectContent>
                                                            {citiesWithRegions.map((city) => (
                                                                <SelectItem key={city.id} value={city.id}>
                                                                    {city.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Administrative Region (from selectedCityRegions) */}
                                        <FormField
                                            control={form.control}
                                            name="administrativeRegion"
                                            render={({ field }) => (
                                                <FormItem className="form-field">
                                                    <FormLabel className="field-label">
                                                        {t(lang, "administrative_region")}
                                                    </FormLabel>

                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        disabled={!selectedCity || selectedCityRegions.length === 0}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger
                                                                className={`field-input select-trigger disabled:opacity-1 ${lang === "ar" ? "ar-select-trigger" : "en-select-trigger"
                                                                    } ${form.formState.errors.administrativeRegion
                                                                        ? "error"
                                                                        : "success-mob-input"
                                                                    }`}
                                                            >
                                                                <SelectValue placeholder={t(lang, "administrative_region")} />
                                                            </SelectTrigger>
                                                        </FormControl>

                                                        <SelectContent>
                                                            {selectedCityRegions.map((region) => (
                                                                <SelectItem key={region.id} value={region.id}>
                                                                    {region.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* License Number */}
                                        <FormField
                                            control={form.control}
                                            name="licenseNumber"
                                            render={({ field }) => (
                                                <FormItem className="form-field">
                                                    <FormLabel className="field-label">{t(lang, "license_number")}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            className={`field-input ${form.formState.errors.licenseNumber ? "error" : "success-mob-input"
                                                                }`}
                                                            style={{ direction: "ltr" }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Official Email */}
                                        <FormField
                                            control={form.control}
                                            name="officialEmail"
                                            render={({ field }) => (
                                                <FormItem className="form-field">
                                                    <FormLabel className="field-label">{t(lang, "official_email")}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="email"
                                                            className={`field-input ${form.formState.errors.officialEmail ? "error" : "success-mob-input"
                                                                }`}
                                                            style={{ direction: "ltr" }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Submit */}
                                        <div className="form-field full-width">
                                            <Button type="submit" className="submit-license-btn" disabled={isSubmitting}>
                                                {isSubmitting ? <span className="loader-btn"></span> : t(lang, "save_changes")}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showSuccess && (
                <CongatsCard
                    title={t(lang, "congratulations")}
                    description={t(lang, "profile_update_success")}
                />
            )}
        </div>
    );
}
