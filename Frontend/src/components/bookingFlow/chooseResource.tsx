import "./bookingFlow.css";
import StepBar from "./stepBar";
import { useEffect, useState } from "react";

// Type for resource
type Resource = {
  id: number;
  resourceName: string;
};

// Props from bookReource
interface ChooseResourceProps {
  selectedResource: string;
  setSelectedResource: (id: string) => void;
  onContinue: () => void;
}

const ChooseResource = ({ selectedResource, setSelectedResource, onContinue }: ChooseResourceProps) => {
  // State for all fetched resources
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Logic to send user to next step in bookingFlow
  const continueBookingBtn = () => {
    if (!selectedResource) {
      setError("Välj en resurs innan du fortsätter");
      return;
    }
    setError(null);
    onContinue();
  };

  useEffect(() => {
    // Fetch resources when component mounts
    fetch("http://localhost:5271/api/Resource")
      .then(res => {
        if (!res.ok) throw new Error("Kunde inte hämta resurser för tillfället");
        return res.json();
      })
      .then(data => setResources(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className="mainContentChooseResource">
      <StepBar currentStep={1} />
      <div className="chooseResource">
        <h1 className="componentHeader">Välj resurs</h1>
        <select
          value={selectedResource}
          onChange={(e) => setSelectedResource(e.target.value)}
        >
          <option value="">-- Välj en resurs --</option>
          {resources.map(res => (
            <option key={res.id} value={res.id}>
              {res.resourceName}
            </option>
          ))}
        </select>
        {error && <p style={{ color: "red", marginTop: "0.5em" }}>{error}</p>}
        <button className="continueBtn" onClick={continueBookingBtn}>
          Fortsätt
        </button>
      </div>
    </div>
  );
};

export default ChooseResource;
