# FixMate — Frontend

> Get broken devices and appliances fixed by verified technicians. Customers request a repair, technicians fix it, and payment happens only after the job is completed.

**Backend repository:** see [`backend-repository`](https://github.com/sojibkhan567/fixmate-backend)

## Purpose

FixMate is a repair-service marketplace. Customers browse approved repair services, send a repair request, and pay online once the work is done. Technicians list services and manage incoming requests, and admins approve which services appear on the platform.

## Live URL

|             |                                        |
| ----------- | -------------------------------------- |
| Website     | `https://fixmate-tawny.vercel.app`     |
| Frontend    | `https://fixmate-tawny.vercel.app/`    |
| Backend API | `fixmate-backend-zeta.vercel.app/test` |

## Demo credentials

| Role       | Email                    | Password      |
| ---------- | ------------------------ | ------------- |
| Admin      | `admin@example.com`      | `password123` |
| Technician | `technician@example.com` | `password123` |
| Customer   | `customer@example.com`   | `password123` |

> Replace these with your real demo accounts. Use throw-away demo passwords only, never real ones, and don't commit secrets to a public repository.

## Key features

**Public**

- Modern home page: hero with search, latest 6 approved services, "How FixMate works", popular categories with trust points, testimonials, technician call-to-action, FAQ.
- Service details page with full information and a technician summary. Unapproved or unavailable services show the Not Found page.

**Authentication (Better Auth)**

- Customer registration (name, email, phone, area, optional bio) and sign-in, both validated with zod.
- After sign-in, users go to their own role dashboard. A `callbackUrl` returns them to the page they came from.

**Customer**

- **Request Repair** flow: logged-out users are sent to sign-in and back; only customers can request; the button is disabled when the service is already booked.
- Request form: read-only name and email, phone, address, preferred date (today or later), problem description (20+ characters).
- **My Bookings** (`/dashboard/customer/bookings`): table and mobile cards with status and payment badges, cancel (only while `requested`, with confirmation), and **Pay Now** (Stripe Checkout) for completed, unpaid jobs.

**Technician**

- **Manage Requests** (`/dashboard/technician/requests`): status filter, plus per-status actions: Accept / Reject, Start Work, Mark Completed (modal to enter the final amount, pre-filled with the base price).

**Admin**

- **Service Approval** (`/dashboard/admin/services`): all services from all technicians, filtered to Pending by default; Approve or Reject any service.

**Dashboard**

- Role-based sidebar and header for admin, technician and customer, with a route guard that keeps each user inside their own area.

## Tech stack

Next.js (App Router) · React · TypeScript · Tailwind CSS (amber theme) · shadcn/ui on Base UI

## npm packages used

| Package                                                                | Used for                                                               |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `next`, `react`, `react-dom`                                           | Framework and UI                                                       |
| `typescript`                                                           | Type safety                                                            |
| `tailwindcss`                                                          | Styling                                                                |
| `shadcn` (CLI) and its components, built on **Base UI**                | Button, Input, Textarea, Label, Dialog, Table, Badge, Avatar, Skeleton |
| `lucide-react`                                                         | Icons                                                                  |
| `sonner`                                                               | Toast notifications                                                    |
| `zod`                                                                  | Form validation schemas                                                |
| `react-hook-form`, `@hookform/resolvers`                               | Sign-up and sign-in forms                                              |
| `better-auth`                                                          | Authentication client (`better-auth/react`)                            |
| `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css` | Installed by shadcn/ui for component styling                           |

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Add the shadcn components used by the app (if not already added)
npx shadcn@latest add button input textarea label dialog table badge avatar skeleton

# 3. Environment variables: create .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_AUTH_URL=http://localhost:5000

# 4. Run
npm run dev        # http://localhost:3000
```

## Project structure

```
app/
  page.tsx                          Home page
  services/[id]/                    Service details + not-found
  sign-in/  sign-up/                Auth pages
  dashboard/
    layout.tsx                      Sidebar + header + role guard
    customer/bookings/              My Bookings
    technician/requests/            Manage Requests
    admin/services/                 Service Approval
components/
  home/  layout/  auth/  bookings/  requests/  admin/  dashboard/  services/
hooks/use-auth.ts                   Better Auth session → { user, loading, signOut }
lib/
  api.ts                            Calls to the Express API
  auth-client.ts                    Better Auth client
  dashboard-nav.ts                  Sidebar menu per role
  validations/                      zod schemas
```

## Roadmap

Technician "My Services / Add Service", admin "Manage Users / All Bookings", and the profile pages are linked in the sidebar but not built yet.
