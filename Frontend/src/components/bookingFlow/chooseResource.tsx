import "./bookingFlow.css";
import StepBar from "./stepBar";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../src/config";

// Typ för resource — vi mappar API-svaret i useEffect så naming mismatch inte sabbar allt
type Resource = {
  id: number;
  resourceName: string;
};

interface ChooseResourceProps {
  selectedResourceId: number | null;
  setSelectedResourceId: (id: number | null) => void;
  selectedResourceName: string;
  setSelectedResourceName: (name: string) => void;
  onContinue: () => void;
}

const ChooseResource = ({
  selectedResourceId,
  setSelectedResourceId,
  setSelectedResourceName,
  onContinue,
}: ChooseResourceProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const continueBookingBtn = () => {
    if (!selectedResourceId) {
      setError("Välj en resurs innan du fortsätter");
      return;
    }
    setError(null);
    onContinue();
  };

  useEffect(() => {
    fetch(`${BASE_URL}Resource`)
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte hämta resurser för tillfället");
        return res.json();
      })
      .then((data: any[]) => {
        // Map response to { id, resourceName } to become more robust
        const mapped = data.map((r) => ({
          id: r.resourceId ?? r.id,
          resourceName: r.resourceName ?? r.name ?? r.resourceName ?? "",
        }));

      // Sort resources alphabetically with natural numeric ordering (e.g. Desk 2 before Desk 10)
      const collator = new Intl.Collator("sv", { numeric: true, sensitivity: "base" });
      const sorted = mapped.sort((a, b) => collator.compare(a.resourceName, b.resourceName));

      setResources(sorted);
    })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="mainContentChooseResource">
      <StepBar currentStep={1} />
      <div className="chooseResource">
        <h1 className="componentHeader">Välj resurs</h1>

        <select
          value={selectedResourceId ?? ""}
          onChange={(e) => {
            const id = Number(e.target.value);
            const resource = resources.find((r) => r.id === id);
            setSelectedResourceId(Number.isNaN(id) ? null : id);
            setSelectedResourceName(resource ? resource.resourceName : "");
          }}
        >
          <option value="">-- Välj en resurs --</option>
          {resources.map((res) => (
            <option key={res.id} value={String(res.id)}>
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
