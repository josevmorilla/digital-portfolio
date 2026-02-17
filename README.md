# Digital Portfolio

My personal portfolio website built with React and Express.js. View it live at [josevmorilla.me](https://www.josevmorilla.me).

## Overview

A bilingual (English/French) portfolio that showcases my projects, skills, work experience, education, and hobbies. Visitors can leave testimonials and send me messages through a contact form. All content is managed through a private dashboard.

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Express.js, PostgreSQL, Prisma ORM
- **Hosting:** Vercel (frontend), Railway (backend)

## Features

- Bilingual content (English and French)
- Project gallery with descriptions and links
- Skills overview with categories
- Work experience and education history
- Testimonial submissions with approval workflow
- Contact form
- Resume download
- Responsive design for all devices

## Running Locally

```bash
git clone https://github.com/josevmorilla/digital-portfolio.git
cd digital-portfolio
npm install
cd frontend && npm install && cd ..
```

Create a `.env` file with your database connection and start both servers:

```bash
npm run dev              # Backend
cd frontend && npm run dev   # Frontend
```

## License

ISC
