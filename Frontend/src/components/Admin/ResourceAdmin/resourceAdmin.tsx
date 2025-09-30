import { useEffect, useState } from "react";
import "./resourceAdmin.css";
import { BASE_URL } from "../../../config";
import LoadingSpinner from "../../loading/loadingComponent";
import useResourceSignalr from "../../../hooks/useResourceSignalR";
import type { ResourceUpdate } from "../../../hooks/useResourceSignalR";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type BookingType = "Desk" | "VRHeadset" | "MeetingRoom" | "AIServer";

interface Resource {
  resourceId: number;
  resourceName: string;
  resourceType: number;
  capacity: number;
}

const resourceTypes: { key: BookingType; label: string }[] = [
  { key: "Desk", label: "Skrivbord" },
  { key: "VRHeadset", label: "VR-Headset" },
  { key: "MeetingRoom", label: "Mötesrum" },
  { key: "AIServer", label: "AI-Server" },
];

const enumNumberToKey: Record<number, BookingType> = {
  0: "MeetingRoom",
  1: "Desk",
  2: "VRHeadset",
  3: "AIServer",
};

const enumNumberToLabel: Record<number, string> = {
  0: "Mötesrum",
  1: "Skrivbord",
  2: "VR-Headset",
  3: "AI-Server",
};

const enumMap: Record<BookingType, number> = {
  Desk: 1,
  VRHeadset: 2,
  MeetingRoom: 0,
  AIServer: 3,
};

export default function ResourceAdmin() {
  const [selectedType, setSelectedType] = useState<BookingType>("Desk");
  const [selectedTypeForAdd, setSelectedTypeForAdd] = useState<BookingType>("Desk");
  const [resources, setResources] = useState<Resource[]>([]);
  const [newResource, setNewResource] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteResourceId, setDeleteResourceId] = useState<number | null>(null);

  useEffect(() => {
    loadResources();
  }, []);

  useResourceSignalr((update: ResourceUpdate) => {
    if (update.updateType === "Deleted") {
      toast.info(`Resurs borttagen: ${update.resourceName}`);
      loadResources();
    } else if (update.updateType === "Added") {
      toast.success(`Resurs tillagd: ${update.resourceName}`);
      loadResources();
    } else if (update.updateType === "Updated") {
      toast.info(`Resurs uppdaterad: ${update.resourceName}`);
      loadResources();
    }
  }, "ResourceAdmin");

  async function loadResources() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}AdminResource`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data: Resource[] = await res.json();
      setResources(data);
    } catch {
      toast.error("Kunde inte ladda resurser.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!newResource.trim() || selectedTypeForAdd === undefined || capacity < 1) return;
    setActionLoading(true);
    const body = {
      resourceId: 0,
      resourceName: newResource,
      resourceType: enumMap[selectedTypeForAdd],
      capacity,
      timeslots: [],
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}AdminResource`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.error("Kunde inte lägga till resurs: " + errorText);
        return;
      }
      setNewResource("");
      setCapacity(1);
      toast.success("Resurs tillagd!");
      loadResources();
    } catch {
      toast.error("Kunde inte lägga till resurs, nätverksfel?");
    } finally {
      setActionLoading(false);
    }
  }

  function confirmDelete(id: number) {
    setDeleteResourceId(id);
    setShowDeleteModal(true);
  }

  async function handleDeleteConfirmed() {
    if (deleteResourceId == null) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}AdminResource/${deleteResourceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        toast.error("Kunde inte ta bort resurs: " + errorText);
        return;
      }
      toast.info("Resurs borttagen.");
      loadResources();
    } catch {
      toast.error("Kunde inte ta bort resurs, nätverksfel?");
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
      setDeleteResourceId(null);
    }
  }

  // Sort and filter resources
  const extractNumber = (name: string): number => {
    const match = name.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const filteredResources = resources
    .filter((res) => enumNumberToKey[res.resourceType] === selectedType)
    .sort((a, b) => {
      const nameA = a.resourceName.toLowerCase();
      const nameB = b.resourceName.toLowerCase();
      const numA = extractNumber(nameA);
      const numB = extractNumber(nameB);
      if (numA && numB) return numA - numB;
      return nameA.localeCompare(nameB);
    });

  return (
    <div className="resource-admin">
      <h2>Resurshantering</h2>

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      {/* View filter buttons */}
      <div className="type-buttons" role="tablist">
        {resourceTypes.map((type) => (
          <button
            key={type.key}
            aria-label={`Visa ${type.label}`}
            className={`type-button ${selectedType === type.key ? "active" : ""}`}
            onClick={() => setSelectedType(type.key)}
            disabled={actionLoading}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Add new resource */}
      <div className="add-resource-card">
        <h3>Lägg till resurs</h3>
        <label>
          Namn:
          <input
            type="text"
            placeholder="Namn på resurs"
            value={newResource}
            onChange={(e) => setNewResource(e.target.value)}
            disabled={actionLoading}
            aria-label="Namn på resurs"
          />
        </label>
        <label>
          Typ:
          <select
            value={selectedTypeForAdd}
            onChange={(e) => setSelectedTypeForAdd(e.target.value as BookingType)}
            disabled={actionLoading}
            aria-label="Typ av resurs"
          >
            {resourceTypes.map((type) => (
              <option key={type.key} value={type.key}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Kapacitet:
          <input
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            disabled={actionLoading}
            aria-label="Kapacitet"
          />
        </label>
        <button onClick={handleAdd} disabled={actionLoading || !newResource.trim()}>
          ➕ Lägg till
        </button>
        {actionLoading && <LoadingSpinner />}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="loadingContainerResources">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="resource-grid">
          {filteredResources.length === 0 ? (
            <div className="empty-message">
              <p>Inga resurser av denna typ.</p>
            </div>
          ) : (
            filteredResources.map((res) => (
              <div key={res.resourceId} className="resource-card">
                <h3>{res.resourceName}</h3>
                <p>Typ: {enumNumberToLabel[res.resourceType]}</p>
                <p>Kapacitet: {res.capacity}</p>
                <div className="actions">
                  <button
                    className="delete"
                    aria-label={`Ta bort ${res.resourceName}`}
                    onClick={() => confirmDelete(res.resourceId)}
                    disabled={actionLoading}
                  >
                    🗑️ Ta bort
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Är du säker på att du vill ta bort resursen?</p>
            <button onClick={handleDeleteConfirmed} disabled={actionLoading}>Ja, ta bort</button>
            <button onClick={() => setShowDeleteModal(false)} disabled={actionLoading}>Avbryt</button>
          </div>
        </div>
      )}
    </div>
  );
}