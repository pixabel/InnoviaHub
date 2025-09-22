import * as signalR from "@microsoft/signalr";

// Replace /api to /bookinghub
const hubUrl = "https://backend20250901141037.azurewebsites.net/bookinghub";

const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${hubUrl}`)
    .withAutomaticReconnect()
    .build();

export default connection;
