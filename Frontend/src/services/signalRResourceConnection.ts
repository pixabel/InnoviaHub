// import * as signalR from "@microsoft/signalr";
// import { BASE_URL } from "../config";

// const resourceHubUrl = BASE_URL.replace("api", "resourcehub");
// const resourceConnection = new signalR.HubConnectionBuilder()
//   .withUrl(resourceHubUrl)
//   .withAutomaticReconnect()
//   .build();

// export default resourceConnection;
import * as signalR from "@microsoft/signalr";
import { BASE_URL } from "../config";

const resourceHubUrl = BASE_URL.replace("/api/", "/resourcehub").replace(/\/$/, "");
console.log("----🔌 Resource SignalR (forced) connecting to:------", resourceHubUrl);

const resourceConnection = new signalR.HubConnectionBuilder()
  .withUrl(resourceHubUrl, {
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets,
    accessTokenFactory: () => localStorage.getItem("token") || ""
  })
  .withAutomaticReconnect()
  .build();

resourceConnection.onreconnecting((err) => console.warn("Resource SignalR reconnecting", err));
resourceConnection.onreconnected((id) => console.log("Resource SignalR reconnected", id));
resourceConnection.onclose((err) => console.warn("Resource SignalR closed", err));

export default resourceConnection;