"use client"
import React, { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import ContactHero from "../Contact/ContactHero";
import PersonalAndClubData from "./PersonalAndClubData";
import OrderMessage from "./OrderMessage";
import OrderPricing from "./OrderPricing";
import { Button } from "../ui/button";
import CancelOrderModal from "./CancelOrderModal";
import CongatsCard from "../global/CongatsCard";
import { useGetOrder } from "../Requests/useGetOrder";
import Loading from "@/src/app/loading";
import { useGetReasons } from "../Requests/useGetReasons";


export default function OrderWrapper({ id }) {
  const [lang, setLang] = useState('ar');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const { data: order, isLoading } = useGetOrder(lang, id);
  console.log(order);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLang(localStorage.getItem('lang'));
    }
  }, []);

  // Add this useEffect after the existing useEffect
  useEffect(() => {
    if (showSuccessCard) {
      const timer = setTimeout(() => {
        setShowSuccessCard(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessCard]);

  const orderInfo = order ? {
    id: order.id,
    name: order.typeText,
    number: order.requestNumber,
    status: order.status, // pending, accepted, current, finished, cancelled
    statusText: order.statusText,
    statusMessage: order.statusMessage,
    showCancelBtn: order.showCancelBtn,
    paymentStatusBtn: order.paymentStatusBtn,
    showComplaintBtn: order.showComplaintBtn,
    isServiceReceivedBtn: order.isServiceReceivedBtn,
    showRatingBtn: order.showRatingBtn,
  } : {

    number: "",
    status: 'pending',
    statusText: "",
  };

  // Status colors based on order status
  const statusColors = {
    pending: "#2D9CDB",
    accepted: "#1B8354",
    current: "#F2994A",
    finished: "#1B8354",
    cancelled: "#E5252A",
    pending: "#2D9CDB"
  };

  // Status background colors (lighter versions)
  const statusBgColors = {
    pending: "#D6EAF8",
    accepted: "#D5F4E6",
    current: "#FCE8D6",
    finished: "#D5F4E6",
    cancelled: "#FDEAEA",
    pending: "#D6EAF8"
  };

  const userInfo = order ? {
    serviceFiles: order.serviceFiles,
    personalInfo: {
      fullName: order.fullName,
      nationalId: order.nationalId,
      dateOfBirth: order.dateOfBirth,
      nationality: order.nationality,
      mobileNumber: order.phone,
      mobileCountryCode: order.countryCode,
      city: order.city || "-",
      fullAddress: order.address,
    },
    clubInfo: {
      clubName: order.club?.name || "-"
    },
    attachments: {
      clubApproval: {
        type: "pdf",
        label: t(lang, "club_approval_label"),
        url: order.documents?.clubApproval
      },
      idPhoto: {
        type: "image",
        label: t(lang, "id_photo_label"),
        url: order.documents?.nationalImage
      },
      personalPhoto: {
        type: "image",
        label: t(lang, "personal_photo_label"),
        url: order.documents?.profilePhoto
      },
      fitnessCertificate: {
        type: "pdf",
        label: t(lang, "fitness_certificate_label"),
        url: order.documents?.fitnessCertificate
      }
    },
    cost: order.cost,
    typeText: order.typeText,
    licenseTypeText: order.licenseTypeText
  } : null;

  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  const handleCancelSuccess = (message) => {
    setShowSuccessCard(message);
  };

  const { data: reasons, isLoading: reasonsLoading } = useGetReasons(lang, orderInfo.showCancelBtn);


  return (
    <div className="order-page" style={{ direction: lang == "ar" ? "rtl" : "ltr" }}>
      <ContactHero lang={lang} title={t(lang, "my_orders")} subtitle={orderInfo.name} />
      {
        isLoading ? <Loading /> :
          <div className="container">
            {
              order.status == "pending" ? null :
                <OrderMessage orderInfo={orderInfo} cost={order?.cost} lang={lang} />
            }
            {
              orderInfo.status === "pending" ? null :
                <OrderPricing orderInfo={orderInfo} lang={lang} cost={userInfo?.cost} />
            }
            <div className="order-header">
              <h2>{orderInfo.name}</h2>
              <div className="details-cont">
                <div className="r-side">
                  <span className="label">{t(lang, "order_number_label")}</span>
                  <span className="value">{orderInfo.number}</span>
                </div>
                <div className="l-side">
                  <span style={{ color: statusColors[orderInfo.status], backgroundColor: statusBgColors[orderInfo.status] }}>{orderInfo.statusText}</span>
                </div>
              </div>
            </div>

            <PersonalAndClubData lang={lang} userInfo={userInfo} />
            {
              orderInfo.showCancelBtn ?
                <Button onClick={handleCancelOrder} className="cancel-order-btn">
                  {t(lang, "cancel_order_button")}
                </Button>
                : null
            }
          </div>
      }

      {/* Cancel Order Modal */}
      <CancelOrderModal
        id={orderInfo.id}
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onSuccess={handleCancelSuccess}
        lang={lang}
        reasons={reasons}
        reasonsLoading={reasonsLoading}
      />

      {/* Success Card */}
      {showSuccessCard && (
        <CongatsCard
          title={t(lang, "cancel_order_success_title")}
          description={showSuccessCard}
        />
      )}
    </div>
  )
}