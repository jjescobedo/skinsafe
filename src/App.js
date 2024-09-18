import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  return (
    <div>
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    </div>
  );
}

export default App;