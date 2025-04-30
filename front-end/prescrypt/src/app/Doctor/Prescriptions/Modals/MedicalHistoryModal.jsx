"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const MedicalHistoryModal = ({ isOpen, onClose, patient }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState({
    prescriptions: false,
    reports: false,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !patient?.patientId) return;

    const fetchMedicalData = async () => {
      try {
        setLoading({ prescriptions: true, reports: true });
        setError(null);

        const [presRes, reportsRes] = await Promise.all([
          axiosInstance.get(
            `/api/prescriptions?patientId=${patient.patientId}`
          ),
          //axiosInstance.get(`/api/reports?patientId=${patient.patientId}`),
        ]);

        setPrescriptions(presRes.data || []);
        setReports(reportsRes.data || []);
      } catch (err) {
        setError("Unable to fetch medical data.");
      } finally {
        setLoading({ prescriptions: false, reports: false });
      }
    };

    fetchMedicalData();
  }, [isOpen, patient?.patientId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#ffffffc0] flex items-center justify-center z-50">
      <div className="bg-[#E9FAF2] p-2 rounded-[20px] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 rounded-[20px] border-2 border-dashed border-black">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Patient Info */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[#094A4D]">
              Medical History
            </h2>
            <p className="text-sm text-gray-700">
              Patient ID: {patient.patientId}
            </p>
            <p className="text-sm text-gray-700">
              Name: {patient.patientName}
            </p>
          </div>

          {/* Prescriptions */}
          <section className="mb-6">
            <h3 className="font-semibold text-[#094A4D] mb-2">Prescriptions</h3>
            {loading.prescriptions ? (
              <p className="text-gray-500">Loading prescriptions...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : prescriptions.length === 0 ? (
              <p className="text-gray-500">No prescriptions found.</p>
            ) : (
              <div className="border rounded-lg">
                <div className="grid grid-cols-4 bg-[#0064694e] text-[#094A4D] font-medium p-2">
                  <div>Date</div>
                  <div>Medication</div>
                  <div>Dosage</div>
                  <div>Instructions</div>
                </div>
                {prescriptions.map((pres, i) => (
                  <div key={i} className="grid grid-cols-4 border-t p-2">
                    <div>{new Date(pres.date).toLocaleDateString()}</div>
                    <div>{pres.drug?.display || pres.drug}</div>
                    <div>{pres.dose}</div>
                    <div>{pres.instructions || "N/A"}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Reports */}
          <section>
            <h3 className="font-semibold text-[#094A4D] mb-2">
              Medical Reports
            </h3>
            {loading.reports ? (
              <p className="text-gray-500">Loading reports...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : reports.length === 0 ? (
              <p className="text-gray-500">No reports found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((report, i) => (
                  <div key={i} className="border rounded-lg p-3 bg-gray-50">
                    <div className="font-medium">
                      {report.display || "Medical Report"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(report.date).toLocaleDateString()} •{" "}
                      {report.type?.display || report.type || "Report"}
                    </div>
                    <button
                      onClick={() =>
                        window.open(
                          `/api/openmrs/reports/${report.id}/download`,
                          "_blank"
                        )
                      }
                      className="mt-2 text-sm text-[#094A4D] hover:underline"
                    >
                      View Report
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryModal;
