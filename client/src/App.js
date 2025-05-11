import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ConnectPage from './components/FacebookConnect/ConnectPage';
import DisconnectPage from './components/FacebookConnect/DisconnectPage';
import AgentDashboard from './pages/AgentDashboard';
import authService from './services/auth.service';

// React Router future flags
const routerFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

// Private route component
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!authService.getCurrentUser();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public route component
const PublicRoute = ({ children }) => {
  const isAuthenticated = !!authService.getCurrentUser();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router future={routerFutureConfig}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <AgentDashboard />
          </PrivateRoute>
        } />
        
        <Route path="/connect" element={
          <PrivateRoute>
            <ConnectPage />
          </PrivateRoute>
        } />
        
        <Route path="/disconnect" element={
          <PrivateRoute>
            <DisconnectPage />
          </PrivateRoute>
        } />
        
        {/* Redirect root to login or dashboard based on auth status */}
        <Route path="/" element={
          authService.getCurrentUser() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App; 