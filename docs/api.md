# API Endpoint & Data Architecture Reference

This document outlines the suggested API endpoints and data flow for the Conecta Care application. It serves as a blueprint for backend development and frontend data fetching.

---

## 1. Dashboard

Endpoints designed to aggregate data for the main dashboard view.

#### `GET /dashboard/summary`
Returns key performance indicators (KPIs) and metadata.
- **Query Params**: `range={7d|30d}`
- **Response Body**:
  ```json
  {
    "kpis": {
      "vagasAbertas": 12,
      "plantoesComAlerta": 3,
      "tarefasUrgentes": 5,
      "comunicacoesPendentes": 8
    },
    "lastUpdated": "2023-10-27T10:00:00Z"
  }
  ```

#### `GET /dashboard/recent-evolutions`
Fetches a list of the most recent shift reports.
- **Query Params**: `limit={number}`
- **Response Body**: `Array<ShiftReport>`

#### `GET /dashboard/tasks`
Fetches a list of tasks, with optional filters.
- **Query Params**: `priority={Urgente|Alta|...}`, `assignee={professionalId}`
- **Response Body**: `Array<Task>`

#### `GET /dashboard/activity-feed`
Fetches a combined list of recent activities (reports, notifications, tasks).
- **Query Params**: `limit={number}`, `types={report,notification,...}`
- **Response Body**: `Array<ActivityEvent>`


---

## 2. Plantões (Shifts)

Endpoints for managing the shift board.

#### `GET /shifts`
Returns all shift data for a given period.
- **Query Params**: `startDate={YYYY-MM-DD}`, `endDate={YYYY-MM-DD}`
- **Response Body**: `Array<Shift>`

#### `POST /shifts/{id}/publish`
Publishes an open shift to make it available for professionals.
- **Request Body**:
  ```json
  {
    "valueOffered": 150.00,
    "isUrgent": false,
    "notes": "Observações para os profissionais."
  }
  ```

#### `POST /shifts/{id}/assign`
Directly assigns a professional to a shift.
- **Request Body**: `{ "professionalId": "prof-123" }`

#### `GET /shifts/{id}/candidates`
Returns a list of professionals who applied for a specific shift.
- **Response Body**: `Array<Professional>`

---

## 3. Pacientes (Patients)

Standard CRUD endpoints for patient management.

#### `GET /patients`
Returns a paginated and filterable list of all patients.
- **Query Params**: `page={number}`, `limit={number}`, `name={string}`, `status={Ativo|Inativo}`
- **Response Body**: `{ "data": Array<Patient>, "pagination": { ... } }`

#### `GET /patients/{id}`
Returns details for a single patient.
- **Response Body**: `Patient`

#### `POST /patients`
Creates a new patient.
- **Request Body**: `Patient`

#### `PUT /patients/{id}`
Updates an existing patient's data.
- **Request Body**: `Partial<Patient>`

---

## 4. Equipe (Professionals)

Standard CRUD endpoints for team management.

#### `GET /team`
Returns a list of all professionals.
- **Query Params**: `role={string}`, `specialty={string}`
- **Response Body**: `Array<Professional>`

#### `GET /team/{id}`
Returns details for a single professional.
- **Response Body**: `Professional`

---

## 5. Tarefas & Comunicações (Tasks & Communications)

Endpoints for managing tasks and notifications.

#### `POST /tasks`
Creates a new task.
- **Request Body**: `Task`

#### `PUT /tasks/{id}`
Updates a task (e.g., changes status, assignee).
- **Request Body**: `Partial<Task>`

#### `POST /tasks/{id}/complete`
A shortcut to mark a task as done.

#### `POST /notifications/{id}/ack`
Marks a notification as read/acknowledged.

---

## 6. Estoque (Inventory)

Endpoints for managing patient supplies.

#### `GET /inventory/{patientId}`
Returns the inventory list for a specific patient.
- **Response Body**: `Array<InventoryItem>`

#### `POST /inventory/requisition`
Creates a new supply requisition for a patient's family.
- **Request Body**:
  ```json
  {
    "patientId": "patient-123",
    "items": [
      { "supplyId": "item-001", "quantity": 10 },
      { "supplyId": "item-002", "quantity": 5 }
    ],
    "notes": "Urgente, por favor."
  }
  ```
