import "./bookingFlow.css";
import StepBar from "./stepBar";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../src/config";
import RecommendationBox from "./recommendationBox";
import LoadingSpinner from "../loading/loadingComponent";

export type Resource = {
  id: number;
  resourceName: string;
};

type ChooseResourceProps = {
  selectedResourceId: number | null;
  setSelectedResourceId: (id: number | null) => void;
  setSelectedResourceName: (name: string) => void;
  onContinue: () => void;
};

const ChooseResource = ({
  selectedResourceId,
  setSelectedResourceId,
  setSelectedResourceName,
  onContinue,
}: ChooseResourceProps) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<any | null>(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState<boolean>(false);

  // Get current user
  function getCurrentUserId(): string | null {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    try {
      const user = JSON.parse(storedUser);
      return user?.id ?? null;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    fetch(`${BASE_URL}Resource`)
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte hämta resurser för tillfället");
        return res.json();
      })
      .then((data: any[]) => {
        const mapped = data.map((r) => ({
          id: r.resourceId ?? r.id,
          resourceName: r.resourceName ?? r.name ?? "",
        }));
        const collator = new Intl.Collator("sv", { numeric: true, sensitivity: "base" });
        const sorted = mapped.sort((a, b) => collator.compare(a.resourceName, b.resourceName));
        setResources(sorted);
      })
      .catch((err) => setError(err.message));
  }, []);

  // Function for fetching recommendation, can be called multiple times!
  const fetchRecommendation = () => {
    const userId = getCurrentUserId();
    if (!userId) {
      console.warn("Ingen användare inloggad, hoppar över rekommendation.");
      return;
    }

    setLoadingRecommendation(true);

    // Fetch booking history
    fetch(`${BASE_URL}Booking/user/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Kunde inte hämta bokningshistorik");
        return res.json();
      })
      .then(historyData => {
        // Map history to resource names if needed
        interface BookingHistoryItem {
          resourceId: number;
          resourceName?: string;
          startTime?: string;
          endTime?: string;
        }

        interface MappedHistoryItem {
          resource: string;
          date: string;
          time: string;
        }

        const mappedHistory: MappedHistoryItem[] = (historyData as BookingHistoryItem[]).map((b) => ({
          resource: b.resourceName ?? `Resource ${b.resourceId}`,
          date: b.startTime ? b.startTime.split('T')[0] : "",
          time:
            b.startTime && b.endTime
              ? `${b.startTime.split('T')[1]?.slice(0, 5)} - ${b.endTime.split('T')[1]?.slice(0, 5)}`
              : "",
        }));

        // fetch recommendation with historyData
        fetch(`${BASE_URL}Recommendation/suggest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mappedHistory)
        })
          .then(res => {
            if (!res.ok) throw new Error("Kunde inte hämta rekommendation");
            return res.json();
          })
          .then(data => {
            setRecommendation(data.recommendation);
            setLoadingRecommendation(false);
            // Debug output!
            console.log("Recommendation from backend:", data.recommendation);
          })
          .catch(err => {
            setLoadingRecommendation(false);
            setRecommendation(null);
            console.error("Recommendation fetch error:", err.message);
          });
      })
      .catch(err => {
        setLoadingRecommendation(false);
        setRecommendation(null);
        console.error("History fetch error:", err.message);
      });
  };

  useEffect(() => {
    fetchRecommendation();
  }, []);

  // Group resources
  const groups = [
    { label: "Skrivbord", resources: resources.filter(r => r.resourceName.toLowerCase().includes("skrivbord")) },
    { label: "Mötesrum", resources: resources.filter(r => r.resourceName.toLowerCase().includes("mötesrum")) },
    { label: "Övrigt", resources: resources.filter(r => !r.resourceName.toLowerCase().includes("skrivbord") && !r.resourceName.toLowerCase().includes("mötesrum")) },
  ];

  return (
    <div className="mainContentChooseResource">
      <StepBar currentStep={1} />
      {loadingRecommendation && (
        <div style={{ textAlign: "center", margin: "2em" }}>
          <LoadingSpinner />
          <p>AI rekommendation hämtas...</p>
        </div>
      )}
      {/* Show recommendation if available and not loading */}
      {!loadingRecommendation && recommendation && (
        <RecommendationBox
          resource={recommendation.resource}
          date={recommendation.date}
          time={recommendation.time}
          message={recommendation.message}
          resources={resources}
          setSelectedResourceId={setSelectedResourceId}
          setSelectedResourceName={setSelectedResourceName}
          onDismiss={fetchRecommendation} // trigger new recommendation fetch
        />
      )}
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
          {groups.map(group => (
            <optgroup key={group.label} label={group.label}>
              {group.resources
                .map(res => (
                  <option key={res.id} value={res.id}>
                    {res.resourceName}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>

        {error && <p style={{ color: "red", marginTop: "0.5em" }}>{error}</p>}
        <button className="continueBtn" onClick={onContinue}>
          Fortsätt
        </button>
      </div>
    </div>
  );
};

export default ChooseResource;