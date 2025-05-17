// components/auth/FormTextarea.jsx
export default function FormTextarea({
  name,
  placeholder,
  value,
  onChange,
  error,
  rows = 3,
  required = false,
}) {
  return (
    <div className="mb-4">
      <textarea
        name={name}
        placeholder={placeholder}
        rows={rows}
        className={`w-full bg-gray-50 border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 resize-none ${
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:ring-teal-200"
        }`}
        value={value}
        onChange={onChange}
        required={required}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}