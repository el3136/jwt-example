import { useContext } from "react";
import AuthProvider from "./context/AuthProvider";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function AppContent() {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: 40 }}>
      <h1>JWT Demo</h1>
      {!user ? <Login /> : <Profile />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}