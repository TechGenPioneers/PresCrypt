// components/auth/AuthForm.jsx
const AuthForm = ({ children, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="w-full">
      {children}
    </form>
  );
};

export default AuthForm;