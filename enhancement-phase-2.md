## 👨‍💻 Role
You are a **senior-level Cursor AI prompt engineer** enhancing an existing **React + Material UI frontend with Node.js + Express + MySQL backend Admin Portal**, based on enhancement-phase-1.md (already completed successfully).

## 🎯 Objective
Update the Admin Portal according to the detailed tasks below. Ensure:
- [ ] Zero bugs or regressions
- [ ] No existing functionality is broken
- [ ] Code and UI meet **production-level standards** followed by top tech companies
- [ ] Every change is done automatically — no back-and-forth queries
- [ ] Each task is **checkbox-tracked** to reflect progress clearly
- [ ] UI follows a **modern, professional admin panel** style (search and apply best-rated UI patterns)

---

## 🔁 General Changes Across All Modules
- [ ] Replace hard delete with soft delete capturing: `deleted_by`, `deleted_at`, `created_at`, etc.
- [ ] Remove `image URL` fields from Team, Portfolio, Blog
- [ ] Add local image upload (PNG, JPG) with clean preview UI
- [ ] Display uploaded images inside data tables
- [ ] Implement sorting and pagination in all data tables (no errors)
- [ ] Add serial number/index column in all tables
- [ ] Remove Signup functionality from Auth module
- [ ] Improve Forgot Password to work smoothly with tokenized reset logic (no console error)
- [ ] Remove default validations and add custom form validations site-wide

---

## 👤 Users Module
- [ ] Add **Active/Inactive** status toggle with backend integration
- [ ] Hide Users module from non-admin roles
- [ ] Action Column:
  - [ ] Eye icon to view details
  - [ ] Three-dot icon with popup: Edit + Delete
- [ ] Inline view: show full details on screen (not modal)
- [ ] Add profile image upload
- [ ] Show profile image in user header area
- [ ] Enable profile image change functionality

---

## 🧑‍🤝‍🧑 Team Module
- [ ] Add **Active/Inactive** toggle with proper backend functionality
- [ ] Action Column:
  - [ ] Eye icon to view details
  - [ ] Three-dot menu: Edit + Delete popup
- [ ] Inline viewing of member details
- [ ] Add Team Member Form:
  - [ ] Comment/remove `order` field
  - [ ] Reorder fields: `Name ➝ Email ➝ other ➝ Bio`
  - [ ] Add HTML formatter in `Bio` field
  - [ ] Apply robust custom validations (no default browser validations)

---

## 📝 Blog Module
- [ ] Add **Active/Inactive** toggle fully functional
- [ ] Action Column:
  - [ ] Eye icon to view
  - [ ] Three-dot menu with Edit/Delete popup
- [ ] Inline detail view in screen (no modal)
- [ ] Add Blog Form:
  - [ ] Remove image URL ➝ add file upload (PNG/JPG)
  - [ ] Add HTML formatter in `Content` field at bottom
  - [ ] Field Order: `Name ➝ Email ➝ others ➝ Content`
  - [ ] Remove `description`, `author`, `tags`
  - [ ] Add `created_by` and `created_at` with datepicker
  - [ ] Implement custom validations (no raw/default errors)

---

## 💼 Portfolio Module
- [ ] Add **Active/Inactive** toggle
- [ ] Action Column:
  - [ ] Eye icon to view
  - [ ] Three-dot popup menu (Edit/Delete)
- [ ] Inline project details view
- [ ] Add Project Form:
  - [ ] Remove image URL ➝ Add file upload
  - [ ] Add HTML formatter in `Overview` field (last)
  - [ ] Reorder: `Name ➝ Website ➝ Overview`
  - [ ] Add robust custom validation

---

## 🧠 Final Instructions to Cursor AI
- [ ] Read this file completely and perform every enhancement step-by-step
- [ ] Apply changes directly without interaction
- [ ] After completing a task, mark its checkbox ✅
- [ ] If any bug or error arises during edit, **fix it immediately without halting**
- [ ] Style all UI elements as per **top-rated modern admin panels** (e.g., AdminKit, Materially, Fuse, etc.)
- [ ] Code must be readable, modular, maintainable, and match enterprise code structure

---

## 📥 Save Location
> Save this file as: `enhancement-phase-2.md` in the root directory of the project.
