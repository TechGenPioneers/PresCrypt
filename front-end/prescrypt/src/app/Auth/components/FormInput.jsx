// components/auth/FormInput.jsx
export default function FormInput({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
}) {
  return (
    <div className="mb-4">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={`w-full bg-gray-50 border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 ${
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