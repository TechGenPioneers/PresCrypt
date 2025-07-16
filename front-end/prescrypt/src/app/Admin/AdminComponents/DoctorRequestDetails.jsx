"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import {
  GetRequestById,
  RejectRequest,
  SendMail,
} from "../service/AdminDoctorRequestService";
import { Spinner } from "@material-tailwind/react";
import {
  User,
  DollarSign,
  AlertTriangle,
  Phone,
  Mail,
  CreditCard,
  Shield,
  Clock,
  MapPin,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  X,
  FileX,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

const DoctorRequestDetails = ({ requestId }) => {
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [dateTime, setDateTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);

  const [mail, setMail] = useState({
    Receptor: "",
    FirstName: "",
    LastName: "",
    reason: "",
  });

  //get request by id
  const fetchRequest = async () => {
    const getRequest = await GetRequestById(requestId);

    const slmcIdImageBase64 = getRequest.request.slmcIdImage;

    setRequest(getRequest);
    setImageSrc(`data:image/jpeg;base64,${slmcIdImageBase64}`);
    console.log("Request:", getRequest);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmitting(true);
    const updatedMail = {
      ...mail,
      Receptor: request.request.email,
      FirstName: request.request.firstName,
      LastName: request.request.lastName,
    };

    console.log("Rejection reason:", updatedMail);

    console.log("Rejection reason:", mail);
    try {
      const sent = await SendMail(updatedMail);
      console.log(sent);
      if (sent != null) {
        try {
          const response = await RejectRequest(
            request.request.requestId,
            mail.reason
          );
          console.log(response);
        } catch (error) {
          alert("failed to reject");
        }
      }
    } catch (err) {
      console.error("Failed to send mail", err);
      alert("Failed to send mail!", err);
    }
    setIsLoading(false);
    setMail({ Receptor: "", reason: "" });
    fetchRequest();
    setIsSubmitting(false);
    setShowModal(false);
  };

  useEffect(() => {
    fetchRequest();

    const updateDateTime = () => setDateTime(new Date());
    updateDateTime(); // Set initial time
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [requestId]);

useEffect(() => {
    const timeout = setTimeout(() => {
      if (!request) {
        setShowNotFound(true);
      }
    }, 60000); // 1 minute = 60000ms

    if (request) {
      clearTimeout(timeout); // cancel timeout if doctor is loaded
      setShowNotFound(false);
    }

    return () => clearTimeout(timeout); // cleanup on unmount
  }, [request]);

  const isWithin7Days = (dateString) => {
    const rejectedDate = new Date(dateString);
    const today = new Date();
    const diffTime = today - rejectedDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  if (!dateTime) return null; // Prevent SSR mismatch

  if (showNotFound && !request) {
    return (
      <div className="min-h-screen bg-[#f3faf7] p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Doctor Request
            </h1>
            <div className="w-20 h-1 bg-[#A9C9CD] rounded-full"></div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 px-8 py-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FileX className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Request Status
                  </h2>
                  <p className="text-sm text-gray-600">
                    Unable to locate the requested item
                  </p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="px-8 py-12">
              <div className="text-center space-y-6">
                {/* Error Icon */}
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                  <FileX className="w-12 h-12 text-red-500" />
                </div>

                {/* Error Message */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Request Not Found
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                    The doctor request you're looking for doesn't exist or may
                    have been removed. Please check the URL or return to the
                    request list.
                  </p>
                </div>

                {/* Suggestions */}
                <div className="bg-[#E9FAF2] rounded-xl p-6 max-w-md mx-auto">
                  <h4 className="font-semibold text-[#022a32] mb-3">
                    What you can do:
                  </h4>
                  <ul className="text-sm text-[#09424D] space-y-2 text-left">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-[#09424D] rounded-full"></div>
                      <span>Check if the request ID is correct</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-[#09424D] rounded-full"></div>
                      <span>Verify you have the right permissions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-[#09424D] rounded-full"></div>
                      <span>Make sure request is exisit</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="flex items-center gap-4 px-8 py-3  bg-[#A9C9CD] text-[#09424D]  font-semibold rounded-xl hover:bg-[#91B4B8]  transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Go to Doctor Request List</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "Approved":
        return {
          color: "text-emerald-700",
          bgColor: "bg-emerald-100",
          borderColor: "border-emerald-200",
          dotColor: "bg-emerald-500",
          icon: CheckCircle,
        };
      case "Rejected":
        return {
          color: "text-red-700",
          bgColor: "bg-red-100",
          borderColor: "border-red-200",
          dotColor: "bg-red-500",
          icon: XCircle,
        };
      default:
        return {
          color: "text-amber-700",
          bgColor: "bg-amber-100",
          borderColor: "border-amber-200",
          dotColor: "bg-amber-500",
          icon: AlertCircle,
        };
    }
  };

  const statusConfig = getStatusConfig(request?.request?.requestStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-[#f3faf7] p-6">
      {request?.request ? (
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {request.request.firstName} {request.request.lastName} -{" "}
                  {request.request.specialization}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    Request ID: {request.request.requestId}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}
                  >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {request.request.requestStatus}
                  </span>
                </div>
              </div>
            </div>

            {request.request.requestStatus === "Rejected" &&
              isWithin7Days(request.request.checkedAt) && (
                <Link
                  href={`/Admin/RegistrationConfirmPage/${request.request.requestId}`}
                >
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Manage Request
                  </button>
                </Link>
              )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Doctor Information */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Doctor Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <p className="w-6 h-6 text-green-600">Rs.</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Doctor Fee</p>
                    <p className="font-semibold text-gray-900">
                      Rs. {request.request.charge}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-semibold text-gray-900">
                      {request.request.gender}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-semibold text-gray-900">
                      {request.request.contactNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Specialization</p>
                    <p className="font-semibold text-gray-900">
                      {request.request.specialization}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">SLMC License</p>
                    <p className="font-semibold text-gray-900">
                      {request.request.slmcRegId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">
                      {request.request.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">NIC</p>
                    <p className="font-semibold text-gray-900">
                      {request.request.nic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email Verified</p>
                    <p className="font-semibold text-gray-900">
                      {request.request.emailVerified
                        ? "Verified"
                        : "Not Verified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Requested At</p>
                    <p className="font-semibold text-gray-900">
                      {request.request.createdAt}
                    </p>
                  </div>
                </div>

                {(request.request.requestStatus === "Approved" ||
                  request.request.requestStatus === "Rejected") && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Checked At</p>
                      <p className="font-semibold text-gray-900">
                        {request.request.checkedAt}
                      </p>
                    </div>
                  </div>
                )}

                {request.request.requestStatus === "Rejected" && (
                  <div className="md:col-span-2 flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reason</p>
                      <p className="font-semibold text-gray-900">
                        {request.request.reason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Availability
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {request.requestAvailability.map((slot, index) => (
                  <div
                    key={index}
                    className="bg-[#E9FAF2] rounded-2xl p-4 border border-[#A9C9CD]"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#A9C9CD] rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#09424D]" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {slot.availableDay}
                        </p>
                        <p className="text-sm text-gray-600">
                          {slot.availableStartTime} - {slot.availableEndTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-13">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-medium text-gray-700">
                        {slot.hospitalName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SLMC ID Image */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            SLMC ID Verification
          </h3>
          <div className="flex justify-center">
            <div className="relative group">
              <div className="bg-[#E9FAF2] rounded-2xl p-4 border border-[#A9C9CD] hover:shadow-xl transition-all duration-300">
                <img
                  className="rounded-xl max-w-2xl h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  src={imageSrc}
                  alt="SLMC ID"
                />
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            SLMC ID Documentation
          </p>
        </div>

        {/* Action Buttons */}
        {request.request.requestStatus === "Pending" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                onClick={() => setShowModal(true)}
              >
                <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                Cancel Request
              </button>

              <Link
                href={`/Admin/RegistrationConfirmPage/${request.request.requestId}`}
              >
                <button className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#A9C9CD] text-[#09424D]  font-semibold rounded-xl hover:bg-[#91B4B8] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  Confirm Registration
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Cancel Request
                    </h2>
                    <p className="text-sm text-gray-500">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Reason for Cancellation{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={mail.reason}
                    onChange={(e) =>
                      setMail({ ...mail, reason: e.target.value })
                    }
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all duration-200 placeholder-gray-400"
                    rows="4"
                    placeholder="Please provide a reason for cancellation..."
                    required
                  />
                  <p className="text-xs text-gray-500">
                    {mail.reason.length}/500 characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Keep Request
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !mail.reason.trim()}
                    className="flex-1 px-4 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium relative"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Canceling...</span>
                      </div>
                    ) : (
                      "Cancel Request"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      ) : (
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#E9FAF2] border-t-[#50d094] rounded-full animate-spin"></div>
            <p className="text-slate-600 text-lg font-medium">
              Loading Patient Details...
            </p>
          </div>
        </div>
      )}
      {/*waiting component */}
      {isLoading && (
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#E9FAF2] border-t-[#50d094] rounded-full animate-spin"></div>
            <p className="text-slate-600 text-lg font-medium">Please Wait...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorRequestDetails;
