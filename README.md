# FixFlow

**Property Maintenance and Service Request Management System**

IT6203 — IT Design Studio · Group 10

FixFlow is a web-based application for organizing the end-to-end process of reporting, managing, assigning, and tracking property maintenance issues. It gives property managers and maintenance teams a centralized system where service requests are tied to specific properties or locations and routed through to resolution.

The application is being built on the **MEAN stack** (MongoDB, Express.js, Angular, Node.js) and is designed to run locally for course development and demonstration purposes.

---

## Table of Contents

- [Team](#team)
- [Project Components](#project-components)
- [Third-Party API Integration](#third-party-api-integration)
- [Project Scope (CRUD)](#project-scope-crud)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [MongoDB Atlas Database Implementation](#mongodb-atlas-database-implementation)
- [Available Scripts](#available-scripts)
- [Branching & Development Workflow](#branching--development-workflow)
- [Project Status](#project-status)

---

## Team

| Name | Assigned Component |
|---|---|
| **John Ofem** | Property & Location Management |
| **Ayomide Akisanmi-Samuel** | Maintenance Request Management |
| **Mensah Emmanuel Kofi** | Work Assignment Management |

---

## Project Components

FixFlow consists of three primary components. Each component owns its own Create, Read, Update, and Delete (CRUD) functionality and is being developed as an end-to-end MEAN-stack feature.

### 1. Property & Location Management
*Primary Developer: John Ofem*

Maintains information about the properties and service locations managed through FixFlow. Users can create new property records (property name, address, property type, and other relevant location details), view and search existing properties, update their information, and delete records that are no longer needed.

Property records provide the location information consumed by the Maintenance Request Management component, allowing maintenance issues to be associated with the location where service is required.

### 2. Maintenance Request Management
*Primary Developer: Ayomide Akisanmi-Samuel*

Allows maintenance issues to be recorded and tracked within FixFlow. Users can create maintenance requests containing an issue title, description, maintenance category, property/location, priority, request date, and current status; view and search existing requests; update request details or status as circumstances change; and delete requests when appropriate.

Maintenance requests are associated with records from the Property & Location Management component and are subsequently used by the Work Assignment Management component.

### 3. Work Assignment Management
*Primary Developer: Mensah Emmanuel Kofi*

Manages the assignment of maintenance work for reported issues. Users can create work assignments connected to maintenance requests, recording the assigned technician or maintenance worker, scheduled date, work description, assignment status, and relevant notes. Existing assignments can be viewed, searched, updated, and deleted as work progresses.

Connecting work assignments to maintenance requests lets FixFlow represent the full process — from the initial reporting of an issue through the assignment and completion of maintenance work.

---

## Third-Party API Integration

**Google Maps Platform — Maps JavaScript API**
[developers.google.com/maps/documentation/javascript](https://developers.google.com/maps/documentation/javascript)

FixFlow integrates the Google Maps Platform to provide a visual representation of property and maintenance locations. Location data maintained through the Property & Location Management component is used to display relevant properties or service locations on a map, giving users geographic context for maintenance activity. This integration supplements — and does not replace — the CRUD functionality implemented within the three student-developed components.

---

## Project Scope (CRUD)

| | Property & Location Management | Maintenance Request Management | Work Assignment Management |
|---|---|---|---|
| **Create** | Create a new property or service-location record with relevant property and address information. | Create a new maintenance request containing issue, category, location, priority, date, and status information. | Create a work assignment associated with a maintenance request, including assignee, schedule, work details, and status. |
| **Read** | View, list, and search existing properties and their location details. | View, list, and search maintenance requests and their associated information. | View, list, and search existing work assignments and assignment details. |
| **Update** | Update existing property information, including address and other location details. | Update maintenance request information, including issue details, category, priority, location, or status. | Update assignment information, including assignee, scheduled date, work details, notes, or status. |
| **Delete** | Delete a property/location record when it is no longer required. | Delete a maintenance request when appropriate. | Delete a work assignment when appropriate. |

---

## Tech Stack

- **Frontend:** Angular 22 (standalone components, Reactive Forms, Angular Router, HttpClient)
- **Backend:** Node.js / Express.js
- **Database:** MongoDB Atlas (cloud-hosted) / Mongoose
- **Mapping:** Google Maps Platform — Maps JavaScript API *(planned for a later milestone)*
- **Testing:** Vitest (`ng test`)
- **Tooling:** Angular CLI, Prettier, Nodemon

> **Milestone 2 status:** All three components have MongoDB-backed REST APIs and list, search, add, edit, and delete screens. Maintenance requests select saved properties; work assignments select saved maintenance requests.

---

## Project Structure

```
FixFlow/
├── README.md
├── frontend/                          # Angular application
│   └── src/
│       ├── app/
│       │   ├── property-management/       # John Ofem
│       │   │   ├── property-management.ts/html/css   # Property list view
│       │   │   ├── property-form/                     # Add / edit property form
│       │   │   ├── property.ts                        # Property interface
│       │   │   └── property-api.ts                     # HttpClient service
│       │   ├── maintenance-requests/      # Ayomide Akisanmi-Samuel
│       │   ├── work-assignments/          # Mensah Emmanuel Kofi
│       │   ├── app.html / app.ts / app.css   # Shell: header, nav, router outlet
│       │   └── app.routes.ts                 # Application routes
│       └── styles.css                   # Shared global design system (colors, layout, forms, buttons)
└── server/                             # Express/MongoDB backend
    ├── models/                          # Mongoose schemas (e.g. property.js)
    ├── routes/                          # Express route handlers (e.g. properties.js)
    ├── server.js                        # App entry point (CORS, JSON parsing, Mongo connection)
    └── .env.example                     # Template for the MongoDB Atlas connection string (no real credentials)
```

Each component folder contains its own `.ts`, `.html`, and `.css` files. Shared, application-wide styling (colors, typography, form controls, buttons, page layout) lives in `frontend/src/styles.css`; styling specific to a single component stays in that component's own CSS file.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (bundled with Node.js)
- A MongoDB Atlas database user for this project's shared cluster (see [MongoDB Atlas Database Implementation](#mongodb-atlas-database-implementation) below). No local MongoDB installation is required — the application connects to a cloud-hosted Atlas cluster.

### Setup

```bash
# Clone the repository
git clone https://github.com/ayomide770/FixFlow.git
cd FixFlow/frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at **http://localhost:4200/**. It automatically reloads whenever a source file is modified.

### Running the Backend (all three components)

All three components' CRUD operations require the Express/MongoDB backend to run alongside the frontend. Start it in a separate terminal.

```bash
# From the repository root
cd server

# Install dependencies
npm install

# Start the server (production mode)
npm start

# Or, start with auto-restart on file changes
npm run dev
```

The API is available at **http://localhost:8001**. The connection string that points the backend at MongoDB Atlas lives in `server/.env` (copied from `server/.env.example`, which shows the required format but contains no real credentials — see [MongoDB Atlas Database Implementation](#mongodb-atlas-database-implementation) for how to obtain your own). `.env` is gitignored and must never be committed. Open the frontend at **http://localhost:4200/** so its origin matches the backend CORS setting.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/properties` | Retrieve all properties |
| GET | `/api/properties/:id` | Retrieve a single property |
| POST | `/api/properties` | Create a new property |
| PUT | `/api/properties/:id` | Update an existing property |
| DELETE | `/api/properties/:id` | Delete a property |

The same GET, POST, PUT, and DELETE pattern is available at `/api/maintenance-requests` and `/api/work-assignments`.

---

## MongoDB Atlas Database Implementation

FixFlow's database is hosted on **MongoDB Atlas** — a cloud-hosted, managed MongoDB service — rather than a MongoDB instance installed on any individual's computer. This means all three components, for every team member, read and write the same live database over the internet, from whichever machine they're developing on.

### Architecture

```
Angular (localhost:4200)
      │  HttpClient (REST)
      ▼
Express / Node.js (localhost:8001)
      │  Mongoose (ODM)
      ▼
MongoDB Atlas — Cluster0 (cloud)
      └── fixflow database
            ├── Properties          (Property & Location Management)
            ├── MaintenanceRequests (Maintenance Request Management)
            └── WorkAssignments     (Work Assignment Management)
```

Angular never talks to MongoDB directly — every request goes through the Express API, which uses Mongoose models (`server/models/`) to read and write documents in Atlas. This keeps the database connection string and credentials entirely server-side.

### Cluster configuration

| Setting | Value |
|---|---|
| Provider / Tier | AWS, M0 (Free Shared Tier) |
| Cluster name | `Cluster0` |
| Database name | `fixflow` |
| Collections | `Properties`, `MaintenanceRequests`, `WorkAssignments` |
| Network Access | `0.0.0.0/0` (allow access from anywhere) |

The Network Access setting is intentionally open to any IP address. This is a deliberate, pragmatic choice for a class project where team members connect from different, unpredictable home networks — in a production deployment this would instead be restricted to specific IP ranges.

### Access control: project roles vs. database users

Atlas access is split into two independent layers, both scoped per team member rather than shared:

**1. Database users** — the credentials the *application* uses to authenticate when connecting (configured under Atlas → Database Access). Each team member has their own:

| Database Username | Role | Used by |
|---|---|---|
| `fixflow-app` | Read and write to any database | Shared/general application testing |
| `fixflow-ayo` | Read and write to any database | Ayomide Akisanmi-Samuel's local backend |
| `fixflow-mensah` | Read and write to any database | Mensah Emmanuel Kofi's local backend |

Every team member's local `server/.env` contains a `MONGODB_URI` built from their own username and password:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.sw2mcu8.mongodb.net/fixflow?retryWrites=true&w=majority
```

**2. Project (console) access** — separate from the above, this controls who can log into the Atlas *website* to browse data and view the cluster (configured under Atlas → Project Access). The project owner holds **Project Owner** (full administrative control); other team members are invited with **Project Read Only** plus **Project Data Access Read Only**, which lets them use the Data Explorer / Browse Collections view to inspect and screenshot live documents for reporting purposes, without being able to modify cluster configuration, delete data, or manage billing.

### Setting up your own local environment

1. Request a database username and password for the shared cluster from the project owner (John Ofem) — do not reuse another team member's credentials.
2. Copy the template and fill in your credentials:
   ```bash
   cd server
   cp .env.example .env
   ```
3. Edit `server/.env` and replace `<your-username>` / `<your-password>` in the `MONGODB_URI` line with the values you were given. Leave `PORT=8001` as-is.
4. Start the backend (`npm start` from `server/`) and confirm the terminal prints `Connected to MongoDB`.

`.env` is listed in `.gitignore` and is never committed — `server/.env.example` in this repository contains only placeholder values, consistent with the requirement not to publish database credentials.

### Verifying data in Atlas

Anyone with Project Data Access can confirm records are actually being persisted to the cloud (not just appearing in the UI) by signing into [cloud.mongodb.com](https://cloud.mongodb.com), opening this project, and going to **Database → Browse Collections** on `Cluster0`. The `fixflow` database's three collections (`Properties`, `MaintenanceRequests`, `WorkAssignments`) will reflect every Create, Update, and Delete performed through the application in real time.

---

## Available Scripts

Run these from the `frontend/` directory:

| Command | Description |
|---|---|
| `npm start` | Starts the local development server (`ng serve`). |
| `npm run build` | Builds the application for production into `frontend/dist/`. |
| `npm run watch` | Builds in watch mode using the development configuration. |
| `npm test` | Runs the unit test suite with Vitest. |

---

## Branching & Development Workflow

- Each team member works on their own feature branch, created from `main`:
  - `feature/property-management` — John Ofem
  - `feature/maintenance-requests` — Ayomide Akisanmi-Samuel
  - `feature/work-assignments` — Mensah Emmanuel Kofi
- Work only within your assigned component folder under `frontend/src/app/`.
- Each component implements its reactive form using `FormGroup`/`FormControl` or `FormBuilder`, with field validation, HTML form binding, and submission handling.
- Follow the shared styles in `frontend/src/styles.css` to keep the interface consistent; put component-specific styling in that component's own CSS file.
- Test locally with `ng serve` and confirm `ng build` completes successfully before pushing.
- Commit and push to your individual branch, then open a pull request into `main` for review. **Do not push directly to `main`.**

---

## Project Status

**Milestone 1 — Complete**

- [x] Angular application scaffolded with shared UI foundation and routing
- [x] Maintenance Request Management reactive form
- [x] Property & Location Management reactive form
- [x] Work Assignment Management reactive form

**Milestone 2 — Integrated**

- [x] Express/MongoDB backend and full CRUD UI for Property & Location Management
- [x] Express/MongoDB backend and full CRUD UI for Maintenance Request Management
- [x] Express/MongoDB backend and full CRUD UI for Work Assignment Management
- [x] Consolidated navigation, database-backed selectors, and search across all three components
- [x] Migrated from local MongoDB to MongoDB Atlas (cloud), with per-member database credentials and Project Data Access for all team members
- [ ] Google Maps Platform integration *(planned for a later milestone)*
