import React from "react";
import Image from "next/image";
import birds from "../../src/assets/images/birds.png";
import newsImg from "../../src/assets/images/newsImg.png";
import birdsBg from "../../src/assets/images/birdsBg.png";
import { t } from "@/lib/i18n";
import Link from "next/link";
import { useGetAvilableServices } from "../Requests/useGetAvilableServices";
import Loading from "@/src/app/loading";

export default function Membership({ lang }) {
    const { data: avilableServives, isLoading } = useGetAvilableServices(lang)
    return (
        <div className="membership-section has-bg" style={{ backgroundImage: `url(${birdsBg.src})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
            {
                isLoading || !avilableServives ? <Loading /> :
                    <div className="white-bg">
                        <div className="container">
                            <div className="membership-content">
                                <div className="r-side">
                                    <h2>{t(lang, 'membership_title')}</h2>
                                    <p>{t(lang, 'membership_description')}</p>
                                    <div className="cards-cont">
                                        {
                                            avilableServives?.services?.map((service) => (
                                                <div className="card" key={service.id}>
                                                    <Image src={service.logo} alt="membership1" width={100} height={100} />
                                                    <div className="text">
                                                        <h3>{service.title}</h3>
                                                        <p>{service.description}</p>
                                                        <Link href={service.type == "license" ? "/license-request" : "/membership-request"}>{service.type == "license" ? t(lang, 'request_license') : t(lang, 'request_membership')}</Link >
                                                    </div>
                                                </div>
                                            ))
                                        }

                                    </div>
                                </div>
                                <div className="l-side">
                                    <div className="img-cont up">
                                        <div className="img-overlay-cont">
                                            <Image src={birds} alt="birds" />
                                            <div className="overlay"></div>
                                        </div>
                                    </div>
                                    <div className="img-cont down">
                                        <div className="img-overlay-cont">
                                            <Image src={newsImg} alt="newsImg" />
                                            <div className="overlay"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}