import * as z from "zod";
import { t } from "@/lib/i18n";

export const makePlayerSchema = (lang: string) =>
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
                    return Array.from(files).every((file: any) => file.size <= 10 * 1024 * 1024);
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

export const defaultPlayerValues = {
    fullName: "",
    nationalId: "",
    birthDate: "",
    nationality: "",
    phone: "",
    country: "+966 SA",
    city: "",
    email: "",
    address: "",
    nationalIdPhoto: [] as File[],
    personalPhoto: [] as File[],
    fitnessCertificate: [] as File[],
    clubApproval: [] as File[],
};
