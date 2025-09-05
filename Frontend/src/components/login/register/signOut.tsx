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
      <button
        style={{
          backgroundColor: "#d5718c",
          color: "white",
          padding: "0.8em",
          border: "#d5718c",
          borderRadius: "0.5em",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "0.8em"
        }}
        onClick={handleSignOut}
      >
        Logga ut
      </button>
    </div>
  );
};

export default SignOutBtn;
