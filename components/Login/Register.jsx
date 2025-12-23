"use client"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import uploadFile from '@/src/assets/images/license/uploadFile.svg'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import loginImage from "@/src/assets/images/registeration/login.jpg"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { t } from "@/lib/i18n"
import { useGetCities } from "../Requests/useGetCities"
import { useGetRegions } from "../Requests/useGetRegions"
import { toast } from "sonner"
export default function Register({ step, formData, setFormData, lang, setStep }) {
    const [selectedCity, setSelectedCity] = useState(formData.city || null)
    const { data: cities, isLoading: citiesLoading } = useGetCities(lang)
    const { data: regions, isLoading: regionsLoading } = useGetRegions(lang, selectedCity, toast)
    console.log(selectedCity);

    const [loading, setLoading] = useState(false)
    const [nationalIdPreview, setNationalIdPreview] = useState(null)
    const registerSchema = z.object({
        name: z.string().min(1, { message: t(lang, "club_name_required") }).min(2, { message: t(lang, "club_name_min_length") }),
        city: z.string().min(1, { message: t(lang, "city_required") }),
        administrativeRegion: z.string().min(1, { message: t(lang, "administrative_region_required") }),
        nationalAddress: z.string().min(1, { message: t(lang, "national_address_required") }).min(3, { message: t(lang, "national_address_min_length") }),
        clubLogo: z.any().refine((files) => files?.length > 0, {
            message: t(lang, "club_logo_required")
        }),
    })

    const handleFileChange = (e, setPreview) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.type === 'application/pdf') {
                setPreview('pdf')
            } else {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setPreview(reader.result)
                }
                reader.readAsDataURL(file)
            }
        }
    }

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: formData?.name || "",
            city: formData?.city || "",
            administrativeRegion: formData?.administrativeRegion || "",
            nationalAddress: formData?.nationalAddress || "",
            clubLogo: null,

        },
    })

    const onSubmit = (data) => {
        setFormData({ ...formData, ...data })
        setStep(2)
    }

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
                                <h1 className="login-title">{t(lang, "register_title")}</h1>
                                <p className="login-subtitle">{t(lang, "register_subtitle")}</p>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="login-form">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-password">
                                                <FormLabel className="password-label">{t(lang, "club_name_label")}</FormLabel>
                                                <FormControl>
                                                    <div className={`password-input-wrapper ${form.formState.errors.name ? 'error-password' : field.value ? 'success-password' : ''}`}>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            placeholder={t(lang, "full_name_placeholder")}
                                                            className="password-input name-input"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="password-error" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-password">
                                                <FormLabel className="password-label">
                                                    {t(lang, "city_label")}
                                                </FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={(value) => { setSelectedCity(value); field.onChange(value) }} value={field.value} disabled={cities?.length === 0 || citiesLoading}>
                                                        <SelectTrigger className={`password-input-wrapper ${form.formState.errors.city ? 'error-password' : field.value ? 'success-password' : ''}`}
                                                            style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                                                        >
                                                            <SelectValue placeholder={t(lang, "city_label")} />
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
                                                <FormMessage className="password-error" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="administrativeRegion"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-password">
                                                <FormLabel className="password-label">
                                                    {t(lang, "administrative_region")}
                                                </FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value} disabled={regions?.length == 0 || cities?.length === 0 || regionsLoading || citiesLoading || !selectedCity}>
                                                        <SelectTrigger className={`password-input-wrapper ${form.formState.errors.administrativeRegion ? 'error-password' : field.value ? 'success-password' : ''}`}
                                                            style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                                                        >
                                                            <SelectValue placeholder={t(lang, "administrative_region")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {regions?.map((region) => (
                                                                <SelectItem key={region.id} value={region.id}>
                                                                    {region.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage className="password-error" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="nationalAddress"
                                        render={({ field }) => (
                                            <FormItem className="from-input-wrapper-password">
                                                <FormLabel className="password-label">
                                                    {t(lang, "national_address")}
                                                </FormLabel>
                                                <FormControl>
                                                    <div className={`password-input-wrapper ${form.formState.errors.nationalAddress ? 'error-password' : field.value ? 'success-password' : ''}`}>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            placeholder={t(lang, "national_address")}
                                                            className="password-input"
                                                            style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="password-error" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="clubLogo"
                                        render={({ field: { onChange, value, ...field } }) => (
                                            <FormItem className="personal-data-form personal-data-form-nop">
                                                <FormLabel className="password-label">
                                                    {t(lang, "logo")}
                                                </FormLabel>
                                                <FormControl>
                                                    <div className={`file-upload-wrapper ${form.formState.errors.clubLogo ? 'error-input' : value && value.length > 0 ? 'success-input' : ''}`}>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            id="clubLogo"
                                                            className="file-input-hidden"
                                                            onChange={(e) => {
                                                                onChange(e.target.files)
                                                                handleFileChange(e, setNationalIdPreview)
                                                            }}
                                                            {...field}
                                                        />
                                                        <label htmlFor="clubLogo" className="file-upload-label">
                                                            <div className="upload-content">
                                                                <Image src={uploadFile} alt="Upload" className="upload-icon" />
                                                                <p className="upload-text">
                                                                    {t(lang, "national_id_desc")}
                                                                </p>
                                                            </div>
                                                            {nationalIdPreview && nationalIdPreview !== 'pdf' && (
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

                                    <Button type="submit" className="submit-btn" disabled={!form.formState.isValid && !form.formState.isDirty}>
                                        {loading ? (
                                            <span className="loader-btn"></span>
                                        ) : (
                                            <span>{t(lang, "next")}</span>
                                        )}
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
    )
}