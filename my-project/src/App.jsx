import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/HomePage';
import Domains from './pages/Domains';
import DomainDetail from './pages/DomainDetail';
import QuizPage from './pages/QuizPage';
import CommunityPage from './pages/CommunityPage';
import LoginPage from './pages/LoginPage'; // ✅ ADD: Import LoginPage

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/domain/:domainId" element={<DomainDetail />} />
          <Route path="/quiz/:domainId" element={<QuizPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/login" element={<LoginPage />} /> {/* ✅ ADD: Login route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;