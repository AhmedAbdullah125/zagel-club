"use client"
import React, { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import ContactHero from "../Contact/ContactHero";
import Image from "next/image";
import usersIcon from '@/src/assets/images/editProfileIcom.svg';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import clubLogo from '@/src/assets/images/birds/7.png';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import CongatsCard from "../global/CongatsCard";
import { useGetProfile } from "../Requests/useGetProfile";
import Loading from "@/src/app/loading";
import { useGetCities } from "../Requests/useGetCities";
import { useGetRegions } from "../Requests/useGetRegions";
import { editProfile } from "../Requests/editProfile";
import { useRouter } from "next/navigation";

export default function EditProfileWrapper() {
    const [lang, setLang] = useState('ar');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [logoError, setLogoError] = useState("");
    const { data: profile, isLoading } = useGetProfile(lang);
    const [selectedCity, setSelectedCity] = useState(null);
    const { data: cities, isLoading: citiesLoading } = useGetCities(lang)
    const { data: regions, isLoading: regionsLoading } = useGetRegions(lang, selectedCity, toast)

    const profileFormSchema = z.object({
        clubName: z.string().min(3, {
            message: t(lang, "club_name_min_length"),
        }),
        nationalAddress: z.string().min(3, {
            message: t(lang, "national_address_min_length"),
        }),
        city: z.string({ required_error: t(lang, "city_required"), }).min(1, { message: t(lang, "city_required") }),
        administrativeRegion: z.string({ required_error: t(lang, "administrative_region_required"), }).min(1, { message: t(lang, "administrative_region_required") }),
        licenseNumber: z.string()
            .regex(/^[0-9]+$/, { message: t(lang, "license_number_digits_only") })
            .min(1, { message: t(lang, "license_number_required") }),
        officialEmail: z.string().email({
            message: t(lang, "official_email_invalid"),
        }),
        clubLogo: z.any().optional(),
    });
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLang(localStorage.getItem('lang'));
        }
    }, []);
    const validateImageFile = (file) => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        if (!file) {
            return { valid: false, error: t(lang, "image_select_prompt") };
        }

        if (!allowedTypes.includes(file.type)) {
            return { valid: false, error: t(lang, "image_type_not_supported") };
        }

        if (file.size > maxSize) {
            return { valid: false, error: t(lang, "image_too_large_5mb") };
        }

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
        reader.onloadend = () => {
            setLogoPreview(reader.result);
        };
        reader.readAsDataURL(file);

        form.setValue('clubLogo', file);
    };

    // Mock club data - replace with actual data from API/context
    const defaultValues = {
        clubName: profile?.name,
        nationalAddress: profile?.address,
        city: profile?.city.id,
        administrativeRegion: profile?.area.id,
        licenseNumber: profile?.licenseNumber,
        officialEmail: profile?.email,
        logoUrl: profile?.logo
    };
    const [logoPreview, setLogoPreview] = useState(defaultValues.logoUrl);

    // Initialize form with react-hook-form and Zod
    const form = useForm({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            clubName: defaultValues.clubName,
            nationalAddress: defaultValues.nationalAddress,
            city: defaultValues.city,
            administrativeRegion: defaultValues.administrativeRegion,
            licenseNumber: defaultValues.licenseNumber,
            officialEmail: defaultValues.officialEmail
        }
    });
    useEffect(() => {
        setSelectedCity(profile?.city.id);
        if (profile && cities && regions) {
            form.setValue('clubName', profile.name);
            form.setValue('nationalAddress', profile.address);
            form.setValue('city', profile.city.id);
            form.setValue('administrativeRegion', profile.area.id);
            form.setValue('licenseNumber', profile.licenseNumber);
            form.setValue('officialEmail', profile.email);
            setLogoPreview(profile.logo);
            setSelectedCity(profile.city.id);
        }
    }, [profile, cities, regions]);
    const router = useRouter();

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        const formData = new FormData();
        if (data.clubLogo) {
            formData.append('logo', data.clubLogo);
        }
        formData.append('name', data.clubName);
        formData.append('address', data.nationalAddress);
        formData.append('city', data.city);
        formData.append('area', data.administrativeRegion);
        formData.append('licenseNumber', data.licenseNumber);
        formData.append('email', data.officialEmail);
        editProfile(formData, setIsSubmitting, lang, router, setShowSuccess);
    };

    return (
        <div className="home-page-content" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
            <ContactHero lang={lang} subtitle={t(lang, "edit_profile_data")} />

            {
                isLoading || !profile || citiesLoading ? <Loading /> :
                    <div className="container">
                        <div className="profile-content-wrapper">
                            {/* Personal Club Section */}
                            <div className="personal-club-content">
                                <div className="order-section">
                                    {/* Header */}
                                    <div className="order-section-header">
                                        <div className="img-cont">
                                            <Image src={usersIcon} alt="user-icon" />
                                        </div>
                                        <span>{t(lang, "user_info")}</span>
                                    </div>

                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="form-grid">
                                            <div className="form-field full-width">
                                                <label className="field-label">{t(lang, "club_logo")}</label>
                                                <label htmlFor="club-logo-upload" className="club-logo-container-profile" style={{ cursor: 'pointer' }}>
                                                    <Image src={logoPreview ? logoPreview : clubLogo} alt="Club Logo" width={120} height={120} className="club-logo-image-profile" />
                                                    <input id="club-logo-upload" type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleLogoChange} style={{ display: 'none' }} />
                                                </label>
                                                {logoError && (
                                                    <p className="text-sm text-red-500 mt-1" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
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
                                                        <FormLabel className="field-label">
                                                            {t(lang, "club_name")}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                className="field-input"
                                                                style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
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
                                                        <FormLabel className="field-label">
                                                            {t(lang, "national_address")}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                className="field-input"
                                                                style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
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
                                                        <FormLabel className="field-label">
                                                            {t(lang, "city")}
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={(value) => {
                                                                setSelectedCity(value);
                                                                field.onChange(value);
                                                                form.setValue('administrativeRegion', '');
                                                            }}
                                                            value={field.value}
                                                            disabled={cities?.length === 0 || citiesLoading}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className={`field-input select-trigger disabled:opacity-1 ${lang == "ar" ? "ar-select-trigger" : "en-select-trigger"}`}>
                                                                    <SelectValue placeholder={t(lang, "city_placeholder")} />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {cities?.map((city) => (
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

                                            {/* Administrative Region */}
                                            <FormField
                                                control={form.control}
                                                name="administrativeRegion"
                                                render={({ field }) => (
                                                    <FormItem className="form-field">
                                                        <FormLabel className="field-label">
                                                            {t(lang, "administrative_region")}
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                            disabled={regions?.length === 0 || cities?.length === 0 || regionsLoading || citiesLoading || !selectedCity}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className={`field-input select-trigger disabled:opacity-1 ${lang == "ar" ? "ar-select-trigger" : "en-select-trigger"}`}>
                                                                    <SelectValue placeholder={t(lang, "administrative_region")} />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {regions?.map((region) => (
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
                                                        <FormLabel className="field-label">
                                                            {t(lang, "license_number")}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                className="field-input"
                                                                style={{ direction: 'ltr' }}
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
                                                        <FormLabel className="field-label">
                                                            {t(lang, "official_email")}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="email"
                                                                className="field-input"
                                                                style={{ direction: 'ltr' }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Save Button */}
                                            <div className="form-field full-width">
                                                <Button
                                                    type="submit"
                                                    className="submit-license-btn"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting
                                                        ? <span className="loader-btn"></span>
                                                        : t(lang, "save_changes")
                                                    }
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
            }

            {/* Success Card */}
            {showSuccess && (
                <CongatsCard
                    title={t(lang, "congratulations")}
                    description={t(lang, "profile_update_success")}
                />
            )}
        </div>
    )
}