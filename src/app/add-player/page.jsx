import Header from "@/components/Header/Header";
import AddPlayerWrapper from "@/components/players/AddPlayerWrapper";
import React from "react";
import { Footer } from "react-day-picker";
export default function page() {
  return (
    <>
      <Header />
      <AddPlayerWrapper />
      <Footer />
    </>
  )
}
