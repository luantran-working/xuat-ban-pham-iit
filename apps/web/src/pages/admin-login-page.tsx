import { Navigate, useLocation } from 'react-router-dom';

export function AdminLoginPage() {
  const location = useLocation();

  return (
    <Navigate
      to="/"
      replace
      state={{
        ...(location.state ?? {}),
        adminLogin: true,
      }}
    />
  );
}
