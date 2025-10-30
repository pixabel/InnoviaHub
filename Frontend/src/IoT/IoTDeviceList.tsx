import React, { useEffect, useState, useCallback } from "react";
import "./IoTDeviceList.css";
import { useIoTSignalR } from "./useIoTSignalR";
import SorryPage from "./IoTSorry";

// Types
interface Device {
  id: string;
  serial: string;
  model: string;
  status: string;
  location?: string;
  description?: string;
}

interface Measurement {
  time: string;
  value: number;
  type: string;
  unit?: string;
}

interface Alert {
  tenantId: string;
  deviceId: string;
  type: string;
  value: number;
  time: string;
  ruleId: string;
  severity: string;
  message: string;
}

const TENANT_GUID = "ffdc3cc6-4bb5-41cc-a403-80cc927c43ab";
const TENANT_SLUG = "innovia";
const MAX_MEASUREMENTS_DISPLAY = 20;

const measurementTypeLabels: Record<string, string> = {
  temperature: "Temperatur",
  co2: "CO₂",
};

const measurementTypeUnits: Record<string, string> = {
  temperature: "°C",
  co2: "ppm",
};

const IoTDeviceList: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [measurements, setMeasurements] = useState<Record<string, Measurement[]>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loadingMeasurements, setLoadingMeasurements] = useState<Record<string, boolean>>({});
  const [measurementTypeFilter, setMeasurementTypeFilter] = useState<"all" | "temperature" | "co2">("all");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  // Fetch devices (callable for retry)
  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setApiUnavailable(false);
    try {
      const res = await fetch(
        `http://localhost:5101/api/tenants/${TENANT_GUID}/devices`
      );
      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }
      const data = await res.json();
      setDevices(data);
    } catch (error) {
      console.error("Error fetching devices:", error);
      // mark API unavailable so we can show the sorry page
      setDevices([]);
      setApiUnavailable(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Fetch measurements for a device by id (GUID)
  const fetchMeasurements = async (deviceId: string) => {
    setLoadingMeasurements(prev => ({ ...prev, [deviceId]: true }));
    const to = new Date();
    const from = new Date(to.getTime() - 60 * 60 * 1000);
    const url = `http://localhost:5104/portal/${TENANT_GUID}/devices/${deviceId}/measurements?from=${from.toISOString()}&to=${to.toISOString()}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Measurements API returned ${res.status}`);
      }
      const data = await res.json();
      setMeasurements(prev => {
        const existing = prev[deviceId] || [];
        const all = [...data.measurements, ...existing];
        // Deduplicate by time+type+value
        const deduped = Array.from(
          new Map(all.map((m: Measurement) => [`${m.time}_${m.type}_${m.value}`, m])).values()
        );
        return { ...prev, [deviceId]: deduped };
      });
    } catch (error) {
      console.error("Error fetching measurements for", deviceId, error);
      setMeasurements(prev => ({ ...prev, [deviceId]: [] }));
    } finally {
      setLoadingMeasurements(prev => ({ ...prev, [deviceId]: false }));
    }
  };

  // Handle expand/collapse for devices
  const handleExpand = (device: Device) => {
    setExpanded(prev => ({ ...prev, [device.id]: !prev[device.id] }));
    if (!expanded[device.id]) fetchMeasurements(device.id);
  };

  // Real-time measurement handler
  const handleRealtimeMeasurement = useCallback(
    (m: {
      tenantSlug: string;
      deviceId: string;
      type: string;
      value: number;
      time: string;
      unit?: string;
    }) => {
      if (m.tenantSlug !== TENANT_SLUG) return;
      setMeasurements(prev => {
        const deviceId = m.deviceId;
        const measurementsForDevice = prev[deviceId] || [];
        // Deduplicate: skip if this measurement already exists
        const alreadyExists = measurementsForDevice.some(
          meas =>
            meas.time === m.time &&
            meas.type === m.type &&
            meas.value === m.value
        );
        if (alreadyExists) {
          return prev;
        }
        return {
          ...prev,
          [deviceId]: [
            {
              time: m.time,
              value: m.value,
              type: m.type,
              unit: m.unit || "",
            },
            ...measurementsForDevice,
          ],
        };
      });
    },
    []
  );

  // Real-time alert handler
  const handleAlertReceived = useCallback((alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
  }, []);

  useIoTSignalR(handleRealtimeMeasurement, TENANT_SLUG, handleAlertReceived);

  // Retry handler for SorryPage
  const handleRetry = () => {
    setApiUnavailable(false);
    fetchDevices();
  };

  if (loading) return <p className="loadingContainerDevices">Laddar sensorer...</p>;

  // If API is unavailable, show the SorryPage
  if (apiUnavailable) {
    return (
      <SorryPage
        onRetry={handleRetry}
        message="Sensor-API:n är inte distribuerad för projektet. Du kan försöka igen eller fortsätta utan sensorer."
      />
    );
  }

  return (
    <div className="device-list">
      <h3>Sensorer</h3>
      {/* Alert List */}
      <div className="alert-list">
        {alerts.length > 0 && (
          alerts.slice(0, 5).map((a, i) => (
            <div key={i} className={`alert alert-${a.severity}`}>
              <b>
                {a.type === "temperature" ? "Temperatur" : "CO₂"} alert:
              </b>{" "}
              <span className="alert-message">{a.message}</span>
              <span className="alert-time">
                ({new Date(a.time).toLocaleString("sv-SE")})
              </span>
            </div>
          ))
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Enhets-ID</th>
            <th>Serienummer</th>
            <th>Modell</th>
            <th>Status</th>
            <th>Mätvärden</th>
          </tr>
        </thead>
        <tbody>
          {devices.map(device => {
            // Filter measurements for this device
            const filteredMeasurements =
              measurementTypeFilter === "all"
                ? (measurements[device.id] ?? [])
                : (measurements[device.id] ?? []).filter(
                    m => m.type === measurementTypeFilter
                  );

            // Get latest measurement
            const latestMeasurement = filteredMeasurements[0];

            return (
              <React.Fragment key={device.id}>
                <tr>
                  <td>{device.id}</td>
                  <td>{device.serial}</td>
                  <td>{device.model}</td>
                  <td>
                    <span className={`device-status-badge ${device.status}`}>
                      {device.status === "active" ? "🟢 Aktiv" : "🔴 Inaktiv"}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleExpand(device)}>
                      {expanded[device.id] ? "Stäng mätningar" : "Visa senaste mätningar"}
                    </button>
                  </td>
                </tr>
                {expanded[device.id] && (
                  <tr>
                    <td colSpan={5}>
                      <div className="device-card">
                        <div className="device-info-panel">
                          <div className="device-details">
                            <h5>Enhetsinformation</h5>
                            <ul>
                              <li>
                                <b>Serienummer:</b> {device.serial}
                              </li>
                              <li>
                                <b>Modell:</b> {device.model}
                              </li>
                              <li>
                                <b>Status:</b>{" "}
                                <span className={`device-status-badge ${device.status}`}>
                                  {device.status === "active" ? "🟢 Aktiv" : "🔴 Inaktiv"}
                                </span>
                              </li>
                              {device.location && (
                                <li>
                                  <b>Plats:</b> {device.location}
                                </li>
                              )}
                              {device.description && (
                                <li>
                                  <b>Beskrivning:</b> {device.description}
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                        <div className="device-measure-panel">
                          <h4>Mätvärden (senaste timmen)</h4>
                          <div className="filter-tabs">
                            <button
                              onClick={() => setMeasurementTypeFilter("all")}
                              className={`filter-tab${measurementTypeFilter === "all" ? " active" : ""}`}
                            >
                              Alla
                            </button>
                            <button
                              onClick={() => setMeasurementTypeFilter("temperature")}
                              className={`filter-tab${measurementTypeFilter === "temperature" ? " active" : ""}`}
                            >
                              Temperatur
                            </button>
                            <button
                              onClick={() => setMeasurementTypeFilter("co2")}
                              className={`filter-tab${measurementTypeFilter === "co2" ? " active" : ""}`}
                            >
                              CO₂
                            </button>
                          </div>
                          {/* Latest Measurement Card */}
                          {latestMeasurement && (
                            <div className="latest-measurement-card">
                              <span className="latest-type">
                                {measurementTypeLabels[latestMeasurement.type] || latestMeasurement.type}
                              </span>
                              <span className="latest-value">
                                {latestMeasurement.type === "temperature"
                                  ? latestMeasurement.value.toFixed(1)
                                  : latestMeasurement.value}{" "}
                                {measurementTypeUnits[latestMeasurement.type] || latestMeasurement.unit}
                              </span>
                              <span className="latest-time">
                                {new Date(latestMeasurement.time).toLocaleString("sv-SE")}
                              </span>
                            </div>
                          )}
                          {/* Measurement Table */}
                          {loadingMeasurements[device.id] ? (
                            <p>Laddar mätvärden...</p>
                          ) : filteredMeasurements.length ? (
                            <table className="measurement-table">
                              <thead>
                                <tr>
                                  <th style={{textAlign: "left"}}>Tid</th>
                                  <th style={{textAlign: "left"}}>Typ</th>
                                  <th style={{textAlign: "right"}}>Värde</th>
                                  <th style={{textAlign: "left"}}>Enhet</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredMeasurements
                                  .slice()              
                                  .reverse()            
                                  .slice(0, MAX_MEASUREMENTS_DISPLAY)
                                  .map((m, i) => (
                                    <tr
                                      key={i}
                                      className={i % 2 ? "even-row" : "odd-row"}
                                    >
                                      <td>{new Date(m.time).toLocaleString("sv-SE")}</td>
                                      <td>
                                        {measurementTypeLabels[m.type] || m.type.toUpperCase()}
                                      </td>
                                      <td style={{textAlign: "right"}}>
                                        {m.type === "temperature"
                                          ? `${m.value.toFixed(1)}`
                                          : m.value}
                                      </td>
                                      <td className="value-cell">
                                        {measurementTypeUnits[m.type] || m.unit || "ppm"}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="empty-message">
                              <span style={{fontSize: "2em"}}>📭</span> <br />
                              Inga mätvärden tillgängliga för denna enhet.
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default IoTDeviceList;