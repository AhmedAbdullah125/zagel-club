"use client"
import React, { useEffect, useState } from "react";
import FancyboxWrapper from "../ui/FancyboxWrapper";
import { Eye } from "lucide-react"
import Image from "next/image";

export default function ImagesGallery({ images ,isAuction}) {
    const [activeIndex, setActiveIndex] = useState(0)
    const activeImage = images[activeIndex]
    return (
        <div className="auction-gallery-side">
            {/* Main Image with Countdown */}
            <div className="main-image-container">
                <FancyboxWrapper>
                    <a
                        data-fancybox="auction-gallery"
                        href={activeImage.img.src}
                        className="main-auction-image-link"
                    >
                        <Image
                            src={activeImage.img}
                            alt="Auction Pigeon"
                            className="main-auction-image"
                            width={800}
                            height={600}
                        />
                    </a>

                    {/* Hidden links for gallery */}
                    {images.map((item, indx) =>
                        indx === activeIndex ? null : (
                            <a
                                key={item.id}
                                data-fancybox="auction-gallery"
                                href={item.img.src}
                                className="hidden-fancybox-link"
                            />
                        )
                    )}
                </FancyboxWrapper>

                {/* Countdown Timer Overlay */}
                {
                    isAuction ?
                        <div className="auction-countdown-overlay">
                            <div className="countdown-display">
                                <span className="countdown-number">59</span>
                                <span className="countdown-separator">:</span>
                                <span className="countdown-number">59</span>
                                <span className="countdown-separator">:</span>
                                <span className="countdown-number">2</span>
                            </div>
                        </div> : null
                }
            </div>

            {/* Thumbnail Grid */}
            <div className="thumbs-row">
                {images.map((item, idx) => (
                    <div
                        key={item.id}
                        className={`auction-detail-thumb ${idx === activeIndex ? "active" : ""}`}
                        onClick={() => setActiveIndex(idx)}
                    >
                        <Image
                            src={item.img}
                            alt={`Thumbnail ${item.id}`}
                            className="thumb-image"
                            width={200}
                            height={150}
                        />
                        {idx === 3 && (
                            <div className="thumb-eye-overlay">
                                <FancyboxWrapper>
                                    <a
                                        data-fancybox="auction-gallery"
                                        href={item.img.src}
                                        className="thumb-eye-link"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="thumb-eye-icon">
                                            <Eye size={20} color="white" />
                                        </div>
                                    </a>
                                </FancyboxWrapper>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
