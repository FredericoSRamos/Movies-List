import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import SharedListPage from './pages/SharedListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import { NotificationProvider } from './context/NotificationContext';
import './App.css';

const PrivateRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const setAuth = (value) => {
    setIsAuthenticated(value);
  };

  return (
    <NotificationProvider>
      <Router>
        <div className="App">
          <Navbar isAuthenticated={isAuthenticated} setAuth={setAuth} />
          <Routes>
            <Route path="/login" element={<LoginPage setAuth={setAuth} />} />
            <Route path="/register" element={<RegisterPage setAuth={setAuth} />} />
            <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} />} />

            <Route path="/favorites" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <FavoritesPage />
              </PrivateRoute>
            } />
            
            <Route path="/shared/user/:userId" element={<SharedListPage />} />

            {/* Rota de fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;