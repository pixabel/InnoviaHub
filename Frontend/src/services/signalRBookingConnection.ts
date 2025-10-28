// import * as signalR from "@microsoft/signalr";
// import { BASE_URL } from "../config";

// // Replace /api to /bookinghub
// const hubUrl = BASE_URL.replace("api", "bookinghub");

// console.log("----🔌 SignalR ansluter till:------", hubUrl);

// const connection = new signalR.HubConnectionBuilder()
//   .withUrl(hubUrl)
//   .withAutomaticReconnect()
//   .build();

// export default connection;
import * as signalR from "@microsoft/signalr";
import { BASE_URL } from "../config";

// Build hubUrl from BASE_URL to avoid hardcoded deployed host
const hubUrl = BASE_URL.replace("/api/", "/bookinghub").replace(/\/$/, "");
console.log("----🔌 SignalR (forced) connecting to:------", hubUrl);

// Force WebSockets and skip negotiation so the client cannot be redirected by a negotiate response.
// Also provide accessTokenFactory so the token is sent in the connect.
const connection = new signalR.HubConnectionBuilder()
  .withUrl(hubUrl, {
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets,
    accessTokenFactory: () => localStorage.getItem("token") || ""
  })
  .withAutomaticReconnect()
  .build();

connection.onreconnecting((err) => console.warn("SignalR reconnecting", err));
connection.onreconnected((id) => console.log("SignalR reconnected", id));
connection.onclose((err) => console.warn("SignalR closed", err));

export default connection;