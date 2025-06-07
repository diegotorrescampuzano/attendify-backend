# Attendify Backend

Express.js backend for managing Firestore collections via RESTful API endpoints.  
This backend supports batch add/update operations for multiple school-related entities.

---

## Features

- Batch add/update Firestore documents for schools, campuses, educational levels, grades, students, subjects, homerooms, teachers, and teacher lectures.
- Simple RESTful endpoints designed for efficient data management.
- Firebase Admin SDK integration with Firestore.
- Supports large JSON payloads (up to 50MB).

---

## API Endpoints

| Endpoint                     | Description                                      |
|------------------------------|------------------------------------------------|
| **POST /api/schools**           | Add or update multiple school documents          |
| **POST /api/campuses**          | Add or update multiple campus documents          |
| **POST /api/educational-levels**| Add or update multiple educational level documents |
| **POST /api/grades**            | Add or update multiple grade documents           |
| **POST /api/students**          | Add or update multiple student documents         |
| **POST /api/subjects**          | Add or update multiple subject documents         |
| **POST /api/homerooms**         | Add or update multiple homeroom documents        |
| **POST /api/teachers**          | Add or update multiple teacher documents         |
| **POST /api/teacher-lectures** | Add or update multiple teacher lecture documents |

**Note:** Each endpoint expects a JSON body with a `documents` array containing the documents to add or update.

---

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm
- Podman (for containerization)
- Firebase project with Firestore enabled
- Firebase Admin SDK credentials JSON file (`serviceAccountKey.json`)

---

### Clone the Repository

git clone https://github.com/diegotorrescampuzano/attendify-backend.git
cd attendify-backend

text

---

### Install Dependencies

npm install

text

---

### Configure Firebase

Place your Firebase Admin SDK credentials file (e.g., `serviceAccountKey.json`) in the project root.  
Ensure your code loads this file correctly to initialize Firebase Admin SDK.

---

### Run Locally with Nodemon

Install `nodemon` globally (if not installed):

npm install -g nodemon

text

Start the backend with auto-reload on code changes:

nodemon index.js

text

The server listens on port `3000` by default.

---

## Running with Podman

### Build the Docker Image

podman build -t attendify-backend .

text

### Run the Container

podman run -d -p 3000:3000 --name attendify-backend attendify-backend

text

The backend will be accessible at [http://localhost:3000](http://localhost:3000).

---

### Passing Environment Variables and Firebase Credentials to Container

If your Firebase credentials file is outside the container, mount it and set the environment variable:

podman run -d -p 3000:3000 --name attendify-backend
-e GOOGLE_APPLICATION_CREDENTIALS=/app/serviceAccountKey.json
-v $(pwd)/serviceAccountKey.json:/app/serviceAccountKey.json:Z
attendify-backend

text

---

## Environment Variables

- `GOOGLE_APPLICATION_CREDENTIALS` — Path to Firebase Admin SDK JSON file inside container or local environment.
- `NODE_ENV` — Set to `production` for production mode.

---

## Example Request

Example curl request to add/update students:

curl -X POST http://localhost:3000/api/students
-H "Content-Type: application/json"
-d '{
"documents": [
{
"id": "3001234567",
"name": "Juan Perez",
"cellphoneContact": "3001234567",
"status": "activate"
}
]
}'

text

---

## Project Structure

attendify-backend/
├── index.js # Main server entry point
├── package.json
├── routes/
│ ├── students.js # Students endpoint
│ ├── grades.js # Grades endpoint
│ ├── homerooms.js # Homerooms endpoint
│ ├── teacherLectures.js # Teacher lectures endpoint
│ ├── campuses.js
│ ├── educationalLevels.js
│ ├── schools.js
│ ├── subjects.js
│ └── teachers.js
├── serviceAccountKey.json # Firebase credentials (excluded from repo)
└── Dockerfile # Dockerfile for containerization

text

---

## Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/diegotorrescampuzano/attendify-backend/issues).

---

## License

This project is licensed under the MIT License.