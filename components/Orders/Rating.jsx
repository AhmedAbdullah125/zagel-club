"use client"
import { Star } from "lucide-react";
import React, { useState } from "react";
import { rateOrder } from "../Requests/rateOrder";
import CongatsCard from "../global/CongatsCard";
import { t } from "@/lib/i18n";

export default function Rating({ id, lang }) {
    const [selectedStars, setSelectedStars] = useState(0);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");

    return (
        <div className="rating-cont" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
            {
                Array.from({ length: 5 }, (_, index) => index + 1).map((star) => (

                    <Star key={star} onClick={() => {
                        setSelectedStars(star);
                        rateOrder(id, star, setSuccess, lang, setMessage);
                    }} className={`${selectedStars >= star ? "fill" : ""} ${lang === "ar" ? "rtl" : "ltr"}`} />
                ))
            }
            {
                success && (
                    <CongatsCard
                        title={t(lang, "congratulations")}
                        description={message}
                    />
                )
            }
        </div>
    );
}
