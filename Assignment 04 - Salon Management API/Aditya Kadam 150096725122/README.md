# Salon Management API

RESTful API for managing Salons, Services, and User Authentication. Built with Express, Supabase (Postgres), JWT, and bcrypt.

## Setup

1. Create a project at [supabase.com](https://supabase.com) and open its SQL editor.
2. Run this SQL to create the tables:

```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password text not null,
  created_at timestamptz default now()
);

create table salons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  owner_id uuid references users(id),
  created_at timestamptz default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid references salons(id),
  name text not null,
  price numeric,
  duration_minutes int,
  created_at timestamptz default now()
);
```

3. Copy `.env.example` to `.env` and fill in your Supabase project URL/key and a JWT secret:

```
cp .env.example .env
```

4. Install dependencies and start the server:

```
npm install
npm start
```

## API

### Auth
- `POST /api/auth/register` — `{ name, email, password }` → creates a user
- `POST /api/auth/login` — `{ email, password }` → `{ token }`

Protected routes require `Authorization: Bearer <token>`.

### Salons
- `GET /api/salons`
- `GET /api/salons/:id`
- `POST /api/salons` (protected) — `{ name, address, phone }`
- `PUT /api/salons/:id` (protected)
- `DELETE /api/salons/:id` (protected)

### Services
- `GET /api/services` (optional `?salon_id=`)
- `GET /api/services/:id`
- `POST /api/services` (protected) — `{ salon_id, name, price, duration_minutes }`
- `PUT /api/services/:id` (protected)
- `DELETE /api/services/:id` (protected)

## Smoke test

```bash
curl -X POST localhost:3000/api/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","password":"secret123"}'

TOKEN=$(curl -s -X POST localhost:3000/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}' | jq -r .token)

curl -X POST localhost:3000/api/salons -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" -d '{"name":"Glow Salon","address":"123 Main St"}'
```
## Deploy Link

https://salon-management-api-siq6.onrender.com/api
