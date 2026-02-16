import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <h2>Profile</h2>

      <pre>{JSON.stringify(user, null, 2)}</pre>

      <button onClick={() => {
        logout();
        navigate("/login");
      }}>
        Logout
      </button>
    </>
  );
}
