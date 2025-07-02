import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout/Layout";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import Team from "./pages/Team/List";
import Blog from "./pages/Blog/List";
import Portfolio from "./pages/Portfolio/List";
import ProtectedRoute from "./components/ProtectedRoute";
import Users from "./pages/Users/List";
import TeamView from "./pages/Team/View";
import BlogView from "./pages/Blog/View";
import PortfolioView from "./pages/Portfolio/View";
import AddUser from "./pages/Users/Add";
import EditUser from "./pages/Users/Edit";
import AddTeam from "./pages/Team/Add";
import EditTeam from "./pages/Team/Edit";
import AddBlog from "./pages/Blog/Add";
import EditBlog from "./pages/Blog/Edit";
import AddPortfolio from "./pages/Portfolio/Add";
import EditPortfolio from "./pages/Portfolio/Edit";
import ContactSubmissions from "./pages/Contact/Submissions";
import ContactSubmissionView from "./pages/Contact/SubmissionView";
import SettingsPage from "./pages/Settings/SettingsPage";
import NotificationEmails from "./pages/Settings/NotificationEmails";
import ChangePasswordPage from "./pages/Settings/ChangePasswordPage";
import ErrorPage from "./pages/Settings/ErrorPage";

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Navigate to="/dashboard" replace />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Team />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Blog />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Portfolio />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Users />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/add"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AddUser />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/edit/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EditUser />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/team/view/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <TeamView />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog/view/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <BlogView />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio/view/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PortfolioView />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/team/add"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AddTeam />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/team/edit/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EditTeam />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog/add"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AddBlog />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog/edit/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EditBlog />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio/add"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AddPortfolio />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio/edit/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EditPortfolio />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EditUser isProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact-submissions"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ContactSubmissions />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ContactSubmissionView />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SettingsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/notification-emails"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NotificationEmails />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/change-password"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ChangePasswordPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
