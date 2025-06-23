 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskBoard from './components/TaskBoard';
import Login from './components/Login';
import Signup from './components/Signup';
import VerifyOtp from './components/Verifyotp';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} /> 
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route
            path="/" 
            element={
              <ProtectedRoute>
                <TaskBoard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
