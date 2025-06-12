# Firestore Schema Documentation

> **Note:** Each Firestore collection consists of documents identified by a **document ID** (not stored as a field inside the document unless explicitly added). The document ID uniquely identifies each document within the collection and is used to reference documents throughout the database.

---

## users

> **Example Document ID:** `WiI7uR0vMwMQwOxOThXNODWmhFx2`

| Field   | Type   | Example Value               | Description             |
|---------|--------|----------------------------|-------------------------|
| email   | string | "marianitatatu11@gmail.com" | User's email address    |
| name    | string | "Mariana Torres"           | User's full name        |
| refId   | string | "t02"                      | Reference ID (likely to a teacher document ID) |
| role    | string | "teacher"                  | User role               |

**Relationships:**  
- `refId` may correspond to a document ID in the `teachers` collection.

---

## teachers

> **Example Document ID:** `t01`

| Field            | Type    | Example Value             | Description                              |
|------------------|---------|---------------------------|------------------------------------------|
| assignedCampuses | array   | ["/campuses/c01", ...]    | References to campus documents           |
| description      | string  | "Profesor de Informática" | Teacher's description                    |
| name             | string  | "Diego A Torres"          | Teacher's full name                      |

**Relationships:**  
- `assignedCampuses` contains references to `campuses` documents.

---

## teacherLectures

> **Example Document ID:** `t01-c01`

| Field     | Type | Example Value         | Description                                  |
|-----------|------|----------------------|----------------------------------------------|
| campus    | reference  | "/campuses/c01"      | Reference to a campus document               |
| lectures  | map  | { monday: [...], ...}| Map of days to arrays of lecture objects     |
| teacher   | reference  | "/teachers/t01"      | Reference to the teacher document            |

**Lecture Object (inside lectures[day][i]):**

| Field     | Type     | Example Value                   | Description                        |
|-----------|----------|---------------------------------|------------------------------------|
| homeroom  | reference/null | "/homerooms/c01-hr402" or null  | Reference to homeroom or null      |
| slot      | number   | 1                               | Time slot number                   |
| subject   | reference/null | "/subjects/subject-informatica" | Reference to subject or null       |
| time      | string   | "07:00 - 08:00"                 | Time range                         |

**Relationships:**  
- `campus` references a campus.  
- `teacher` references a teacher.  
- Each lecture references a homeroom and subject.

---

## subjects

> **Example Document ID:** `subject-arte`

| Field       | Type   | Example Value         | Description         |
|-------------|--------|----------------------|---------------------|
| description | string | "Historia del Arte"  | Subject description |
| name        | string | "Arte"               | Subject name        |

---

## students

> **Example Document ID:** `+573006582212`

| Field           | Type   | Example Value                      | Description                        |
|-----------------|--------|------------------------------------|------------------------------------|
| cellphoneContact| string | "3006582212"                       | Student's contact phone            |
| name            | string | "Plazas Perez Evangeline Celeste"  | Student's full name                |
| status          | string | "activate"                         | Status (e.g., active/inactive)     |

---

## homerooms

> **Example Document ID:** `c01-hr1001`

| Field              | Type    | Example Value                   | Description                        |
|--------------------|---------|---------------------------------|------------------------------------|
| campusId           | reference     | "/campuses/c01"                 | Reference to campus                |
| description        | string  | "Homeroom for grade 10"         | Homeroom description               |
| educationalLevelId | reference     | "/educationalLevels/el02"       | Reference to educational level     |
| gradeId            | reference     | "/grades/g10"                   | Reference to grade                 |
| name               | string  | "Aula 1001"                     | Homeroom name                      |
| students           | array   | ["/students/3205184390", ...]   | References to student documents    |

**Relationships:**  
- `campusId`, `educationalLevelId`, `gradeId` are references.  
- `students` is an array of references to student documents.

---

## grades

> **Example Document ID:** `g01`

| Field       | Type   | Example Value        | Description         |
|-------------|--------|---------------------|---------------------|
| description | string | "Grado Primero."    | Grade description   |
| name        | string | "Primero"           | Grade name          |

---

## educationalLevels

> **Example Document ID:** `el00`

| Field       | Type   | Example Value      | Description             |
|-------------|--------|-------------------|-------------------------|
| description | string | "Nivel Preescolar"| Level description       |
| name        | string | "Preescolar"      | Level name              |

---

## campuses

> **Example Document ID:** `c01`

| Field      | Type    | Example Value                      | Description                       |
|------------|---------|------------------------------------|-----------------------------------|
| description| string  | "Finca El Brasil"                  | Campus description                |
| homerooms  | array   | ["/homerooms/c01-hrprejardin", ...]| References to homeroom documents  |
| name       | string  | "Sede Principal - Kirpalamar"      | Campus name                       |
| zone       | string  | "urban"                            | Zone type                         |

---

## attendanceLabels

> **Example Document IDs:** `A`, `E`, `I`, `IJ`, `P`, `T`

| Document ID | color     | description                  |
|-------------|-----------|------------------------------|
| A           | green     | Asiste                       |
| E           | red       | Evasión                      |
| I           | black54   | Inasistencia                 |
| IJ          | blueGrey  | Inasistencia Justificada     |
| P           | purple    | Retiro con acudiente         |
| T           | orange    | Tarde                        |

---

## attendances

> **Example Document ID:** `01-hrprejardin_subject-matematica-basica_2025-06-10_0700-0800`

| Field             | Type      | Example Value                              | Description                      |
|-------------------|-----------|--------------------------------------------|----------------------------------|
| attendanceRecords | map       | { "+573006582212": {...}, ... }            | Map of student attendance        |
| campusId          | string    | "c01"                                      | Campus ID                        |
| campusName        | string    | "Sede Principal - Kirpalamar"              | Campus name                      |
| createdAt         | timestamp | 2025-06-10T15:49:03-05:00                  | Creation timestamp               |
| date              | timestamp | 2025-06-10T00:00:00-05:00                  | Attendance date                  |
| day               | string    | "tuesday"                                  | Day of the week                  |
| educationalLevelId| string    | "el00"                                     | Educational level ID             |
| educationalLevelName| string  | "Preescolar"                               | Educational level name           |
| gradeId           | string    | "gprejardin"                               | Grade ID                         |
| gradeName         | string    | "Primero"                                  | Grade name                       |
| homeroomId        | string    | "c01-hrprejardin"                          | Homeroom ID                      |
| homeroomName      | string    | "Aula prejardin"                           | Homeroom name                    |
| offTheClock       | boolean   | true                                       | Was attendance off the clock?    |
| slot              | string    | "1"                                        | Time slot                        |
| subjectId         | string    | "subject-matematica-basica"                | Subject ID                       |
| subjectName       | string    | "Matemáticas para Primaria"                | Subject name                     |
| teacherId         | string    | "t01"                                      | Teacher ID                       |
| teacherName       | string    | "Diego Torres"                             | Teacher name                     |
| time              | string    | "07:00 - 08:00"                            | Time range                       |
| updatedAt         | timestamp | 2025-06-10T18:42:41-05:00                  | Last update timestamp            |

**attendanceRecords Map (per student):**

| Field           | Type      | Example Value                | Description                    |
|-----------------|-----------|------------------------------|--------------------------------|
| createdAt       | timestamp | 2025-06-10T18:42:15-05:00    | Creation timestamp             |
| label           | string    | "A"                          | Attendance label               |
| labelColor      | string    | "ff4caf50"                   | Hex color                      |
| labelDescription| string    | "Asiste"                     | Label description              |
| notes           | string    | ""                           | Notes                          |
| offTheClock     | boolean   | true                         | Was attendance off the clock?  |
| studentName     | string    | "Plazas Perez Evangeline Celeste" | Student name             |
| updatedAt       | timestamp | 2025-06-10T18:42:41-05:00    | Last update timestamp          |

---

## licenses

> **Example Document ID:** `school_001`

| Field              | Type      | Example Value         | Description                       |
|--------------------|-----------|----------------------|-----------------------------------|
| active             | boolean   | true                 | Is the license active?            |
| createdAt          | timestamp | 2025-06-10T15:13:54  | Creation timestamp                |
| description        | string    | "Licencia anual para el uso de Attendify por el Colegio Kirpalamar. Incluye acceso a todas las funcionalidades para docentes y administradores."  | License description               |
| expiryDate         | timestamp | 2025-06-30T15:15:25  | Expiry date                       |
| id                 | string    | "school_001"         | License ID (matches document ID) |
| name               | string    | "Licencia Colegio Kirpalamar" | License name              |
| updatedAt          | timestamp | 2025-06-10T00:00:00  | Last update timestamp             |
| warnDaysBeforeExpiry| number   | 28                   | Days before expiry to warn        |

---

## Summary Table: Collections and Relationships

| Collection         | Key Fields/References                    | Related Collections           |
|--------------------|------------------------------------------|------------------------------|
| users              | refId (string, to teachers)              | teachers                     |
| teachers           | assignedCampuses (array, refs to campuses)| campuses                     |
| teacherLectures    | campus (ref), teacher (ref), lectures    | teachers, campuses, subjects, homerooms |
| subjects           | -                                        | -                            |
| students           | -                                        | -                            |
| homerooms          | campusId, educationalLevelId, gradeId, students (refs) | campuses, educationalLevels, grades, students |
| grades             | -                                        | -                            |
| educationalLevels  | -                                        | -                            |
| campuses           | homerooms (array, refs to homerooms)     | homerooms                    |
| attendanceLabels   | -                                        | -                            |
| attendances        | attendanceRecords (map), homeroomId, subjectId, teacherId | students, homerooms, subjects, teachers |
| licenses           | -                                        | -                            |
