# Lifto

Lifto is a mobile workout tracking app built with React Native.  
It allows users to log workouts, track sets, and monitor progress over time.

## Features

- OAuth authentication (secure login)
- Session management
- Create and manage workouts
- Log sets (reps, weight, notes)
- Track workout progress
- Cloud sync with Supabase

## Tech Stack
Ç
- **React Native** — mobile development
- **OAuth** — authentication & session handling
- **Supabase** — database and backend

## Architecture Overview

- Frontend: React Native app
- Backend: Supabase (PostgreSQL + Auth)
- Auth Flow: OAuth → session handled client-side

## Data Model (simplified)

- Users
- Workouts
- Exercises
- Sets

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/lifto.git
cd lifto