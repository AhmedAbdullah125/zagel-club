import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import OrderWrapper from "@/components/Orders/OrderWrapper";
import React from "react";
export default async function page({ params }) {
  const { id } = await params;
  return (
    <>
      <Header />
      <OrderWrapper id={id} />
      <Footer />
    </>
  )
}
