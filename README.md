# InnoviaHub — V2

## Live Demo

[![Live demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://innoviahub-8him5.ondigitalocean.app/)

---

## Summary

InnoviaHub is a office resource booking and management application with real‑time updates (SignalR) and AI-powered booking recommendations (OpenAI). It supports role-based access, admin management, and optional IoT sensor telemetry.

This README explains:

- How the system works at a glance
- How to run and test it locally
- Where the main code lives

---

## Table of contents

1. [Demo & Test Accounts](#demo--test-accounts)  
2. [High-level system overview](#high-level-system-overview)  
3. [Tech stack](#tech-stack)  
4. [Run locally (quick start)](#run-locally-quick-start)  
5. [Environment variables (summary)](#environment-variables-summary--where-to-set)  
6. [Where to look in the codebase](#where-to-look-in-the-codebase-quick-map)  
7. [Notes for reviewers / customer](#notes-for-reviewers--customer)

---

## Demo & Test Accounts

- Live site (frontend + backend):  
  [![Live demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://innoviahub-8him5.ondigitalocean.app/)

- Test user (for reviewers & demo):
  - Email: `user@test.com`  
  - Password: `Test123!`

- Admin account credentials will be sent to the course instructor privately.

> Tip: for demos, log in with the test user to exercise the normal user flow. Use the admin account only for management tasks.

---

## High-level system overview

- Backend: ASP.NET Core Web API (C#) — handles authentication, bookings, recommendations, and SignalR hubs.  
- Frontend: React + TypeScript — user interface, SignalR client, IoT sensor pages and booking flows.  
- Realtime: SignalR hubs for booking events and IoT telemetry.  
- AI: OpenAI chat completions used to generate booking recommendations.  
- Database: Azure SQL (Entity Framework Core).  
- Deployment: Backend runs on Azure App Service; frontend accessible on DigitalOcean (demo).

---

## Tech stack

- Backend
  - .NET 9 / ASP.NET Core Web API
  - Entity Framework Core (SQL Server)
  - SignalR (Realtime)
  - Swashbuckle/Swagger (enabled only in Development)
- Frontend
  - React + TypeScript
  - CSS modules / plain CSS for styles
  - SignalR JavaScript client
- Dev / Infrastructure
  - Azure App Service (Linux) for backend hosting
  - DigitalOcean for demo hosting
  - Azure CLI for operational tasks

---

## Final deployed changes

- Fixed a critical startup crash by enabling Swagger only in Development.
- Added robust OpenAI recommendation integration with multiple config fallbacks and graceful error handling.
- Improved SignalR authentication (JWT over query string for negotiate) and CORS readiness for WebSockets.
- Implemented an IoT "sensors unavailable" friendly page so the app works even without the sensor API.
- Added operational guidance & Azure CLI commands for enabling websockets, setting config and tailing logs.

---

## Run locally (quick start)

Prerequisites:

- .NET SDK (matching project target, recommended 9.0)
- Node.js and npm
- SQL Server (local, Docker, or Azure SQL)
- Optional: an OpenAI API key for recommendations

Steps (minimal):

1. Clone and switch to V2

```bash
git clone https://github.com/pixabel/InnoviaHub.git
cd InnoviaHub
git checkout V2
```

2. Backend: set environment variables (example, macOS/Linux)

Generate a strong JWT secret (256 bits / 32 bytes) and keep it secret. You can generate one with OpenSSL, Node.js or PowerShell:

- macOS / Linux (OpenSSL)

```bash
openssl rand -hex 32
# Example output: 9f2c... (64 hex characters)
```

Store the generated hex string securely and set it as the `JWT_SECRET` environment variable before starting the app:

macOS / Linux example:

```bash
export JWT_SECRET="paste_the_hex_value_here"
export AZURE_SQL_CONNECTIONSTRING="Server=InnoviaHub;Initial Catalog=InnoviaHub;User ID=sqladmin;Password=ServerTest123!;"
export OpenAI__ApiKey="REDACTED-replace-with-your-apikey"
```

> Security note: never commit secrets to source control. For production, store secrets securely (Azure App Service settings, Azure Key Vault, or similar) and use Managed Identity where possible.

3. Start backend

```bash
cd Backend
dotnet restore
dotnet run
```

4. Frontend

```bash
cd Frontend
npm install
npm start
```

---

## Environment variables (summary / where to set)

Backend (important):

- `AZURE_SQL_CONNECTIONSTRING` — SQL Server connection string (e.g. Azure SQL)
- `JWT_SECRET` — string used to sign JWTs
- `OpenAI:ApiKey` — OpenAI key. In Azure App Service, set `OpenAI__ApiKey`. (Also supported: `OPENAI_API_KEY` or `API_KEY` as fallbacks.)
- `FRONTEND_ORIGIN`, `FRONTEND_ALLOW_CREDENTIALS` — CORS config for frontend origin

---

## Where to look in the codebase (quick map)

- Backend entry: `Backend/Program.cs`
- DB context & seeding: `Backend/Data/InnoviaHubDB.cs`, `Backend/Data/TimeslotsSeeder.cs`
- Recommendation service: `Backend/Services/OpenAIRecommendationService.cs`
- SignalR hubs: `Backend/Hubs/BookingHub.cs`, `Backend/Hubs/ResourceHub.cs`
- Frontend IoT components: `Frontend/src/components/IoT/IotDeviceList.tsx`, `SorryPage.tsx`
- Frontend entry: `Frontend/src/index.tsx`

---

## Notes for reviewers / customer

- Admin credentials are not published for security reasons — they were sent to the course instructor.  

---
