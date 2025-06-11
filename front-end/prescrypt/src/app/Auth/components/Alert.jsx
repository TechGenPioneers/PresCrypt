export default function Alert({ message, type }) {
    const color = type === "error" ? "text-red-500" : "text-green-600";
    return <p className={`mt-2 text-sm ${color}`}>{message}</p>;
  }
  