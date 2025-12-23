import React from "react";
import { t } from "@/lib/i18n";
import Image from "next/image";
import rialIcon from "@/src/assets/images/SAR.svg";
import serviceIcon from "@/src/assets/images/calculatoe.svg";


export default function OrderPricing({ orderInfo, lang, cost }) {
    // cost object from API: { serviceValue, taxValue, totalAmount }

    if (!cost) return null;

    return (
        <div className="order-pricing">
            <div className="section-header-pricing">
                <div className="section-icon">
                    <Image src={serviceIcon} alt="service" />
                </div>
                <h3 className="section-title-pricing">{t(lang, "service_account")}</h3>
            </div>

            <div className="cost-breakdown">
                {/* License Fee */}
                <div className="cost-item">
                    <span className="cost-label">{t(lang, "license_fee")}</span>
                    <span className="cost-value">
                        {
                            //remover ﷼ and add RialIcon
                            cost.serviceValue.replace("﷼", "")
                        }
                        <Image src={rialIcon} alt="rial" />
                    </span>
                </div>

                {/* VAT */}
                <div className="cost-item">
                    <span className="cost-label">{t(lang, "vat")}</span>
                    <span className="cost-value">
                        {
                            //remover ﷼ and add RialIcon
                            cost.taxValue.replace("﷼", "")
                        }
                        <Image src={rialIcon} alt="rial" />
                    </span>
                </div>

                {/* Total */}
                <div className="cost-item total-item">
                    <span className="cost-label-total">{t(lang, "total")}</span>
                    <span className="cost-value-total">
                        {
                            //remover ﷼ and add RialIcon
                            cost.totalAmount.replace("﷼", "")
                        }
                        <Image src={rialIcon} alt="rial" />
                    </span>
                </div>
            </div>
        </div>
    )
}