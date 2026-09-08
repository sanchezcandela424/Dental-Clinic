# Dental - Clinic Management System
 
## Tech Stack
 
### Frontend
- **Next.js 15.2** - React framework with App Router
- **React 19.0** - UI library
- **TypeScript 5.0** - Type safety
- **Tailwind CSS 4.0** - Styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **TanStack Query** - Data fetching and caching
- **tRPC** - End-to-end typesafe APIs
 
### Backend
- **tRPC 11.17** - Type-safe API layer
- **Prisma 5.22** - ORM for database access
- **NextAuth 4.24** - Authentication
- **bcrypt** - Password hashing
- **Zod** - Schema validation
- **Puppeteer** - PDF generation for invoices
 
### Database
- **PostgreSQL** - Primary database (Neon cloud hosting)
 
### Testing
- **Jest 30.4** - Unit testing
- **Playwright 1.59** - End-to-end testing
- **ts-jest** - TypeScript Jest preprocessor
 
---
 
## Quickstart
 
### Prerequisites
- Node.js 20+ 
- PostgreSQL database
- npm or pnpm
 
### Installation
 
1. Clone the repository
```bash
git clone <repository-url>
cd dental-clinic-management-system
```
2. Install dependencies
```bash
npm install
# or
pnpm install
```
3. Set up environment variables.
Create a new file named `.env` in the root of your project and add the following content:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/citydent"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```
4. Run database migrations
```bash
npx prisma migrate dev
```
5. Generate Prisma client
```bash
npx prisma generate
```
6. Run the Project
```bash
npm run dev
```



   
