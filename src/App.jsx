import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';

// Import your components (Assuming file paths)
import Login from './components/Login'; // You need to create a simple Login form
import StudentSignup from './components/StudentSignup';
import AdminSignup from './components/AdminSignup';
import StudentDashboard from './components/StudentDashboard';
import StudentMess from './components/StudentMessDashboard'; // Rename as needed
import StudentRoom from './components/StudentRoomStatus'; // Rename as needed
import AdminInbox from './components/AdminInbox';
import AdminMess from './components/AdminMessDashboard'; // Rename as needed
import AdminAllocation from './components/AdminAllocationDashboard'; // Rename as needed

// --- 1. Sidebar Component ---
const Sidebar = ({ role, onLogout }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gray-900 min-h-screen text-white flex flex-col p-4 fixed">
      <h2 className="text-2xl font-bold mb-8 text-center text-blue-400">Hostel PRO</h2>
      
      <nav className="flex-1 space-y-2">
        {role === 'Student' ? (
          <>
            <Link to="/student/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">📢 Notice & Reports</Link>
            <Link to="/student/mess" className="block py-2 px-4 hover:bg-gray-700 rounded">🍛 Mess Dashboard</Link>
            <Link to="/student/room" className="block py-2 px-4 hover:bg-gray-700 rounded">🛏 Room Status</Link>
          </>
        ) : (
          <>
            <Link to="/admin/inbox" className="block py-2 px-4 hover:bg-gray-700 rounded">📥 Inbox & Notices</Link>
            <Link to="/admin/mess" className="block py-2 px-4 hover:bg-gray-700 rounded">📊 Mess Stats</Link>
            <Link to="/admin/allocation" className="block py-2 px-4 hover:bg-gray-700 rounded">🔑 Room Allocation</Link>
          </>
        )}
      </nav>

      <button onClick={handleLogout} className="bg-red-600 py-2 rounded mt-auto hover:bg-red-700">Logout</button>
    </div>
  );
};

// --- 2. Protected Route Wrapper ---
const ProtectedRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
  
  return children;
};

// --- 3. Main App Layout ---
const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <div className="flex">
        {/* Show Sidebar only if logged in */}
        {user && <Sidebar role={user.role} onLogout={handleLogout} />}

        {/* Main Content Area */}
        <div className={`flex-1 min-h-screen bg-gray-100 ${user ? 'ml-64' : ''}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<StudentSignup />} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="/" element={<Navigate to={user ? (user.role === 'Admin' ? '/admin/inbox' : '/student/dashboard') : '/login'} />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute allowedRole="Student">
                <StudentDashboard studentId={user?._id} />
              </ProtectedRoute>
            } />
            <Route path="/student/mess" element={
              <ProtectedRoute allowedRole="Student">
                <StudentMess studentId={user?._id} />
              </ProtectedRoute>
            } />
             <Route path="/student/room" element={
              <ProtectedRoute allowedRole="Student">
                <StudentRoom user={user} />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/inbox" element={
              <ProtectedRoute allowedRole="Admin">
                <AdminInbox />
              </ProtectedRoute>
            } />
             <Route path="/admin/mess" element={
              <ProtectedRoute allowedRole="Admin">
                <AdminMess hostelId={user?.hostelId} />
              </ProtectedRoute>
            } />
            <Route path="/admin/allocation" element={
              <ProtectedRoute allowedRole="Admin">
                <AdminAllocation hostelId={user?.hostelId} />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;