export default function InputField({ type, name, placeholder, value, onChange, error }) {
    return (
      <div className="mb-4 w-full">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
  