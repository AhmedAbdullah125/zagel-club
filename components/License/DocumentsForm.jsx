"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

import { t } from "@/lib/i18n";
import Image from "next/image";

import uploadFile from "@/src/assets/images/license/uploadFile.svg";
import healthy from "@/src/assets/images/license/healthy.svg";
import usersIcon from "@/src/assets/images/license/usersIcon.svg";

import { useDropzone } from "react-dropzone";

// ====== constants ======
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_PDF_TYPES = ["application/pdf"];
const ACCEPTED_DOCUMENT_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_PDF_TYPES];

// ====== schema ======
const makeFormSchema = (lang) =>
    z.object({
        licenseType: z
            .string({ message: t(lang, "license_type_required") })
            .min(1, { message: t(lang, "license_type_required") }),

        clubApproval: z
            .any()
            .refine((files) => files && files.length > 0, {
                message: t(lang, "club_approval_required"),
            })
            .refine(
                (files) => {
                    if (!files || files.length === 0) return true;
                    return files[0]?.size <= MAX_FILE_SIZE;
                },
                { message: t(lang, "file_too_large") }
            )
            .refine(
                (files) => {
                    if (!files || files.length === 0) return true;
                    return ACCEPTED_DOCUMENT_TYPES.includes(files[0]?.type);
                },
                { message: t(lang, "invalid_file_type") }
            ),
    });

// ====== reusable drop upload (single file) ======
function DropUpload({ lang, id, name, accept, multiple = false, value, hasError, descKey, onFiles, children, }) {
    const hasFile = value && value.length > 0;

    const onDrop = useCallback(
        (acceptedFiles) => {
            onFiles(acceptedFiles);
        },
        [onFiles]
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ accept, multiple, noClick: true, onDrop, });

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

            <div className="file-upload-label">
                <div className="upload-content">
                    <Image src={uploadFile} alt="Upload" className="upload-icon" />
                    <p className="upload-text">
                        {isDragActive ? t(lang, "drop_here") : t(lang, descKey)}
                    </p>
                    <p className="upload-or">{t(lang, "or")}</p>

                    <button type="button" className="browse-btn" onClick={open}>
                        {t(lang, "browse_files")}
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}

export default function DocumentsForm({ lang, formData, setFormData, setStep, progress, setProgress, setMaxProgress, }) {
    const [loading, setLoading] = useState(false);

    // preview can be: null | "pdf" | base64 image
    const [clubApprovalPreview, setClubApprovalPreview] = useState(
        formData?.clubApprovalPreview ?? null
    );

    const formSchema = useMemo(() => makeFormSchema(lang), [lang]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            licenseType: formData?.licenseType || "",
            // IMPORTANT: array for dropzone
            clubApproval: formData?.clubApproval || [],
        },
    });

    // progress
    useEffect(() => {
        const subscription = form.watch((value) => {
            let filledInputs = 0;
            const totalInputs = 2;

            if (value.licenseType) filledInputs++;
            if (value.clubApproval && value.clubApproval.length > 0) filledInputs++;

            setProgress(filledInputs);
            setMaxProgress(totalInputs);
        });

        return () => subscription.unsubscribe();
    }, [form, setProgress, setMaxProgress]);

    const setSinglePreviewFromFiles = (files) => {
        const file = files?.[0];
        if (!file) {
            setClubApprovalPreview(null);
            return;
        }

        if (file.type === "application/pdf") {
            setClubApprovalPreview("pdf");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setClubApprovalPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const onSubmit = (data) => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);

            setFormData({
                ...formData,
                ...data,
                // optional: keep preview in parent if you want
                clubApprovalPreview,
            });

            setProgress(0);
            setStep(3);
        }, 1000);
    };

    const licenseTypes = [
        { id: 1, name: "Professional", value: "professional" },
        { id: 2, name: "Amateur", value: "amateur" },
    ];

    return (
        <div className="personal-data-form">
            <div className="container">
                <div className="personal-data-form-content">
                    <div className="form-header">
                        <h2 className="form-title">{t(lang, "required_documents")}</h2>
                        <p className="form-subtitle">{t(lang, "required_documents_desc")}</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="license-form">
                            {/* Club Selection Section */}
                            <div className="section-header">
                                <div className="section-icon">
                                    <Image src={usersIcon} alt="Users Icon" />
                                </div>
                                <h3 className="section-title">{t(lang, "club_selection")}</h3>
                            </div>

                            <div className="form-grid-single">
                                {/* license type Field */}
                                <FormField
                                    control={form.control}
                                    name="licenseType"
                                    render={({ field }) => (
                                        <FormItem className="form-field">
                                            <FormLabel className="field-label">
                                                {t(lang, "license_type_placeholder")}{" "}
                                                <span className="required">*</span>
                                            </FormLabel>

                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger
                                                        className={`field-input select-trigger disabled:opacity-1 ${lang === "ar" ? "ar-select-trigger" : "en-select-trigger"
                                                            } ${form.formState.errors.licenseType
                                                                ? "error-input"
                                                                : field.value
                                                                    ? "success-input"
                                                                    : ""
                                                            }`}
                                                    >
                                                        <SelectValue placeholder={t(lang, "license_type_placeholder")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {licenseTypes.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>
                                                                {t(lang, type.name)}
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

                            {/* Club Approval Section - Required */}
                            <div className="section-header">
                                <div className="section-icon">
                                    <Image src={healthy} alt="Document Icon" />
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
                                                    accept={{
                                                        "application/pdf": [],
                                                        "image/jpeg": [],
                                                        "image/jpg": [],
                                                        "image/png": [],
                                                        "image/webp": [],
                                                    }}
                                                    multiple={false}
                                                    value={field.value}
                                                    hasError={!!form.formState.errors.clubApproval}
                                                    descKey="club_approval_desc"
                                                    onFiles={(files) => {
                                                        // store files in RHF
                                                        field.onChange(files);
                                                        // preview
                                                        setSinglePreviewFromFiles(files);
                                                        // trigger validation instantly
                                                        form.trigger("clubApproval");
                                                    }}
                                                >
                                                    {clubApprovalPreview && (
                                                        <div className="file-preview">
                                                            {clubApprovalPreview === "pdf" ? (
                                                                <div className="pdf-indicator">
                                                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path
                                                                            d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                                                                            stroke="#EF4444"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                        <path
                                                                            d="M14 2V8H20"
                                                                            stroke="#EF4444"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                    <p className="pdf-text">
                                                                        PDF {t(lang, "file_selected")}
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <img
                                                                    src={clubApprovalPreview}
                                                                    alt="Preview"
                                                                    className="preview-image"
                                                                />
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

                            {/* Form Actions */}
                            <div className="form-actions">
                                {/* <Button type="button" onClick={() => setStep(1)} className="previous-license-btn">
                                    {t(lang, "previous")}
                                </Button> */}

                                <Button type="submit" className="submit-license-btn" disabled={loading}>
                                    {loading ? <span className="loader-btn"></span> : <span>{t(lang, "next")}</span>}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
