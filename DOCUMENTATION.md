# FitAI — API & AI Integration Documentation

This document explains how the backend API works, how Groq (LLM) integration is implemented, and how AI responses are surfaced in the frontend.

## Table of contents
- Overview
- Architecture summary
- Backend request flow (server → routes → controllers → services → models)
- Assistant / Groq AI flow (prompting, client, parsing, fallback)
- Frontend integration (API client → Assistant page → rendering)
- Authentication & security
- Environment variables
- Example request / response
- Troubleshooting & common failure modes
- Files to inspect

---

## Overview

FitAI is a web app with a React + Vite frontend and an Express + Mongoose backend. Persistent user data (profiles, progress, workouts, diets, measurements) is stored in MongoDB. The backend optionally calls a Groq LLM via `groq-sdk` to generate workout/diet/coaching responses based on a comprehensive user context.

Key responsibilities:
- Backend: expose domain APIs, gather user context, call Groq SDK when available, and provide rule-based fallback logic.
- Frontend: call backend APIs, show interactive assistant UI, format AI text, and persist chat locally.

---

## Architecture summary

- Server entry: [backend/server.js](backend/server.js#L1-L40)
  - Sets up Express, JSON middleware, CORS, Mongoose connection, health check, and mounts route groups.
- Authentication middleware: [backend/middleware/authMiddleware.js](backend/middleware/authMiddleware.js#L1-L40)
  - Verifies JWT and attaches `req.user_id` to requests.
- Assistant route: [backend/routes/assistantRoutes.js](backend/routes/assistantRoutes.js#L1-L20)
  - Protected by `authMiddleware`, exposes `POST /api/assistant/ask`.
- Assistant controller: [backend/controllers/assistantController.js](backend/controllers/assistantController.js#L1-L40)
  - Validates input and calls `assistantService.generateAssistantResponse()`.
- Assistant service: [backend/services/assistantService.js](backend/services/assistantService.js#L1-L200)
  - Decides AI vs rule-based response, orchestrates data retrieval for the AI path.
- Groq integration: [backend/services/groqService.js](backend/services/groqService.js#L1-L220)
  - Builds prompts, calls `groq-sdk` completions, and robustly parses JSON output.
- User context aggregation: [backend/services/userContextService.js](backend/services/userContextService.js#L1-L220)
  - Queries `User`, `Profile`, `ProgressLog`, `HabitScore`, `WorkoutPlanV2`, `DietPlan`, `EnergyLog`, `BodyMeasurement` and computes helpful statistics used in prompts.

---

## Backend request flow (detailed)

1. Client issues a request to an API endpoint, e.g. `POST /api/assistant/ask`.
2. `authMiddleware` checks `Authorization: Bearer <token>`, verifies with `JWT_SECRET`, and sets `req.user_id`.
3. The route maps to a controller function (thin layer). Example: `askAssistant` in `assistantController.js`.
4. Controller delegates to a service layer (business logic). `assistantService.generateAssistantResponse(user_id, question)` does:
   - Load `Profile` for the `user_id`. If none, return a friendly message asking to set up the profile.
   - Check for `GROQ_API_KEY`. If configured, try to call Groq via `groqService.generateAICoachingResponse(user_id, question)`.
   - If Groq call fails or the key is missing, compute a rule-based, deterministic response using recent `ProgressLog` and `HabitScore` data.
5. Controller returns the JSON response to the frontend.

Files: [backend/server.js](backend/server.js#L1-L40), [backend/routes/assistantRoutes.js](backend/routes/assistantRoutes.js#L1-L20), [backend/controllers/assistantController.js](backend/controllers/assistantController.js#L1-L40), [backend/services/assistantService.js](backend/services/assistantService.js#L1-L200)

---

## Assistant / Groq AI flow (how AI responses are generated)

1. Decision step: `assistantService` checks `process.env.GROQ_API_KEY`.
   - If missing or placeholder, the service uses the built-in rule-based logic.
   - If present, the service attempts an AI call and falls back to rules on error.

2. Gathering user context (critical): `userContextService.gatherCompleteUserContext(user_id)` collects:
   - `User` (name, email)
   - `Profile` (age, height, weight, goal, calories, dietary prefs, injuries)
   - `ProgressLog` history (adherence, weight trend)
   - `HabitScore` history
   - `WorkoutPlanV2`, `DietPlan`, `EnergyLog`, `BodyMeasurement`
   - It computes statistics like average diet/workout adherence, total weight change, streaks, and progress trend.

3. Prompt construction: `formatUserContextForAI(context)` creates a large, human-readable prompt embedding the user's real numbers, progress history, constraints (injuries, allergies), and explicit instructions on output format (JSON schema and required fields). See where this happens: [backend/services/userContextService.js](backend/services/userContextService.js#L1-L220).

4. Groq client usage: `groqService.getGroqClient()` lazily instantiates a client when `GROQ_API_KEY` is set. The service calls:
   ```js
   const completion = await groqClient.chat.completions.create({
     messages: [ { role: 'system', content: 'You are an expert ...' }, { role: 'user', content: prompt } ],
     model: 'llama-3.1-8b-instant',
     temperature: 0.7,
     max_tokens: 2000
   });
   ```
   (See [backend/services/groqService.js](backend/services/groqService.js#L1-L220)).

5. Parsing AI output: The SDK returns text. `groqService` uses `extractAndParseJSON(text)` to:
   - Strip markdown fences and extraneous text
   - Find the outermost JSON object (first `{` to last `}`)
   - Attempt `JSON.parse`; on failure, try to fix common issues (trailing commas), then parse again
   - If parsing still fails, log the raw output and throw an error (service layer falls back)

6. Return: The parsed JSON is returned to `assistantService`, then to the controller and to the frontend.

Notes on the prompt/format:
- The prompts explicitly ask the model to return only valid JSON in a strict schema (e.g., a `response` string + `steps` array + `data_insights` + `confidence`).
- There are separate prompt builders for `generateAIWorkoutPlan`, `generateAIDietPlan`, and `generateAICoachingResponse` in `groqService`—each with its own JSON schema requirement.

---

## Rule-based fallback

If Groq is unavailable or fails, `assistantService` uses deterministic rules:
- It queries recent `ProgressLog` and `HabitScore` to compute averages.
- It applies simple heuristics for common questions (weight loss, protein, cardio, fatigue) and returns templated responses referencing computed numbers (e.g., calorie target, average adherence).

This ensures the assistant remains functional without LLM access.

---

## Frontend integration (how AI responses are reflected)

1. API client: `frontend/src/services/apiService.jsx` centralizes all backend calls. `assistantService.askQuestion(question)` posts to `/assistant/ask`.
   - File: [frontend/src/services/apiService.jsx](frontend/src/services/apiService.jsx#L1-L40)
   - Axios interceptor attaches `Authorization: Bearer <token>` from `localStorage` to every request.

2. UI: `AssistantPage.jsx` handles user input, shows a typing/loader state, keeps chat history in `localStorage` (`fitai_chat_history`), and formats AI text.
   - File: [frontend/src/pages/AssistantPage.jsx](frontend/src/pages/AssistantPage.jsx#L1-L200)
   - It expects the backend JSON to include `response` (string) and optionally `steps`, `tip`, `data_insights`, `disclaimer`, `confidence`.

3. Formatting & rendering:
   - `AssistantPage` uses `formatAIResponse()` to convert plain AI text into HTML (bolds, steps, bullets, important tags) and renders via `dangerouslySetInnerHTML`.
   - Steps, tips, and data insights are displayed as separate UI blocks.

4. Chat launcher: `ChatbotWidget.jsx` is a floating button that navigates users to the assistant UI.
   - File: [frontend/src/components/ChatbotWidget.jsx](frontend/src/components/ChatbotWidget.jsx#L1-L60)

---

## Authentication & security

- JWTs: Frontend stores a JWT in `localStorage` and the axios client adds an `Authorization` header. `authMiddleware` validates the token and injects `req.user_id` for services to use.
- Secrets: `GROQ_API_KEY` and `JWT_SECRET` live server-side in environment variables; they must never be exposed to the client.

---

## Environment variables

- `MONGODB_URI` — MongoDB connection string (used in `backend/server.js`).
- `JWT_SECRET` — Secret to sign/verify JWTs.
- `GROQ_API_KEY` — Groq SDK API key. If missing or left as placeholder, the app will use rule-based responses.
- `PORT` — Server port (default used if missing).
- Frontend: `VITE_API_URL` — base URL for the API used by `apiService`.

Check `.env.example` (if present) for defaults.

---

## Example request / response (Assistant)

Request (frontend -> backend):

```
POST /api/assistant/ask
Authorization: Bearer <JWT>
Content-Type: application/json

{ "question": "Why am I not losing weight?" }
```

Successful (AI) response JSON (example):

```json
{
  "response": "Hi Aashish!\n\nYou're doing well but diet adherence is low...",
  "steps": ["Increase protein to 150g/day", "Add two 20-min cardio sessions"],
  "tip": "Meal prep on Sundays",
  "data_insights": "Workout adherence 80%, diet adherence 55%",
  "confidence": "High"
}
```

If Groq parsing fails, the backend may return a rule-based fallback object with similar shape.

---

## Troubleshooting & common failure modes

- Groq client not created: ensure `GROQ_API_KEY` is set and not the placeholder value. `groqService` lazily instantiates the client only if a valid key is present.
- JSON parsing errors: the LLM sometimes returns markdown or text around the JSON. `extractAndParseJSON` attempts to strip fences and fix trailing commas, but severe format issues will cause an error and the service falls back.
- Slow responses: LLM calls can be slower than DB calls. Consider client-side timeouts, server-side caching, or streaming responses for large plans.
- Unauthorized requests: ensure the frontend stores the JWT and that `VITE_API_URL` points to the correct backend host/port.

---

## Files to inspect (quick links)

- Server: [backend/server.js](backend/server.js#L1-L40)
- Auth middleware: [backend/middleware/authMiddleware.js](backend/middleware/authMiddleware.js#L1-L40)
- Assistant route: [backend/routes/assistantRoutes.js](backend/routes/assistantRoutes.js#L1-L20)
- Assistant controller: [backend/controllers/assistantController.js](backend/controllers/assistantController.js#L1-L40)
- Assistant service: [backend/services/assistantService.js](backend/services/assistantService.js#L1-L200)
- Groq integration & parsing: [backend/services/groqService.js](backend/services/groqService.js#L1-L220)
- User context builder: [backend/services/userContextService.js](backend/services/userContextService.js#L1-L220)
- Frontend API client: [frontend/src/services/apiService.jsx](frontend/src/services/apiService.jsx#L1-L40)
- Assistant UI: [frontend/src/pages/AssistantPage.jsx](frontend/src/pages/AssistantPage.jsx#L1-L200)
- Chat widget: [frontend/src/components/ChatbotWidget.jsx](frontend/src/components/ChatbotWidget.jsx#L1-L60)

---

## Next steps & suggestions

- Add server-side request logging for Groq responses (store a sanitized copy of raw LLM text) to aid debugging when parsing fails.
- Consider adding a local offline/mock Groq client for development and tests.
- Add rate limiting around AI endpoints to avoid accidental overuse of LLM quota.

---

Document created at project root: `DOCUMENTATION.md`.
