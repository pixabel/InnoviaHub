import "./bookingFlow.css";
import StepBar from "./stepBar";

interface ConfirmBooking {
  onReturn: () => void;
}

const ConfirmBooking = ({onReturn} : ConfirmBooking) => {
  
  
  // Logic to send user back one step in bookingFlow
  const returnBtn = () => {
    onReturn();
  };

  return (
    <div className="mainContentConfirmBooking">
      <StepBar currentStep={3} />
      <div className="confirmBooking">
        <h1 className="componentHeader">Bekräfta bokning</h1>
        <h4>Ser allt rätt ut?</h4>
        <button className="continueBtn">Bekräfta</button>
        <button className="goBackBtn" onClick={returnBtn}>Tillbaka</button>
      </div>
    </div>
  );
};

export default ConfirmBooking;
