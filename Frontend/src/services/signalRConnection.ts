import * as signalR from "@microsoft/signalr";
import { BASE_URL } from "../config";

// Replace /api to /bookinghub
const hubUrl = BASE_URL.replace(/\/api$/, "") + "/bookinghub";

const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${hubUrl}`)
    .withAutomaticReconnect()
    .build();

export default connection;
