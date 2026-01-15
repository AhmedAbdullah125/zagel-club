// components/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import flag from "@/src/assets/images/flag.svg";
import logo from "@/src/assets/images/logo.png";
import langImage from "@/src/assets/images/lang.svg";
import userImage from "@/src/assets/images/userIcon.svg";
import cheveron from "@/src/assets/images/cheveron.svg";
import notificationImage from "@/src/assets/images/bill.svg";
import bars from "@/src/assets/images/bars.svg";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

import LogoutModal from "./LogoutModal";
import DeleteAccountModal from "./DeleteAccountModal";

import about from "@/src/assets/images/profileDropDown/about.svg";
import lock from "@/src/assets/images/profileDropDown/lock.svg";
import phone from "@/src/assets/images/profileDropDown/phone.svg";
import terms from "@/src/assets/images/profileDropDown/terms.svg";
import user from "@/src/assets/images/profileDropDown/user.svg";
import wallet from "@/src/assets/images/profileDropDown/wallet.svg";
import contact from "@/src/assets/images/profileDropDown/contact.svg";
import deleteIcon from "@/src/assets/images/profileDropDown/delete.svg";
import complaint from "@/src/assets/images/profileDropDown/complaint.svg";

import CongatsCard from "../global/CongatsCard";
import { useGetProfile } from "../Requests/useGetProfile";
import Cookies from "js-cookie";

const navItems = [
    { label: "الرئيسية", href: "/", lable_en: "Home" },
    { label: "طلباتي", href: "/orders", lable_en: "Orders" },
    { label: "قائمه اللاعبين", href: "/players", lable_en: "Players" },
    { label: "اضافه لاعب", href: "/add-player", lable_en: "Add Player" },
];

const profileMenuItems = [
    { labelKey: "edit_password", href: "/edit-password", icon: lock, iconAlt: "password", isDelete: false },
    { labelKey: "edit_phone_number", href: "/edit-phone", icon: phone, iconAlt: "phone", isDelete: false },
    { labelKey: "profile", href: "/profile", icon: user, iconAlt: "profile", isDelete: false },
    { labelKey: "edit_profile_data", href: "/edit-profile", icon: user, iconAlt: "edit", isDelete: false },
    { labelKey: "my_wallet", href: "/wallet", icon: wallet, iconAlt: "wallet", isDelete: false },
    { labelKey: "my_complaints", href: "/complaints", icon: complaint, iconAlt: "complaints", isDelete: false },
    { labelKey: "terms_and_conditions", href: "/terms-and-conditions", icon: terms, iconAlt: "terms", isDelete: false },
    { labelKey: "about-us", href: "/about", icon: about, iconAlt: "about", isDelete: false },
    { labelKey: "footer_contact_us", href: "/contact", icon: contact, iconAlt: "contact", isDelete: false },
];

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();

    const [lang, setLang] = useState("ar");
    const { data: profile, isLoading } = useGetProfile(lang);

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessCard, setShowSuccessCard] = useState(false);

    // ✅ dropdown open states (for overlay)
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("lang");
            if (stored) setLang(stored);
            else {
                localStorage.setItem("lang", "ar");
                setLang("ar");
            }
        }
    }, []);

    useEffect(() => {
        if (profile === undefined && !isLoading) {
            const token = Cookies.get("token");
            if (token) {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("device_id");
                localStorage.removeItem("fcm_token");
                Cookies.remove("token");
                router.push("/login");
            }
        }
    }, [profile, isLoading, router]);

    useEffect(() => {
        if (showSuccessCard) {
            const timer = setTimeout(() => setShowSuccessCard(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessCard]);

    // ✅ lock scroll while overlay is open (optional but nicer)
    useEffect(() => {
        const isAnyOpen = profileOpen || mobileOpen;
        if (!isAnyOpen) return;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [profileOpen, mobileOpen]);

    const closeAllMenus = () => {
        setProfileOpen(false);
        setMobileOpen(false);
    };

    const handleLogoutClick = () => {
        closeAllMenus();
        setShowLogoutModal(true);
    };

    const handleDeleteAccountClick = () => {
        closeAllMenus();
        setShowDeleteModal(true);
    };

    const toggleLang = () => {
        if (typeof window === "undefined") return;
        const next = lang === "ar" ? "en" : "ar";
        localStorage.setItem("lang", next);
        setLang(next);
        window.location.reload();
    };

    const isOverlayVisible = profileOpen || mobileOpen;

    return (
        <header className={"header"} style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
            {/* ✅ Overlay (darken the rest of the page) */}
            {isOverlayVisible && (
                <div
                    className="header-dropdown-overlay"
                    onClick={closeAllMenus}
                    aria-hidden="true"
                />
            )}

            {/* Top gov bar */}
            <div className={"topBar"}>
                <div className={"container"}>
                    <div className={"topBarInner"}>
                        <Image src={flag} alt="flag" className={"govFlag"} />
                        <span className={"govText"}>{t(lang, "website_title")}</span>
                    </div>
                </div>
            </div>

            {/* Main navigation */}
            <div className={"navBar"}>
                <div className="container">
                    <div className={"navInner"}>
                        {/* Right: logo */}
                        <div className="flex items-center gap-7">
                            <Link href="/">
                                <Image src={logo} alt="logo" className={"logo"} />
                            </Link>

                            {/* Center: nav links */}
                            <nav className={"navMenu"} aria-label="Main navigation">
                                {navItems.map((item, index) => {
                                    const isActive = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
                                    return (
                                        <Link href={item.href} key={index} className={`navItem ${isActive ? "active" : ""}`}>
                                            {lang === "ar" ? item.label : item.lable_en}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Left: language + login */}
                        <div className={"navActions"}>
                            <button className={"langBtn"} type="button" onClick={toggleLang}>
                                <Image src={langImage} alt="lang" className={"langImage"} />
                                <span className={"langText"}>{lang === "ar" ? "English" : "العربية"}</span>
                            </button>

                            {isLoading ? null : !profile ? (
                                <Link href="/login" className={"loginBtn"}>
                                    <Image src={userImage} alt="user" className={"loginIcon"} />
                                    <span className={"loginText"}>{t(lang, "login")}</span>
                                </Link>
                            ) : (
                                <>
                                    {/* ✅ Profile Dropdown (controlled) */}
                                    <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
                                        <DropdownMenuTrigger className={"profileBtn"}>
                                            {profile?.logo && (
                                                <Image src={profile.logo} alt="user" className={"profileIcon"} width={120} height={120} />
                                            )}
                                            <span className="username">{profile.name}</span>
                                            <Image src={cheveron} alt="cheveron" className={"cheveronIcon"} />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent
                                            dir={lang === "ar" ? "rtl" : "ltr"}
                                            className="user-dropdown profile-dropdown header-dropdown-content"
                                        >
                                            <DropdownMenuLabel className="text-center text-lg font-semibold py-3">
                                                {t(lang, "welcome")}
                                            </DropdownMenuLabel>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuGroup className="p-2">
                                                {profileMenuItems.map((item, index) => (
                                                    <DropdownMenuItem key={index} className="cursor-pointer">
                                                        <Link href={item.href} className="w-full flex items-center gap-2" onClick={closeAllMenus}>
                                                            <div
                                                                className={`flex-shrink-0 w-7 h-7 ${item.isDelete ? "bg-red-600" : "bg-primary"
                                                                    } rounded-lg flex items-center justify-center`}
                                                            >
                                                                <Image src={item.icon} alt={item.iconAlt} width={13} height={13} />
                                                            </div>
                                                            <span className={`text-base ${item.isDelete ? "text-red-600" : ""}`}>
                                                                {t(lang, item.labelKey)}
                                                            </span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                ))}

                                                <DropdownMenuItem className="cursor-pointer">
                                                    <button onClick={handleDeleteAccountClick} className="w-full flex items-center gap-2">
                                                        <div className="flex-shrink-0 w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                                                            <Image src={deleteIcon} alt="delete" width={13} height={13} />
                                                        </div>
                                                        <span className="text-base">{t(lang, "delete_account")}</span>
                                                    </button>
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator className="my-2" />

                                                <DropdownMenuItem className="p-0">
                                                    <Button onClick={handleLogoutClick} className="logoutBtn-in-drop-header">
                                                        {t(lang, "logout")}
                                                    </Button>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <Link
                                        href="/notifications"
                                        className={`notification-cont ${profile.notifyCount > 0 ? "has-notification" : ""}`}
                                    >
                                        <Image src={notificationImage} alt="notification" className={"notificationIcon"} />
                                    </Link>
                                </>
                            )}

                            {/* ✅ Mobile menu dropdown (controlled) */}
                            <div className="mob-menue">
                                <DropdownMenu open={mobileOpen} onOpenChange={setMobileOpen}>
                                    <DropdownMenuTrigger className={"profileBtn"}>
                                        <Image src={bars} alt="bars" className={"barsIcon"} />
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        dir={lang === "ar" ? "rtl" : "ltr"}
                                        className="w-56 user-dropdown header-dropdown-content"
                                    >
                                        <DropdownMenuGroup>
                                            {navItems.map((item, index) => (
                                                <DropdownMenuItem key={index}>
                                                    <Link
                                                        href={item.href}
                                                        className="w-full text-center"
                                                        onClick={closeAllMenus}
                                                    >
                                                        {lang === "ar" ? item.label : item.lable_en}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Modal */}
            <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} lang={lang} />

            {/* Delete Account Modal */}
            <DeleteAccountModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} lang={lang} />

            {/* Success Card */}
            {showSuccessCard && (
                <CongatsCard title={t(lang, "logout_success_title")} description={t(lang, "logout_success_desc")} />
            )}
        </header>
    );
}
