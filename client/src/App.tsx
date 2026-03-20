import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/dashboard" element={<div className="p-8 text-2xl font-bold">Dashboard (Coming soon...)</div>} />
      </Routes>
    </Router>
  );
};

export default App;