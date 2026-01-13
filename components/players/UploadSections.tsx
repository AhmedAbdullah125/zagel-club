"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { t } from "@/lib/i18n";

import nationalCardIcon from "@/src/assets/images/license/nationalCardIcon.svg";
import healthy from "@/src/assets/images/license/healthy.svg";
import pdfIcon from "@/src/assets/images/pdficon.svg";
import pdf from "@/src/assets/images/pdf.svg";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { DropUpload } from "./DropUpload";

type Props = {
    lang: string;
    form: any;
};

function UploadSectionsBase({ lang, form }: Props) {
    const [nationalIdPreview, setNationalIdPreview] = useState<any>(null);
    const [personalPhotoPreview, setPersonalPhotoPreview] = useState<any>(null);
    const [fitnessCertificatePreview, setFitnessCertificatePreview] = useState<any>(null);
    const [clubApprovalPreview, setClubApprovalPreview] = useState<any[]>([]);

    const setSinglePreviewFromFiles = useCallback((files: File[], setPreview: (v: any) => void) => {
        const file = files?.[0];
        if (!file) return setPreview(null);
        if (file.type === "application/pdf") return setPreview({ type: "pdf", name: file.name });
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    }, []);

    const setMultiPreviewFromFiles = useCallback((files: File[], setPreview: (v: any[]) => void) => {
        if (!files || files.length === 0) return setPreview([]);
        const previews: any[] = [];
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
    }, []);

    return (
        <>
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
                    render={({ field }: any) => (
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
                                            <Image src={nationalIdPreview} alt="Preview" className="preview-image" width={300} height={300} />
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
                    <Image src={nationalCardIcon} alt="Profile Icon" width={300} height={300} />
                </div>
                <h3 className="section-title">{t(lang, "personal_photo")}</h3>
            </div>

            <div className="form-grid-single">
                <FormField
                    control={form.control}
                    name="personalPhoto"
                    render={({ field }: any) => (
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
                                            <Image src={personalPhotoPreview} alt="Preview" className="preview-image" width={300} height={300} />
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
                    <Image src={healthy} alt="Document Icon" width={300} height={300} />
                </div>
                <h3 className="section-title">{t(lang, "fitness_certificate")}</h3>
            </div>

            <div className="form-grid-single">
                <FormField
                    control={form.control}
                    name="fitnessCertificate"
                    render={({ field }: any) => (
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
                                            {fitnessCertificatePreview?.type === "pdf" ? (
                                                <div className="pdf-indicator">
                                                    <Image src={pdf} alt="Document Icon" />
                                                    <p className="pdf-text" style={{ fontSize: 12, marginTop: 5 }}>{fitnessCertificatePreview.name}</p>
                                                </div>
                                            ) : (
                                                <Image src={fitnessCertificatePreview} alt="Preview" className="preview-image" width={300} height={300} />
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
                    <Image src={pdfIcon} alt="Document Icon" width={300} height={300} />
                </div>
                <h3 className="section-title">{t(lang, "club_approval")}</h3>
            </div>

            <div className="form-grid-single">
                <FormField
                    control={form.control}
                    name="clubApproval"
                    render={({ field }: any) => (
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
                                    {clubApprovalPreview?.length > 0 && (
                                        <div className="file-preview" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
                                            {clubApprovalPreview.map((preview, idx) => (
                                                <div key={idx} style={{ flex: "0 0 auto" }}>
                                                    {preview.type === "pdf" ? (
                                                        <div className="pdf-indicator">
                                                            <Image src={pdf} alt="Document Icon" />
                                                            <p className="pdf-text" style={{ fontSize: 12, marginTop: 5 }}>
                                                                {preview.name}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <Image src={preview.src} alt="Preview" className="preview-image" style={{ maxWidth: 100, maxHeight: 100 }} width={300} height={300} />
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
        </>
    );
}

export const UploadSections = React.memo(UploadSectionsBase);
