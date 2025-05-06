export default function SubmitButton({ onClick, text, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full px-4 py-2 mt-4 bg-teal-700 text-white rounded-md hover:bg-teal-800 disabled:opacity-50"
    >
      {loading ? "Please wait..." : text}
    </button>
  );
}
