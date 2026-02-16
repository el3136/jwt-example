import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthProvider from "./context/AuthProvider";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <h1>JWT Demo</h1>

      <nav style={{ marginBottom: 20 }}>
        {!user && <Link to="/login">Login</Link>}{" "}
        {!user && <Link to="/signup">Signup</Link>}{" "}
        {user && <Link to="/profile">Profile</Link>}
      </nav>

      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/profile" /> : <Login />}
        />

        <Route
          path="/signup"
          element={user ? <Navigate to="/profile" /> : <Signup />}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/profile" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ padding: 40 }}>
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
