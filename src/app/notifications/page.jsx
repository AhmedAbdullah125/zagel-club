import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import React from "react";
import NotificationsWrapper from "@/components/Notifications/NotificationsWrapper";

export default function page() {
    return (
        <>
            <Header />
            <NotificationsWrapper />
            <Footer />
        </>
    )
}