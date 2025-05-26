import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AboutUs from './pages/AboutUs';
import Menu from './pages/Menu';
import OrderedItems from './pages/OrderedItems';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Protect routes except /aboutus, /login, and /signup
function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const publicPaths = ['/aboutus', '/login', '/signup'];

  if (!user && !publicPaths.includes(location.pathname)) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <RequireAuth>
          <Routes>
            <Route path="/" element={<Navigate to="/aboutus" />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/ordereditems" element={<OrderedItems />} />
            <Route path="/profile" element={<Profile />} />

            {/* Protected routes go here */}
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          </Routes>
        </RequireAuth>
      </Router>
    </AuthProvider>
  );
}

export default App;
