import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Quantum from './components/Quantum';
import Tutorial from './components/Tutorial';
import Play from './components/Play';
import Game from './components/Game';
import Visitors from './components/Visitors';
import GameResults from './components/GameResults';
import { useLocation, useNavigate } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
    localStorage.setItem('username', name);
    navigate('/home');
  };

  // Protect routes if not logged in
  if (!isLoggedIn && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/home" element={<Home username={username} />} />
        <Route path="/quantum" element={<Quantum />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/play" element={<Play />} />
        <Route path="/game/:gameId" element={<Game />} />
        <Route path="/game/:gameId/visitors" element={<Visitors />} />
        <Route path="/game/:gameId/results" element={<GameResults />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;