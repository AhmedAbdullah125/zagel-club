
import Footer from "@/components/Footer/Footer";
import FixedPageWrapper from "@/components/global/FixedPageWrapper";
import Header from "@/components/Header/Header";
import React from "react";
export default function page() {

    return (
        <>
            <Header />
            <FixedPageWrapper type={'about'} title={"about-us"} />
            <Footer />
        </>
    )
}
