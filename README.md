# Anish Ojha Tuition Classes — MERN

A professional tutoring website for Anish Ojha, built with:
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB / Mongoose

## Features
- Responsive tutor landing page
- About section with B.Tech and academic performance
- Subjects/classes section (all subjects up to Class 8)
- Lucknow-only service area
- Contact form
- Backend API for enquiry submissions
- MongoDB persistence when configured

## Run locally

### Backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

For local development, use:
```env
VITE_API_URL=http://localhost:5000/api
```

For production deployment, leave `VITE_API_URL` unset and the app will automatically use the same-origin `/api` path.

### MongoDB
In `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/anish_tuition
JWT_SECRET=replace_with_a_secure_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=yourStrongPassword
```

If MongoDB is not configured, the API will still start, but enquiries will not be persisted.

## Deployment guide

### Production build
```bash
cd frontend
npm install
npm run build
```

The built frontend is served from the backend static files in `backend/public` or `frontend/dist` when the Node app runs. The backend should be deployed with environment variables set in production.

### Required production env vars
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_secure_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=yourStrongPassword
```

Then start the backend with:
```bash
cd backend
npm install
npm start
```


## SEO improvements included
- Semantic section structure and descriptive page title
- Meta description and relevant local-search keywords
- Canonical URL
- Open Graph and Twitter metadata
- Schema.org Person structured data
- robots.txt
- XML sitemap
- Mobile responsive layout
- Click-to-call and email CTAs
- Local Lucknow service-area language

### Important before deployment
Replace `https://anishojhatuition.in/` in `frontend/index.html`, `frontend/public/robots.txt`, and `frontend/public/sitemap.xml` with your real domain if you choose a different domain.

For stronger local SEO after deployment:
1. Verify the site in Google Search Console.
2. Submit the sitemap.
3. Create a Google Business Profile if you have an eligible in-person tutoring location/service.
4. Add genuine service-area details and reviews; do not publish fake reviews.
