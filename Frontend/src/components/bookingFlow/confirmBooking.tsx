import "./bookingFlow.css";
import StepBar from "./stepBar";

interface ConfirmBooking {
  user: { firstName: string; lastName: string; email: string; isAdmin: boolean } | null;
  selectedResource: string,
  selectedDate: Date;
  onReturn: () => void;
}

const ConfirmBooking = ({onReturn, selectedResource, selectedDate, user} : ConfirmBooking) => {
  
  
  // Logic to send user back one step in bookingFlow
  const returnBtn = () => {
    onReturn();
    console.log("bokat på", user);
  };

  return (
    <div className="mainContentConfirmBooking">
      <StepBar currentStep={3} />
      <div className="confirmBooking">
        <h1 className="componentHeader">Bekräfta bokning</h1>
        <div className="bookingInfo">
          <p>Bokningen avser: <b> {selectedResource}</b></p>
          <p>Datum för bokning: <b> {selectedDate.toLocaleDateString()}</b></p>
           <p>
            Bokat på:{" "}
            <b> {user ? `${user.firstName} ${user.lastName}` : "Okänd användare"} </b>
         </p>
        </div>
        <button className="continueBtn">Bekräfta</button>
        <button className="goBackBtn" onClick={returnBtn}>Tillbaka</button>
      </div>
    </div>
  );
};

export default ConfirmBooking;
