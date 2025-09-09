import { useNavigate } from "react-router-dom";

const SignOutBtn = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Trigger custom event to update navbar
    window.dispatchEvent(new Event("userUpdated"));

    navigate("/");
  };
  return (
    <div>
      <button className="logoutBtn" onClick={handleSignOut}>
        <i className="fa-solid fa-right-from-bracket"></i>
      </button>
    </div>
  );
};

export default SignOutBtn;
