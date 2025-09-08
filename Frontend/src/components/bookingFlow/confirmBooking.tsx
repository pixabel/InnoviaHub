import "./bookingFlow.css";
import StepBar from "./stepBar";

const ConfirmBooking = () => {
  return (
    <div className="mainContentConfirmBooking">
      <StepBar currentStep={3} />
      <div className="confirmBooking">
        <h1 className="componentHeader">Bekräfta bokning</h1>
        <h4>Ser allt rätt ut?</h4>
        <button className="continueBtn">Bekräfta</button>
      </div>
    </div>
  );
};

export default ConfirmBooking;
