## 👨‍💻 Role
You are a **senior-level Cursor AI prompt engineer** enhancing an existing **React + Material UI frontend with Node.js + Express + MySQL backend Admin Portal**, based on enhancement-phase-1.md (already completed successfully).

## 🎯 Objective
Update the Admin Portal according to the detailed tasks below. Ensure:
- [x] Zero bugs or regressions
- [x] No existing functionality is broken
- [x] Code and UI meet **production-level standards** followed by top tech companies
- [x] Every change is done automatically — no back-and-forth queries
- [x] Each task is **checkbox-tracked** to reflect progress clearly
- [x] UI follows a **modern, professional admin panel** style (search and apply best-rated UI patterns)

---

## 🔁 General Changes Across All Modules
- [x] Replace hard delete with soft delete capturing: `deleted_by`, `deleted_at`, `created_at`, etc.
- [x] Remove `image URL` fields from Team, Portfolio, Blog
- [x] Add local image upload (PNG, JPG) with clean preview UI
- [x] Display uploaded images inside data tables
- [x] Implement sorting and pagination in all data tables (no errors)
- [x] Add serial number/index column in all tables
- [ ] Remove Signup functionality from Auth module
- [ ] Improve Forgot Password to work smoothly with tokenized reset logic (no console error)
- [x] Remove default validations and add custom form validations site-wide
- [x] Allow all non-admin users to perform CRUD operations on Team, Blog, and Portfolio modules (except Users module)
- [x] Restrict Users module (view, edit, delete, add) to admin users only
- [x] Hide Users module from sidebar for non-admin users
- [x] Fix dashboard stats: non-admin users see all stats except Users, no 403 error
- [x] All forms: Optional fields can be left empty or cleared and saved without error (backend and frontend)
- [x] Convert empty string fields to null in backend before saving (for all modules)

---

## 👤 Users Module
- [x] Add **Active/Inactive** status toggle with backend integration
- [x] Hide Users module from non-admin roles
- [ ] Action Column:
  - [ ] Eye icon to view details
  - [ ] Three-dot icon with popup: Edit + Delete
- [ ] Inline view: show full details on screen (not modal)
- [x] Add profile image upload
- [ ] Show profile image in user header area
- [ ] Enable profile image change functionality
- [x] Only admin can perform CRUD operations on users

---

## 🧑‍🤝‍🧑 Team Module
- [x] Add **Active/Inactive** toggle with proper backend functionality
- [ ] Action Column:
  - [ ] Eye icon to view details
  - [ ] Three-dot menu: Edit + Delete popup
- [ ] Inline viewing of member details
- [ ] Add Team Member Form:
  - [ ] Comment/remove `order` field
  - [ ] Reorder fields: `Name ➝ Email ➝ other ➝ Bio`
  - [ ] Add HTML formatter in `Bio` field
  - [x] Apply robust custom validations (no default browser validations)
- [x] All users (admin and non-admin) can add, edit, delete team members
- [x] Team form: Optional fields can be left empty or cleared and saved

---

## 📝 Blog Module
- [x] Add **Active/Inactive** (Published/Draft) toggle fully functional
- [ ] Action Column:
  - [ ] Eye icon to view
  - [ ] Three-dot menu with Edit/Delete popup
- [ ] Inline detail view in screen (no modal)
- [x] Add Blog Form:
  - [x] Remove image URL ➝ add file upload (PNG/JPG)
  - [ ] Add HTML formatter in `Content` field at bottom
  - [ ] Field Order: `Name ➝ Email ➝ others ➝ Content`
  - [ ] Remove `description`, `author`, `tags`
  - [ ] Add `created_by` and `created_at` with datepicker
  - [x] Implement custom validations (no raw/default errors)
- [x] All users (admin and non-admin) can add, edit, delete blog posts
- [x] Blog form: Optional fields can be left empty or cleared and saved

---

## 💼 Portfolio Module
- [x] Add **Active/Inactive** (Active/Exit) toggle
- [ ] Action Column:
  - [ ] Eye icon to view
  - [ ] Three-dot popup menu (Edit/Delete)
- [ ] Inline project details view
- [x] Add Project Form:
  - [x] Remove image URL ➝ Add file upload
  - [ ] Add HTML formatter in `Overview` field (last)
  - [ ] Reorder: `Name ➝ Website ➝ Overview`
  - [x] Add robust custom validation
- [x] All users (admin and non-admin) can add, edit, delete portfolio items
- [x] Portfolio form: Optional fields can be left empty or cleared and saved

---

## 🧠 Final Instructions to Cursor AI
- [x] Read this file completely and perform every enhancement step-by-step
- [x] Apply changes directly without interaction
- [x] After completing a task, mark its checkbox ✅
- [x] If any bug or error arises during edit, **fix it immediately without halting**
- [x] Style all UI elements as per **top-rated modern admin panels** (e.g., AdminKit, Materially, Fuse, etc.)
- [x] Code must be readable, modular, maintainable, and match enterprise code structure
