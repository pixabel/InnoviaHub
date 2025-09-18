import { useEffect, useState } from "react";
import "./resourceAdmin.css";
import { BASE_URL } from "../../../config";

type BookingType = "Desk" | "VRHeadset" | "MeetingRoom" | "AIServer";

interface Resource {
  resourceId: number;
  resourceName: string;
  resourceType: number; // enum som nummer från backend
  capacity: number;
}

// Lista för <select> och vy-knappar
const resourceTypes: { key: BookingType; label: string }[] = [
  { key: "Desk", label: "Skrivbord" },
  { key: "VRHeadset", label: "VR-Headset" },
  { key: "MeetingRoom", label: "Mötesrum" },
  { key: "AIServer", label: "AI-Server" },
];

// Mappa backend enum-nummer → key (BookingType string)
const enumNumberToKey: Record<number, BookingType> = {
  0: "MeetingRoom",  // exempel: backend enum = 0 för MeetingRoom
  1: "Desk",
  2: "VRHeadset",
  3: "AIServer",
};

// Mappa backend enum-nummer → label
const enumNumberToLabel: Record<number, string> = {
  0: "Mötesrum",
  1: "Skrivbord",
  2: "VR-Headset",
  3: "AI-Server",
};

// Mappa BookingType string → enum-nummer för POST
const enumMap: Record<BookingType, number> = {
  Desk: 1,
  VRHeadset: 2,
  MeetingRoom: 0,
  AIServer: 3,
};



export default function ResourceAdmin() {
  const [selectedType, setSelectedType] = useState<BookingType>("Desk"); // vy
  const [selectedTypeForAdd, setSelectedTypeForAdd] = useState<BookingType>("Desk"); // lägg-till
  const [resources, setResources] = useState<Resource[]>([]);
  const [newResource, setNewResource] = useState("");

  useEffect(() => {
    loadResources();
  }, []);

  async function loadResources() {
    try {
      const res = await fetch(`${BASE_URL}/AdminResource`);
      const data: Resource[] = await res.json();
      setResources(data);
    } catch (error) {
      console.error("Kunde inte ladda resurser:", error);
    }
  }

  async function handleAdd() {
    if (!newResource.trim() || selectedTypeForAdd === undefined) return;

    const body = {
      resourceId: 0,
      resourceName: newResource,
      resourceType: enumMap[selectedTypeForAdd], // nummer
      capacity: 1,
      timeslots: [],
    };

    try {
      const response = await fetch(`${BASE_URL}/AdminResource`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error adding resource:", errorText);
        alert("Kunde inte lägga till resurs: " + errorText);
        return;
      }

      setNewResource("");
      loadResources();
    } catch (error) {
      console.error("Fetch failed:", error);
      alert("Kunde inte lägga till resurs, nätverksfel?");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Är du säker på att du vill ta bort resursen?")) return;
    try {
      await fetch(`${BASE_URL}/AdminResource/${id}`, { method: "DELETE" });
      loadResources();
    } catch (error) {
      console.error("Kunde inte ta bort resurs:", error);
      alert("Kunde inte ta bort resurs, nätverksfel?");
    }
  }

  // Filtrera resurser för den valda vy-knappen
  const filteredResources = resources.filter(
    (res) => enumNumberToKey[res.resourceType] === selectedType
  );

  return (
    <div className="resource-admin">
      <h2>Resurshantering</h2>

      {/* Vy-knappar */}
      <div className="type-buttons">
        {resourceTypes.map((type) => (
          <button
            key={type.key}
            className={`type-button ${selectedType === type.key ? "active" : ""}`}
            onClick={() => setSelectedType(type.key)}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Lägg till resurs */}
      <div className="add-resource">
        <input
          type="text"
          placeholder="Namn på resurs"
          value={newResource}
          onChange={(e) => setNewResource(e.target.value)}
        />

        <select
          value={selectedTypeForAdd}
          onChange={(e) => setSelectedTypeForAdd(e.target.value as BookingType)}
        >
          {resourceTypes.map((type) => (
            <option key={type.key} value={type.key}>
              {type.label}
            </option>
          ))}
        </select>

        <button onClick={handleAdd}>➕ Lägg till</button>
      </div>

      {/* Lista över resurser */}
      <div className="resource-grid">
        {filteredResources.map((res) => (
          <div key={res.resourceId} className="resource-card">
            <h3>{res.resourceName}</h3>
            <p>Typ: {enumNumberToLabel[res.resourceType]}</p>
            <p>Status: (kapacitet: {res.capacity})</p>
            <div className="actions">
              <button className="delete" onClick={() => handleDelete(res.resourceId)}>
                🗑️ Ta bort
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}