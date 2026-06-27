# Bliss Autos - Car Dealership Web Application

Welcome to the **Bliss Autos** project. This is a web application for a car dealership, allowing customers to view, search, and manage a vehicle inventory, register and login accounts, and submit feedback.

## Project Structure

The project is split into a frontend client and a Node.js backend:

### Frontend
The frontend resides in the [client/](file:///c:/Users/Admin/First%20project/Project-/client/) directory:
*   [client/Bliss autos.html](file:///c:/Users/Admin/First%20project/Project-/client/Bliss%20autos.html) - The homepage of the dealership.
*   [client/Inventory.html](file:///c:/Users/Admin/First%20project/Project-/client/Inventory.html) - Lists available vehicle inventory and supports search/filtering.
*   [client/about.html](file:///c:/Users/Admin/First%20project/Project-/client/about.html) - Information about the dealership.
*   [client/contact.html](file:///c:/Users/Admin/First%20project/Project-/client/contact.html) - A contact page with a submission form.
*   [client/Register.html](file:///c:/Users/Admin/First%20project/Project-/client/Register.html) - User registration page.
*   [client/login.html](file:///c:/Users/Admin/First%20project/Project-/client/login.html) - User login page.
*   [client/Blisss autos.css](file:///c:/Users/Admin/First%20project/Project-/client/Blisss%20autos.css) - Styling sheet.
*   [client/Bliss.js](file:///c:/Users/Admin/First%20project/Project-/client/Bliss.js) - Script defining local inventory array and searching logic.
*   [client/register.js](file:///c:/Users/Admin/First%20project/Project-/client/register.js) & [client/login.js](file:///c:/Users/Admin/First%20project/Project-/client/login.js) - Authentication helper scripts.
*   [client/images/](file:///c:/Users/Admin/First%20project/Project-/client/images/) - Contains vehicle image assets.

### Backend
The backend resides in the [server/](file:///c:/Users/Admin/First%20project/Project-/server/) directory:
*   [server/server.js](file:///c:/Users/Admin/First%20project/Project-/server/server.js) - The Express server entry point. Connects to MySQL and exposes API endpoints for inventory search, registration, and login.
*   [server/config/db.js](file:///c:/Users/Admin/First%20project/Project-/server/config/db.js) - Database connection configuration.
*   [server/db/schemas/](file:///c:/Users/Admin/First%20project/Project-/server/db/schemas/) - SQL schemas and tables.
*   [server/package.json](file:///c:/Users/Admin/First%20project/Project-/server/package.json) - Contains backend dependencies and start scripts.
*   [server/.env](file:///c:/Users/Admin/First%20project/Project-/server/.env) - Local configuration parameters.

## Getting Started

### Database Setup
1. Create a MySQL database named `bliss_autos`.
2. Import the database schemas located under [server/db/schemas/](file:///c:/Users/Admin/First%20project/Project-/server/db/schemas/).
3. Update connection details inside `server/.env`.

### Run Local Development Server
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:3000`.

### View Frontend
Open the static pages (e.g. `client/Bliss autos.html`) in your browser, or configure the server to host static assets under production mode.
