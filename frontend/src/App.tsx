import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import Team from './pages/Team';
import Blog from './pages/Blog';
import Portfolio from './pages/Portfolio';
import ProtectedRoute from './components/ProtectedRoute';
import Users from './pages/Users';
import TeamView from './pages/TeamView';
import BlogView from './pages/BlogView';
import PortfolioView from './pages/PortfolioView';
import AddUser from './pages/AddUser';
import EditUser from './pages/EditUser';
import AddTeam from './pages/AddTeam';
import EditTeam from './pages/EditTeam';
import AddBlog from './pages/AddBlog';
import EditBlog from './pages/EditBlog';
import AddPortfolio from './pages/AddPortfolio';
import EditPortfolio from './pages/EditPortfolio';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
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
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
