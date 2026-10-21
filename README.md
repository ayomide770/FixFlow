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

- **Frontend:** Angular 22 (standalone components, Reactive Forms, Angular Router)
- **Backend:** Node.js / Express.js *(planned for a later milestone)*
- **Database:** MongoDB *(planned for a later milestone)*
- **Mapping:** Google Maps Platform — Maps JavaScript API
- **Testing:** Vitest (`ng test`)
- **Tooling:** Angular CLI, Prettier

> **Note:** Milestone 1 focuses on the Angular frontend only. Each component's reactive form currently runs against local/demo data — database integration and full application wiring are planned for a later milestone.

---

## Project Structure

```
FixFlow/
├── README.md
└── frontend/                          # Angular application
    └── src/
        └── app/
            ├── property-management/       # John Ofem
            ├── maintenance-requests/      # Ayomide Akisanmi-Samuel
            ├── work-assignments/          # Mensah Emmanuel Kofi
            ├── app.html / app.ts / app.css   # Shell: header, nav, router outlet
            └── app.routes.ts                 # Application routes
        └── styles.css                   # Shared global design system (colors, layout, forms, buttons)
```

Each component folder contains its own `.ts`, `.html`, and `.css` files. Shared, application-wide styling (colors, typography, form controls, buttons, page layout) lives in `frontend/src/styles.css`; styling specific to a single component stays in that component's own CSS file.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (bundled with Node.js)

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

### Syncing with `main`

After a pull request is merged, reset your local `main` to match GitHub before starting new work. This avoids merge conflicts later.

```bash
git fetch origin
git checkout main
git reset --hard origin/main
```

Then create a fresh branch for your next piece of work:

```bash
git checkout -b feature/<your-branch-name>
```

> **Warning:** `git reset --hard` permanently discards any uncommitted changes and any local commits on `main` that are not on GitHub. Commit and push your work to your feature branch first, and check `git status` is clean before running it.

---

## Project Status

**Milestone 1 — In Progress**

- [x] Angular application scaffolded with shared UI foundation and routing
- [x] Maintenance Request Management reactive form
- [x] Property & Location Management reactive form
- [ ] Work Assignment Management reactive form
- [ ] Full component integration
- [ ] Backend (Express/MongoDB) implementation
- [ ] Google Maps Platform integration
