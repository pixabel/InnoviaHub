import "./stepBar.css";

// Define type for props for component to recieve
type StepProps = {
    currentStep: number;
}

// Shows current step in booking
const StepBar = ({currentStep}: StepProps) => {
    // Creates an array of the steps
    const steps = [1, 2, 3];
    // Text under each step
    const labels =  ["Välj resurs", "Välj tid", "Bekräfta"]

   return (
    <div className="stepBarContainer">
      {steps.map((step, index) => (
        <div key={index} className="stepWrapper">
          {/* Circle */}
          <div className={`stepCircle ${currentStep >= step ? "active" : ""}`}>
            {step}
          </div>
          {/* Label */}
          <div className="stepLabel">{labels[index]}</div>
          {/* Line (wont render after last circle) */}
          {index < steps.length - 1 && (
            <div className={`stepLine ${currentStep > step ? "active" : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepBar;