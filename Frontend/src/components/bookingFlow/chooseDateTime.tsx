import "./bookingFlow.css";
import StepBar from "./stepBar";

// Same props as for chooseResource
interface ChooseResourceProps {
    selectedResource: string;
    setSelectedResource: (id: string) => void;
    onContinue: () => void;
}

const ChooseDateTime = ({selectedResource, onContinue} : ChooseResourceProps) => {
    // Logic to send user to next step in bookingFlow
  const continueBookingBtn = () => {
    if (!selectedResource) return;
    onContinue();
  };
  return (
    <div className="mainContentChooseDateTime">
        <StepBar currentStep={2} />
        <div className="chooseDateTime">
            <h1 className="componentHeader">Välj tid för {selectedResource}:</h1>
            {/* Later, this is where a list of available times will be listed */}
         <button className="continueBtn" onClick={continueBookingBtn}>
          Fortsätt
        </button>
        </div>
    </div>
  );
};

export default ChooseDateTime;
