# MPIndustry UI — React Frontend

Modern React frontend for the **MPIndustry / MPMSME** (Madhya Pradesh Industry — Land Allotment & Financial Assistance) portal.

This project is a **separate, standalone SPA** that replaces the legacy AngularJS frontend while reusing the existing Java 21 / Spring Boot 3.2.5 backend **without any changes to backend code**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript (Vite) |
| Routing | React Router DOM v6 |
| HTTP Client | Axios |
| Form Handling | React Hook Form + Zod validation |
| Styling | Tailwind CSS v4 |
| Build Tool | Vite |

---

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **Java 21** + **Maven** (to run the backend)
- **Tomcat / Spring Boot** running on port `8080`

---

## Getting Started

### 1. Start the Backend (Spring Boot)

Make sure the existing `mpindustry-web` Spring Boot app is running at:

```
http://localhost:8080/mpmsme
```

From the Java project root:

```bash
# Using Maven Wrapper
./mvnw spring-boot:run -pl mpindustry-web

# Or deploy to Tomcat as usual via Eclipse
```

### 2. Start the Frontend Dev Server

```bash
# From this directory (E:\eclipse\mpindustry-ui)
npm run dev
```

The dev server starts at **http://localhost:5173**.
All `/mpmsme/**` requests are proxied to `http://localhost:8080` automatically.

### 3. Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy the contents to `mpindustry-web/src/main/webapp/` or serve from Nginx/CDN.

---

## Project Structure

```
src/
|-- app/              # App entry, providers, router setup
|-- routes/           # Route definitions and lazy-loaded pages
|-- layouts/          # Layout wrappers (AuthLayout, PublicLayout, DashboardLayout)
|-- modules/          # Feature modules, one sub-folder per backend module
|   |-- id/           # Land Allotment (pilot)
|   |-- fa/           # Financial Assistance
|   |-- msme/         # MSME Awards
|   `-- ...
|-- services/         # Business logic / service layer
|-- api/              # Axios instance + endpoint functions per module
|-- components/
|   |-- ui/           # Generic UI primitives (Button, Badge, Card)
|   |-- forms/        # Reusable form fields and wrappers
|   |-- tables/       # Data table components
|   |-- modals/       # Dialog / modal components
|   `-- loaders/      # Skeleton loaders and spinners
|-- hooks/            # Custom React hooks
|-- utils/            # Pure utility functions
`-- types/            # Global TypeScript types and interfaces
```

---

## Module Migration Order

| Priority | Module | Status |
|---|---|---|
| 1 | `id` (Land Allotment) | In progress |
| 2 | `fa` (Financial Assistance) | Pending |
| 3 | `msme` (MSME Awards) | Pending |
| 4 | `selfemployment` | Pending |
| 5 | `legal` | Pending |
| 6 | `msefc` | Pending |
| 7 | `textile` | Pending |
| 8 | Others | Pending |

---

## API Proxy

The Vite dev proxy is configured in `vite.config.ts`:

```ts
server: {
  proxy: {
    '/mpmsme': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
},
```

All API calls should use the `/mpmsme/` prefix to route through the proxy in dev, and hit the real server in production.

---

## Important Rule

> Do NOT modify any files in the Java/Spring Boot backend modules.
> This frontend communicates with existing backend REST endpoints only.
> No backend Java, XML, properties, or Thymeleaf files should be changed.
