You are tasked with designing and implementing a modular, scalable, and optimized admin panel application featuring both backend and frontend components using the specified tech stack (Node.js with Express.js and MySQL for backend; React.js with Material UI for frontend). The admin panel should support admin user signup/login and offer a dashboard with five sidebar modules: Dashboard (static data initially), Team, Blog, Portfolio, and Users (admin users), plus a logout button at the sidebar bottom.

Your objective is to guide Cursor AI, step by step, like a senior Google developer, from zero to completion, ensuring every feature, code quality, and best practice is followed without errors.

Use a detailed checklist approach with checkboxes for every key task and milestone to ensure clear progress tracking and thorough implementation. All steps must be methodical, checkpoint-based, and visually tick-marked on progression.

---

## 🔁 Additional Instructions

- ✅ Use Cursor's full AI toolset (`edit_file`, `ask`, `fix`, `run_code`) to generate, validate, and refine the application without requiring external help.
- ✅ After each major module (e.g., Team, Blog, etc.), provide a milestone feedback loop: ✅ What is done, ❌ what is pending, and suggest 1–2 improvements.
- ✅ Apply error handling best practices:
  - ✅ Use consistent HTTP status codes (200, 201, 400, 401, 404, 500)
  - ✅ Add meaningful API error messages and frontend alerts
  - ✅ Backend should use centralized error-handling middleware
  - ✅ Frontend must show user-friendly validation and error states
- ✅ Use the following dynamic JSON data sources for Blog, Portfolio, and Team modules. These must be saved into the backend MySQL database and used for CRUD:
  - ✅ Blog: https://dhaval-patel-ke.github.io/kernel-images/kernel/blog.json
  - ✅ Portfolio: https://dhaval-patel-ke.github.io/kernel-images/kernel/portfolio.json
  - ✅ Team: https://dhaval-patel-ke.github.io/kernel-images/kernel/teams.json

---

# ✅ Detailed Instructions and Steps for Cursor AI

- [x] **1. Preparation and Understanding:**
  - [x] Analyze the provided JSON data files for Blog, Portfolio, and Team modules to fully understand the data structures and relationships.
  - [x] Define a precise database schema in MySQL that exactly matches the JSON data formats.

- [x] **2. Backend Development:**
  - [x] Create a modular Express.js backend with:
    - [x] CRUD RESTful APIs for Team, Blog, Portfolio, and Users modules
    - [x] Authentication system for admin users (signup/login) with secure password handling and token-based authentication
  - [x] Implement validation that matches JSON data formats for all operations
  - [x] Develop seed scripts to populate the MySQL database with initial JSON data
  - [x] Test each API endpoint thoroughly, with examples of requests and responses; ensure zero errors

- [x] **3. Frontend Development:**
  - [x] Build the React.js frontend dashboard incorporating Material UI with:
    - [x] Responsive and modern UI featuring a collapsible sidebar with these five modules:
      - [x] Dashboard (static data for now)
      - [x] Team
      - [x] Portfolio
      - [x] Blog
      - [x] Users
    - [x] Logout button placed at the bottom of the sidebar
  - [x] For each module:
    - [x] Display data in tables with pagination, sorting, and searching capabilities
    - [x] Provide bulk action options (e.g., bulk delete)
    - [x] Show functional back button navigation
    - [x] Include Add button that opens forms for creating new entries
    - [x] Forms must:
      - [x] Match the data structure exactly
      - [x] Have validations consistent with the backend and data formats
      - [x] Support edit, view, delete options at the top right corner of the table or individual rows
  - [x] Connect frontend components properly to backend APIs ensuring smooth data flow and error handling

- [x] **4. Code Quality and Maintainability:**
  - [x] Ensure all code is clear, well-commented, and follows best practices akin to senior developers
  - [x] Structure files and modules in a scalable and maintainable fashion

- [x] **5. Documentation:**
  - [x] Prepare in-depth documentation covering:
    - [x] Project setup instructions
    - [x] Database schema details and seed data import
    - [x] API endpoint definitions with sample requests/responses
    - [x] Frontend usage guide
    - [x] Authentication and security details

- [x] **6. Continuous Improvement Workflow:**
  - [x] Maintain three separate files for Cursor AI:
    - [x] File 1: All code and configuration files used to build the admin panel
    - [x] File 2: Your own version of the file mirroring File 1 to cross-verify and check progress against requirements step-by-step
    - [x] File 3: Log file to record issues encountered, research notes, and market analysis of other compatible admin panel solutions — use these findings to drive improvements

- [x] **7. Final Validation:**
  - [x] Cross-check both development files against the checklist
  - [x] Implement improvements identified from research and user feedback into the main project
  - [x] Conduct final round of testing for functionality, UX consistency, and security compliance

---

## ✅ Output Format

- ✅ Deliver a documented, modular backend API codebase with tested CRUD endpoints and authentication  
- ✅ Provide SQL schema scripts and JSON-seeded data import scripts  
- ✅ Deliver a fully functional React.js + Material UI frontend project demonstrating the admin panel UI and modular features  
- ✅ Include comprehensive documentation as outlined  
- ✅ Present the three files for project tracking and iterative improvement as detailed in step 6

---

This prompt is to be followed precisely with methodical, checkbox-verified progression, milestone feedback loops, reasoning for each stage, error handling discipline, and clear, commented code to ensure Cursor AI can create a flawless, enterprise-grade admin panel from scratch without omissions or errors.
