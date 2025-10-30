# TalentFlow - Mini Hiring Platform

## Project Overview

TalentFlow is a comprehensive React-based hiring management platform designed to streamline the recruitment process. The application provides distinct experiences for HR managers and job candidates, featuring job management, candidate tracking, custom assessments, and a complete application workflow - all without requiring a backend server.

This is a frontend only demonstration project that simulates a full-stack application using Mock Service Worker (MSW) for API simulation and IndexedDB for local data persistence.

## Live Demo

talentflow715-x4ya-5q1lvq11f-rajeev-sharmas-projects-732d6408.vercel.app

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Running the Application](#running-the-application)
6. [Project Structure](#project-structure)
7. [Key Features Breakdown](#key-features-breakdown)
8. [Architecture & Design Decisions](#architecture--design-decisions)
9. [API Endpoints (Simulated)](#api-endpoints-simulated)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Known Issues & Limitations](#known-issues--limitations)
13. [Future Enhancements](#future-enhancements)
14. [Contributing](#contributing)
15. [License](#license)

***

## Features

### Core Functionalities

#### For HR Managers
- Complete job lifecycle management (create, edit, archive, delete)
- Drag-and-drop job reordering with optimistic updates and rollback on failure
- Advanced candidate management with pipeline stages
- Kanban board for candidate status tracking
- Custom assessment builder with multiple question types
- Real-time assessment previews
- Comprehensive dashboard with analytics
- Virtualized lists for handling 1000+ candidates efficiently
- Advanced filtering and search capabilities

#### For Job Seekers
- Browse available job positions
- Apply to multiple jobs with detailed applications
- Complete custom assessments
- Track application status
- Responsive design for mobile and desktop

#### Technical Features
- Role-based access control (HR vs Candidate)
- Client-side routing with React Router
- Local data persistence with IndexedDB
- Simulated REST API with MSW
- Optimistic UI updates with automatic rollback
- Server-like pagination and filtering
- Form validation with inline error messages
- Toast notifications for user feedback
- Modern UI with Tailwind CSS and custom components

***

## Tech Stack

### Frontend Framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### Routing & State
- **React Router DOM v6** - Client-side routing
- **React Context API** - Global state management for user roles

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Custom CSS** - Modern design system with glassmorphism effects
- **React Hot Toast** - Toast notifications
- **dnd-kit** - Drag and drop functionality

### Data & API Simulation
- **Dexie.js** - IndexedDB wrapper for local storage
- **MSW (Mock Service Worker)** - API mocking
- **Axios** - HTTP client
- **Faker.js** - Seed data generation

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Vite** - Fast development server

***

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or higher)
- **npm** (v8.x or higher) or **yarn** (v1.22.x or higher)
- **Git** (for cloning the repository)
- Modern web browser (Chrome, Firefox, Safari, or Edge)

***

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/talentflow-hiring-platform.git
cd talentflow-hiring-platform
```

### Step 2: Install Dependencies

```bash
npm install
```

or if you prefer yarn:

```bash
yarn install
```

### Step 3: Environment Setup

This project doesn't require environment variables as it runs entirely client-side. However, you may create a `.env` file for future configurations:

```bash
# .env (optional)
VITE_APP_NAME=TalentFlow
VITE_API_BASE_URL=/api
```

***

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be generated in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Run Tests (if configured)

```bash
npm test
```

***

## Project Structure

```
talentflow-hiring-platform/
├── public/                          # Static assets
├── src/
│   ├── components/                  # Reusable React components
│   │   ├── common/                  # Shared components
│   │   │   ├── JobCard.tsx
│   │   │   └── SimpleJobSkeleton.tsx
│   │   ├── HrDashboard/            # HR-specific components
│   │   │   └── Header.tsx
│   │   ├── Jobs/                    # Job-related components
│   │   │   ├── ApplicationModal.tsx
│   │   │   ├── JobModal.tsx
│   │   │   └── DeleteConfirmationModal.tsx
│   │   ├── layout/                  # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── HrLayout.tsx
│   │   ├── sections/                # Landing page sections
│   │   │   ├── Hero.tsx
│   │   │   └── Features.tsx
│   │   ├── ui/                      # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Logo.tsx
│   │   └── ProtectedRoute.tsx      # Route protection HOC
│   │
│   ├── context/                     # React Context providers
│   │   └── UserContext.tsx         # User role management
│   │
│   ├── pages/                       # Page-level components
│   │   ├── Landing.tsx             # Landing page
│   │   ├── Login.tsx               # Login/Role selection
│   │   ├── HrDashboard.tsx         # HR Dashboard
│   │   ├── Jobs.tsx                # Jobs management (HR)
│   │   ├── CandidateJobs.tsx       # Job browsing (Candidate)
│   │   ├── JobDetails.tsx          # Job detail view
│   │   ├── Candidates.tsx          # Candidates list
│   │   ├── CandidateProfile.tsx    # Candidate details
│   │   ├── Assessments.tsx         # Assessments list
│   │   ├── AssessmentBuilder.tsx   # Create/Edit assessments
│   │   ├── AssessmentPreview.tsx   # Preview assessments
│   │   └── AssessmentResults.tsx   # View results
│   │
│   ├── services/                    # Backend services layer
│   │   ├── db/                     # IndexedDB operations
│   │   │   ├── jobsDb.ts
│   │   │   ├── candidatesDb.ts
│   │   │   └── assessmentsDb.ts
│   │   ├── mocks/                  # MSW configuration
│   │   │   ├── browser.ts
│   │   │   ├── handlers.ts
│   │   │   ├── jobsHandlers.ts
│   │   │   ├── candidatesHandlers.ts
│   │   │   ├── assessmentsHandlers.ts
│   │   │   └── dashboardHandlers.ts
│   │   └── seed/                   # Seed data
│   │       ├── jobsSeed.ts
│   │       ├── candidateSeed.ts
│   │       └── assessmentsSeed.ts
│   │
│   ├── utils/                       # Utility functions
│   │   └── latency.ts              # Simulated network delay
│   │
│   ├── App.tsx                      # Root component with routing
│   ├── main.tsx                     # Application entry point
│   └── index.css                    # Global styles
│
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

***

## Key Features Breakdown

### 1. Jobs Management

**Features:**
- Create, edit, archive, and delete job postings
- Drag-and-drop reordering with optimistic updates
- Automatic rollback on failure (10% simulated failure rate)
- Server-like pagination (9 jobs per page)
- Advanced filtering by status, job type, and search terms
- Unique slug validation
- Deep linking support (`/jobs/:jobId`)

**Components:**
- `Jobs.tsx` - Main jobs page with grid/list view
- `JobModal.tsx` - Create/Edit job form
- `JobCard.tsx` - Individual job card component
- `DeleteConfirmationModal.tsx` - Delete confirmation

**Database Schema:**
```typescript
interface Job {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  description: string;
  requirements: string[];
  salary: string;
  location: string;
  jobType: 'Full-time' | 'Remote' | 'Part-time' | 'Contract';
  createdAt: Date;
}
```

### 2. Candidates Management

**Features:**
- Virtualized list handling 1000+ candidates
- Client-side search (name/email)
- Server-like filtering by stage
- Candidate profile with timeline
- Stage management (applied, screening, interview, offer, hired, rejected)
- Notes with mentions support
- Kanban board view (drag-and-drop between stages)
- Deep linking (`/candidates/:id`)

**Components:**
- `Candidates.tsx` - Candidates list view
- `CandidateProfile.tsx` - Detailed candidate view
- Candidate card components

**Database Schema:**
```typescript
interface Candidate {
  id: string;
  name: string;
  email: string;
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  jobId: string;
  phone: string;
  resume: string;
  notes: string[];
  appliedAt: Date;
  updatedAt: Date;
  coverLetter?: string;
  experience?: string;
  skills?: string[];
  education?: string;
}
```

### 3. Assessments System

**Features:**
- Assessment builder with multiple sections
- Question types: single-choice, multi-choice, short text, long text, numeric, file upload
- Live preview pane
- Form validation (required fields, numeric ranges, max length)
- Conditional questions logic
- Local persistence of builder state
- Candidate response storage

**Components:**
- `Assessments.tsx` - Assessments list
- `AssessmentBuilder.tsx` - Create/Edit assessments
- `AssessmentPreview.tsx` - Preview as candidate would see
- `AssessmentResults.tsx` - View submission results

**Database Schema:**
```typescript
interface Assessment {
  id: string;
  jobId: string;
  title: string;
  description: string;
  sections: Array<{
    id: string;
    title: string;
    questions: Question[];
  }>;
  createdAt: Date;
}

interface Question {
  id: string;
  type: 'single-choice' | 'multi-choice' | 'short-text' | 'long-text' | 'numeric' | 'file-upload';
  question: string;
  options?: string[];
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  conditionalOn?: {
    questionId: string;
    value: string | string[];
  };
}
```

### 4. Role-Based Access Control

**Implementation:**
- Context-based role management
- No authentication (demo mode)
- Role selection at login
- Protected routes based on role
- Automatic redirects

**Roles:**
- **HR Manager** - Full access to dashboard, jobs, candidates, assessments
- **Job Seeker** - Access to job browsing and applications only

***

## Architecture & Design Decisions

### State Management Strategy

**Local Component State:**
Used for UI-specific state like form inputs, modals, and temporary data.

**React Context:**
Used for global state like user role and authentication status.

**IndexedDB:**
Used as the single source of truth for all persistent data (jobs, candidates, assessments).

### API Simulation Approach

**Mock Service Worker (MSW):**
- Intercepts network requests at the service worker level
- Provides realistic API behavior
- Simulates latency (200-1200ms)
- Simulates failures (5-10% error rate on write operations)
- Enables offline-first development

**Benefits:**
- No backend required for demo
- Easy to test error scenarios
- Realistic network conditions
- Can be replaced with real API without code changes

### Data Persistence

**IndexedDB via Dexie.js:**
- Browser-native database
- Survives page refreshes
- Supports complex queries
- Handles large datasets efficiently

**Implementation Pattern:**
```
User Action → Axios Request → MSW Intercepts → DB Operation → Response
```

### Optimistic UI Updates

**Pattern Used:**
1. Update UI immediately (optimistic)
2. Make API call
3. On success: Keep UI as-is
4. On failure: Rollback to previous state + show error

**Example (Job Reordering):**
```typescript
const oldJobs = [...jobs];
setJobs(newOrder); // Optimistic

try {
  await api.reorder();
} catch (error) {
  setJobs(oldJobs); // Rollback
  toast.error('Failed to reorder');
}
```

### Component Design Philosophy

**Atomic Design:**
- Atoms: Button, Input, Badge
- Molecules: Card, Modal
- Organisms: JobCard, CandidateProfile
- Templates: Layout, HrLayout
- Pages: Jobs, Candidates, Assessments

**Composition over Inheritance:**
All components use functional components with hooks.

***

## API Endpoints (Simulated)

### Jobs API

```
GET    /jobs?search=&status=&jobType=&page=&pageSize=
POST   /jobs
GET    /jobs/:id
PATCH  /jobs/:id
PATCH  /jobs/:id/reorder
DELETE /jobs/:id
```

### Candidates API

```
GET    /candidates?search=&stage=&jobId=&page=&pageSize=
POST   /candidates
GET    /candidates/:id
PATCH  /candidates/:id
GET    /candidates/:id/timeline
DELETE /candidates/:id
```

### Assessments API

```
GET    /assessments
POST   /assessments
GET    /assessments/:id
PUT    /assessments/:id
POST   /assessments/:id/submit
DELETE /assessments/:id
```

### Dashboard API

```
GET    /dashboard/statistics
```

***

## Testing

### Manual Testing Checklist

**Jobs Module:**
- [ ] Create a new job
- [ ] Edit existing job
- [ ] Delete job with confirmation
- [ ] Archive/unarchive job
- [ ] Reorder jobs via drag-and-drop
- [ ] Test pagination
- [ ] Test search functionality
- [ ] Test filters (status, type)
- [ ] Verify unique slug validation

**Candidates Module:**
- [ ] View candidates list
- [ ] Search by name/email
- [ ] Filter by stage
- [ ] View candidate profile
- [ ] Update candidate stage
- [ ] Delete candidate

**Assessments Module:**
- [ ] Create new assessment
- [ ] Add sections and questions
- [ ] Edit existing assessment
- [ ] Preview assessment
- [ ] Delete assessment
- [ ] Test different question types

**Role-Based Access:**
- [ ] Login as HR
- [ ] Access all HR features
- [ ] Logout and login as Candidate
- [ ] Verify restricted access
- [ ] Test protected routes

### Testing Rollback Functionality

The drag-and-drop reorder has a 10% simulated failure rate. Test by:
1. Enable "Reorder Jobs" mode
2. Drag jobs multiple times
3. Observe occasional failures
4. Verify automatic rollback occurs

***

## Deployment

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy

### Option 2: Netlify

1. Connect GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy

### Option 3: GitHub Pages

```bash
npm run build
npm run deploy
```

### Build Optimization

The production build includes:
- Code splitting
- Tree shaking
- Minification
- Asset optimization
- Service worker for MSW

***

## Known Issues & Limitations

### Current Limitations

1. **No Real Backend**
   - All data is stored locally in browser
   - Data doesn't sync across devices
   - Browser cache clear = data loss

2. **No Real Authentication**
   - Role selection is for demonstration only
   - No actual security implementation

3. **Virtualization**
   - Candidate list virtualization is mentioned but may need implementation refinement

4. **File Upload**
   - File upload is stubbed (not functional)

5. **Assessment Conditional Logic**
   - Conditional questions are defined but not fully implemented in runtime

6. **Mobile Responsiveness**
   - Some complex views may need additional mobile optimization

### Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 14+)
- IE11: Not supported

***

## Future Enhancements

### Short-term Goals

1. **Email Notifications**
   - Simulate email sending for status changes
   - Application confirmations

2. **Advanced Search**
   - Elastic search-like functionality
   - Saved search filters

3. **Analytics Dashboard**
   - Charts and graphs
   - Hiring metrics
   - Time-to-hire analytics

4. **Export Functionality**
   - Export candidates to CSV
   - Print-friendly reports

### Long-term Goals

1. **Real Backend Integration**
   - Replace MSW with actual API
   - User authentication
   - Cloud storage

2. **Collaboration Features**
   - Multiple HR users
   - Comments and discussions
   - Team assignments

3. **Video Interviews**
   - Integration with video platforms
   - Recording and playback

4. **AI-Powered Features**
   - Resume parsing
   - Candidate matching
   - Interview scheduling

***

## Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- MSW team for excellent API mocking
- Dexie.js for IndexedDB wrapper
- All contributors and testers

***


## Project Status

Active Development - v1.0.0

Last Updated: October 30, 2025

***

Built with dedication by the Rajeev Sharma

[1](https://uideck.com/blog/free-react-templates)
[2](https://refine.dev/blog/react-admin-template/)
[3](https://www.creative-tim.com/templates/react)
[4](https://www.tability.io/templates/tags/react-developer)
[5](https://www.geeksforgeeks.org/mern/document-management-system-with-react-and-express-js/)
[6](https://github.com/johnkingzy/DocumentManagementSys)
[7](https://js.devexpress.com/React/Documentation/Guide/React_Components/Application_Template/)
