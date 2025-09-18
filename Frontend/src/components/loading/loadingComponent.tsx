import "./loadingStyle.css";

interface LoadingSpinnerProps {
  variant?: "startPage" | "myBookings";
}

const LoadingSpinner = ({ variant }: LoadingSpinnerProps) => {
  return (
    <div className={`loader-wrapper ${variant || ""}`}>
      <div className="loader"></div>
    </div>
  );
};

export default LoadingSpinner;
