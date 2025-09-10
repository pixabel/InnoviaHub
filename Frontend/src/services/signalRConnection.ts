import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5271/bookinghub")
    .withAutomaticReconnect()
    .build();

export default connection;
