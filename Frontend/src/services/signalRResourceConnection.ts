import * as signalR from "@microsoft/signalr";
import { BASE_URL } from "../config";

const resourceHubUrl = BASE_URL.replace("api", "resourcehub");
const resourceConnection = new signalR.HubConnectionBuilder()
  .withUrl(resourceHubUrl)
  .withAutomaticReconnect()
  .build();

export default resourceConnection;