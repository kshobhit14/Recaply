# Recaply

**Turn Conversations into Clarity.**

Recaply is a full-stack AI meeting summarizer built with SvelteKit, Node.js/Express, MongoDB, OpenAI Whisper, and the OpenAI API.

## Features
- Dark, responsive SvelteKit dashboard
- Meeting audio upload
- Whisper transcription integration
- LLM-powered summary, key decisions, and action items
- MongoDB persistence
- JWT authentication
- REST API
- Thunder Client friendly endpoints

## Project structure

- `frontend/` — SvelteKit + Tailwind frontend
- `backend/` — Express REST API
- `backend/uploads/` — temporary audio storage

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Set these values in `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/recaply
JWT_SECRET=change_this_secret
OPENAI_API_KEY=your_openai_key
CLIENT_URL=http://localhost:5173
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/meetings`
- `POST /api/meetings/upload`
- `GET /api/meetings/:id`
- `DELETE /api/meetings/:id`

Protected meeting endpoints expect:

`Authorization: Bearer <token>`

## Notes

The Whisper and LLM calls are intentionally isolated in `backend/src/services/` so they can be replaced or mocked easily during development.
