## 🚀 Phase 3: Modular UI & Form Layout Restructuring

This document tracks the progress of Phase 3 enhancements for the Admin Portal. The goal is to upgrade Add/Edit pages across all modules to match a modern, high-rated UI.

---

### ✅ Tasks List

#### 🔁 Global Form Page Layout Refactor:
- [ ] Create separate "Add" pages for all modules: `AddTeamMemberPage`, `AddBlogPage`, `AddPortfolioPage`, and `AddUserPage`.
- [ ] Create corresponding "Edit" pages for all modules with the same structure as "Add" pages.
- [ ] Remove unused spacing from the body on all form pages and make sure the form takes full width minus sidebar and header.
- [ ] Use Material UI's `Grid` system or a custom responsive layout that matches the reference UI.
- [ ] Ensure consistent spacing, section headers, and field alignment.

#### 🧑‍🤝‍🧑 Team Module:
- [x] Create `AddTeam.tsx` using the modern UI layout.
- [x] Create `EditTeam.tsx` with pre-filled form values.
- [x] Refactor the layout using Material UI `Box`, `Card`, and `Grid` to match the new design.
- [x] Ensure validations and field orders as defined in `enhancement-phase-2.md`.

#### 📝 Blog Module:
- [x] Create `AddBlog.tsx` with full-width clean layout.
- [x] Create `EditBlog.tsx` with pre-filled editable blog post content.
- [x] Ensure uploaded image UI and HTML content formatter are seamlessly integrated.
- [x] Use modern card-based layout similar to the reference image.

#### 💼 Portfolio Module:
- [x] Create `AddPortfolio.tsx` following the new UI structure.
- [x] Create `EditPortfolio.tsx` reusing the same component structure.
- [x] Validate that form submission, edit functionality, and file uploads work seamlessly.
- [x] Maintain consistency with the layout and field validations.

#### 👤 Users Module:
- [x] Create `AddUser.tsx` using full-width responsive layout.
- [x] Create `EditUser.tsx` with editable form, image preview, and role assignment.
- [x] Display validation errors as non-blocking, inline messages with proper styling.
- [x] Ensure profile image upload and role-based form field rendering.

#### 📁 Code Structure Guidelines:
- [ ] Components should be modular, preferably placed in `src/components/forms/{module}` directories.
- [ ] Separate form schema, validation schema, and API logic into dedicated service files.
- [ ] Avoid inline CSS — use MUI's `sx` prop or global style configuration.
- [ ] Add a common `FormContainer.tsx` reusable wrapper if needed for consistency. 