import PatientHeader from "@/components/Header/Header";
import Footer from "@/components/footer/Footer";

export default function PatientLayout({ children }) {
  return (
    <div>
      <PatientHeader />
      <main style={{ padding: "2rem" }}>{children}</main>
      <Footer />
    </div>
  );
}
