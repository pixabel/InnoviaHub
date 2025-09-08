# InnoviaHub

InnoviaHub is a full-stack web application, built to streamline booking office resources and user managment.
Built with a React frontend and a .NET 9.0 backend, it offers secure authentication, JWT-based sessions, and API endpoints for managing users and various resources.

## Features

- **User Registration & Authentication**: Secure sign-up and login with JWT tokens.
- **Admin Controls**: Manage users and resources via dedicated admin endpoints.
- **Resource Booking**: Users can book and manage available office resources via the dashboard.
- **Responsive UI**: Built with React and styled with CSS modules.

## Tech Stack

### Backend

- ASP.NET Core
- SignalR
- Sensor API
- JWT Token

### Frontend

- React.js or Vue.js
- Fetch API

### Data Management

- Entity Framework Core
- SQL Server

### DevOps & Infrastructure

- GitHub
- Trello
- Azure / DigitalOcean
- Postman / Swagger

## Setup & Installation

### Prerequiusites

- [.NET SDK 9.0](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (Recommended: LTS version)
- [Yarn](https://yarnpkg.com/) or npm

### Backend Setup

1. **Clone the repository:**

```bash
git clone https://github.com/Dilemma98/InnoviaHub.git
cd InnoviaHub/Backend ``
```

2. **Restore Dependencies**

```bash
dotnet restore
```

3. **Build the project:**

```bash
dotnet build
```

4. **Run the application:**

```bash
dotnet run
```

The backend will be accessible at <http://localhost:5271>.

### Frontend Setup

1. **Navigate to the frontend directory:**

```bash
cd ../Frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the development server:**

```bash
npm run dev
```

The frontend will be accessible at <http://localhost:5173/>.

### API Documentation

Documentation of the API endpoints is avaiable at Swagger UI:

<http://localhost:5271/index.html>
