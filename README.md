# SafeRoute

Safer routes. Smarter decisions.

SafeRoute is an AI-powered route planning application designed to help users compare routes using safety-related indicator, rather than relying only on distance and travel time.

Built during Hacktoberfest 2026 Hack Day — Chennai × Android Club VITC**, SafeRoute combines maps, community reports, open-source/open-weight AI, and machine learning to provide users with a more informed view of their route options.

Problem

Traditional navigation applications primarily optimize for:

*Distance
*Travel time
*Traffic

But the shortest route isn't always the route a person feels most comfortable taking**, especially at night or in areas with poor lighting, low activity, reported incidents, or other environmental concerns.

SafeRoute aims to answer:
"Which available route has better safety indicators based on the data we have?

---

Our Solution

SafeRoute analyzes multiple safety-related factors and generates a **Route Safety Indicator** for each route.

Potential factors include:

* 💡 Street lighting
* 🚨 Reported incidents
* 🐕 Street-dog reports
* 👥 Pedestrian/activity levels
* 🏪 Nearby public places
* 📢 Community-submitted reports
* 🕐 Time of day
* 🤖 AI-extracted information from user reports

The application allows users to compare routes and make a more informed choice.
Important: SafeRoute provides an indicator based on available data. It does not guarantee that a route is safe or predict the probability of an attack or crime.

---

AI Architecture

SafeRoute uses a two-stage AI approach.

                    User Report
                         │
                         ▼
              ┌─────────────────────┐
              │ Open-Weight AI Model │
              │   (e.g. Gemma)      │
              └──────────┬──────────┘
                         │
                         ▼
              Structured Safety Data
                         │
                         ▼
              ┌─────────────────────┐
              │        MLP          │
              │ Safety Model        │
              └──────────┬──────────┘
                         │
                         ▼
                Safety Indicator
                         │
                         ▼
                   React Frontend


Stage 1 — Language Model

A permitted pretrained open-source/open-weight language model processes unstructured community reports.

For example:

"The road is very dark and there are many dogs near the bus stop at night."

The model can extract structured information such as:

```json
{
  "lighting_issue": 1,
  "dog_issue": 1,
  "time": "night",
  "severity": 3
}
```

Stage 2 — MLP

The extracted features can be combined with structured route/environmental data.

Example feature vector:

``` json
[
  lighting_score,
  incident_count,
  dog_reports,
  activity_level,
  nearby_safe_places,
  time_of_day,
  ai_lighting_issue,
  ai_animal_issue
]
```

The MLP produces a route safety indicator used for route comparison.

---

System Architecture

┌──────────────────────┐
│      React App       │
│      Frontend        │
└──────────┬───────────┘
           │
           │ API
           ▼
┌──────────────────────┐
│      FastAPI         │
│       Backend        │
└───────┬───────┬──────┘
        │       │
        │       │
        ▼       ▼
┌────────────┐ ┌────────────────┐
│ Database   │ │ Open-Weight AI │
│            │ │ Model          │
└────────────┘ └───────┬────────┘
                       │
                       ▼
                 ┌────────────┐
                 │    MLP     │
                 │ Safety     │
                 │ Indicator  │
                 └────────────┘


---

Tech Stack

Frontend

* React.js
* JavaScript
* HTML/CSS
* Map integration

Backend

* Python
* FastAPI
* REST APIs

AI / Machine Learning

* Pretrained open-source/open-weight language model
* MLP (Multi-Layer Perceptron)
* Python ML ecosystem

Database

* SQL/database service
* Community reports
* Route safety data

Collaboration

* Git
* GitHub
* VS Code

---

Project Structure


SafeRoute/
│
├── frontend/
│   └── React application
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── services/
│   │   ├── models/
│   │   └── schemas/
│   │
│   ├── data/
│   ├── saved_models/
│   └── requirements.txt
│
├── database/
│   ├── schema.sql
│   └── seed_data.sql
│
├── maps/
│   └── route/map integration
│
├── docs/
│
├── .gitignore
└── README.md


---

Core API

The backend is designed around a small set of APIs.
 Health Check

```http
GET /health
```

Used to verify that the backend is running.

Analyze Route

```http
POST /analyze-route
```

Example request:

```json
{
  "start": "College",
  "destination": "Home",
  "route_id": "route_1"
}
```

Example response:

```json
{
  "route_id": "route_1",
  "indicator": 0.82,
  "lighting": "Good",
  "incidents": "Low",
  "activity": "High"
}
```

### Submit Report

```http
POST /report
```

Example:

```json
{
  "latitude": 12.9,
  "longitude": 80.2,
  "description": "The street is very dark near the bus stop."
}
```

The backend can send the report to the language model, extract structured features, and feed relevant features into the safety model.

---

Team

SafeRoute is being developed collaboratively by a 4-person team.

| Role        | Responsibility                |
| ----------- | ----------------------------- |
| 👤 Person 1 | React Frontend & UI           |
| 👤 Person 2 | Maps & Route Generation       |
| 👤 Person 3 | Backend, AI & MLP Integration |
| 👤 Person 4 | Database, Data & Testing      |

---

Hackathon MVP

Our primary goal is to deliver a working end-to-end prototype:

```text
User
 ↓
Select Start + Destination
 ↓
Generate Routes
 ↓
Collect Safety Indicators
 ↓
AI-assisted Report Processing
 ↓
MLP Safety Indicator
 ↓
Compare Routes
 ↓
User chooses a preferred route
```

The focus is on shipping a working prototype within the hackathon timeframe, rather than building a production-scale navigation platform.

---

Future Improvements

Potential future additions include:

* Real-time community reports
* Time-based safety analysis
* More environmental indicators
* Improved route personalization
* Emergency assistance
* Trusted journey sharing
* Historical safety trends
* More sophisticated AI agents
* Larger geographic coverage
* Continuous model improvement

---

Responsible AI

SafeRoute is intended to support informed decision-making, not to make definitive claims about whether a person or location is safe.

Safety indicators are dependent on the quality, availability, and freshness of the underlying data.

Reported incidents should be interpreted as **reported events**, not definitive evidence that an area or road is inherently dangerous.

---

Built For

Hacktoberfest 2026 Hack Day — Chennai × Android Club VITC

A one-day open-source hackathon focused on:

* Open source
* Open-weight AI
* AI experimentation
* Collaboration
* Rapid prototyping
* Building and shipping working projects

---

License

This project will use an open-source license appropriate to the hackathon requirements and the licenses of the models, datasets, and libraries used in the project.

Individual AI models and datasets may have their own license terms. Their respective licenses must be followed.

---

SafeRoute

Don't just find the fastest route.
Find a route you can feel better informed about taking.
