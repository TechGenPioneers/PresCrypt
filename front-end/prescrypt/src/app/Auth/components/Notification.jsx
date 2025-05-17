// components/auth/Notification.jsx
const Notification = ({ type, message, onClose }) => {
  if (!message) return null;

  const bgColor = {
    success: "bg-green-100 border-green-500",
    error: "bg-red-100 border-red-500",
    warning: "bg-yellow-100 border-yellow-500",
    pending: "bg-blue-100 border-blue-500",
  }[type];

  const textColor = {
    success: "text-green-700",
    error: "text-red-700",
    warning: "text-yellow-700",
    pending: "text-blue-700",
  }[type];

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 border-l-4 p-4 rounded shadow-lg ${bgColor} ${textColor}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-4">
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;