"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { getPatientDetails } from "../services/PatientDataService";

const PatientDashboard = ({ id = "P025" }) => {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getPatientDetails(id);
        setPatient(data);
      } catch (error) {
        console.error("Failed to fetch patient details:", error);
      }
    };

    fetchDetails();
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center gap-12 min-h-[85vh] py-10">

      <h2 className="text-3xl font-bold text-green-700 text-center">
        {patient?.name && (
          <>
            Hi! {patient.name}
            <br />
          </>
        )}
        Welcome to your Personal Health Hub
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <Link href="/Patient/PatientAppointments">
          <Card className="w-96 h-64 rounded-2xl shadow-md border border-green-200 hover:shadow-xl transition duration-300">
            <CardActionArea className="h-full rounded-2xl overflow-hidden">
              <Image
                src="/Appointment_Booking.jpg"
                alt="Book Appointment"
                width={384}
                height={192}
                className="h-2/3 w-full object-cover"
              />
              <CardContent className="flex justify-center items-center h-1/3 bg-green-50">
                <Typography
                  variant="h6"
                  align="center"
                  className="text-green-700 font-semibold"
                >
                  Book Appointment
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>

        <Link href="/Patient/PatientHealthRecords">
          <Card className="w-96 h-64 rounded-2xl shadow-md border border-green-200 hover:shadow-xl transition duration-300">
            <CardActionArea className="h-full rounded-2xl overflow-hidden">
              <Image
                src="/HelathRecords.jpg"
                alt="Health Records"
                width={384}
                height={192}
                className="h-2/3 w-full object-cover"
              />
              <CardContent className="flex justify-center items-center h-1/3 bg-green-50">
                <Typography
                  variant="h6"
                  align="center"
                  className="text-green-700 font-semibold"
                >
                  Health Records
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
        <Link href="/Patient/PatientContactUs">
          <Card className="w-96 h-64 rounded-2xl shadow-md border border-green-200 hover:shadow-xl transition duration-300">
            <CardActionArea className="h-full rounded-2xl overflow-hidden">
              <Image
                src="/ContactUs.jpg" 
                alt="Contact Us"
                width={384}
                height={192}
                className="h-2/3 w-full object-cover"
              />
              <CardContent className="flex justify-center items-center h-1/3 bg-green-50">
                <Typography
                  variant="h6"
                  align="center"
                  className="text-green-700 font-semibold"
                >
                  Contact Us
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>

      </div>
    </div>
  );
};

export default PatientDashboard;
