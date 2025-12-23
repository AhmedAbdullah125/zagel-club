import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import SingleComplaintWrapper from "@/components/MyComplaint/SingleComplaintWrapper";
import React from "react";
export default async function page({ params }) {
  const { id } = await params;
  return (
    <>
      <Header />
      <SingleComplaintWrapper id={id} />
      <Footer />
    </>
  )
}
