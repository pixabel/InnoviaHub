import React from "react";
import "./IoTDeviceList.css";

interface SorryPageProps {
  onRetry?: () => void;
  message?: string;
}

const SorryPage: React.FC<SorryPageProps> = ({ onRetry, message }) => {
  return (
    <div className="sorry-page">
      <div className="sorry-card">
        <h2>Sensorer otillgängliga</h2>
        <p>
          Tyvärr går det inte att hämta sensordata just nu — sensortjänsten är inte
          distribuerad för detta projekt eller är otillgänglig.
        </p>
        {message && <p className="sorry-detail">{message}</p>}
        <div className="sorry-actions">
          {onRetry && (
            <button className="btn-retry" onClick={onRetry}>
              Försök igen
            </button>
          )}
          <button
            className="btn-close"
            onClick={() => {
              if (!onRetry) window.location.reload();
            }}
          >
            Stäng / Uppdatera sidan
          </button>
        </div>
      </div>
    </div>
  );
};

export default SorryPage;