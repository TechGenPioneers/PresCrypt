"use client";
import React from "react";
import Footer from "../Components/footer/Footer";
import { VideoCallProvider } from "./VideoCallProvider";
import Layout from "./Layout";

export default function Chat() {
  // const userId = "D002";
  // const userRole = "Doctor";

  return (
    <div>
      <VideoCallProvider>
        <Layout userId={userId} userRole={userRole} />
      </VideoCallProvider>
      <Footer />
    </div>
  );
}