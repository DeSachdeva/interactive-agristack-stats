import React, { useState, useEffect } from 'react';
import { ServicePanel } from './components/ServicePanel';
import { StatsView } from './components/StatsView';
import { SERVICES } from './data/services';
import { BarChart3, LayoutDashboard, Heart, Sun, Moon } from 'lucide-react';
import './App.css';

const CELEBRATIVE_MESSAGES = [
  "🎉 Splendid Choice! Thousands of Indian farmers in your area are driving yield growth using this service.",
  "🌾 Outstanding decision! Accessing this empowers your household and ensures resource efficiency.",
  "✨ Excellent choice! Many modern farmers have transformed their cultivation with this exact input.",
  "🌟 Brilliant choice! This is an essential step towards securing sustainable and profitable farming.",
  "🚀 Great Choice! This is one of the fastest-growing services chosen by Indian farmers today."
];

const CONFETTI_COLORS = ['#2ecc71', '#e74c3c', '#f1c40f', '#3498db', '#9b59b6', '#e67e22', '#1abc9c'];

export default function App() {
  const [activeTab, setActiveTab] = useState('panel'); // 'panel' | 'stats'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('agristack_theme') || 'light';
  });

  // Click counts state
  const [counts, setCounts] = useState(() => {
    const saved = localStorage.getItem('agristack_clicks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading saved clicks", e);
      }
    }
    const initial = {};
    SERVICES.forEach(s => {
      if (s.active) {
        initial[s.id] = 0;
      }
    });
    return initial;
  });

  const [toasts, setToasts] = useState([]);
  const [confettiParticles, setConfettiParticles] = useState([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('agristack_clicks', JSON.stringify(counts));
  }, [counts]);

  // Sync theme
  useEffect(() => {
    localStorage.setItem('agristack_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleServiceClick = (serviceId) => {
    const service = SERVICES.find(s => s.id === serviceId);
    if (!service) return;

    setCounts(prev => ({
      ...prev,
      [serviceId]: (prev[serviceId] || 0) + 1
    }));

    // Trigger celebrative toast
    const randomMsg = CELEBRATIVE_MESSAGES[Math.floor(Math.random() * CELEBRATIVE_MESSAGES.length)];
    const id = Date.now();
    const newToast = {
      id,
      message: randomMsg,
      color: service.color
    };
    setToasts(prev => [...prev, newToast]);

    // Trigger confetti particles
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: `${id}-${i}`,
      left: Math.random() * 100, // random X position across screen width
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      angle: (Math.random() * 60) - 30, // tilt angle -30 to 30 deg
      delay: Math.random() * 0.4, // delayed explosion flow
      speed: 1 + Math.random() * 1.5, // 1 to 2.5 seconds flight speed
      shape: Math.random() > 0.5 ? 'rect' : 'circle'
    }));

    setConfettiParticles(prev => [...prev, ...newParticles]);

    // Clean up toasts & particles
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);

    setTimeout(() => {
      setConfettiParticles(prev => prev.filter(p => !p.id.startsWith(id)));
    }, 3000);
  };

  const handleReset = () => {
    const cleared = {};
    SERVICES.forEach(s => {
      if (s.active) {
        cleared[s.id] = 0;
      }
    });
    setCounts(cleared);
  };

  const totalClicks = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className={`app-shell theme-${theme}`}>
      {/* Background decoration grid */}
      <div className="bg-grid"></div>

      {/* Top Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="brand-header">
            <div className="logo-group">
              <img 
                src="/images/agristack-logo.png" 
                alt="AgriStack Logo" 
                className="logo-main" 
              />
              <div className="logo-divider"></div>
              <img 
                src="/images/moafw-logo.png" 
                alt="Ministry of Agriculture Logo" 
                className="logo-sub" 
              />
            </div>
          </div>
          
          <div className="nav-controls">
            <button 
              className={`nav-link ${activeTab === 'panel' ? 'active' : ''}`}
              onClick={() => setActiveTab('panel')}
            >
              <LayoutDashboard size={18} />
              <span>Services Panel</span>
            </button>
            <button 
              className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              <BarChart3 size={18} />
              <span>Stats & Charts</span>
              {totalClicks > 0 && (
                <span className="total-badge">{totalClicks}</span>
              )}
            </button>

            {/* Theme Toggle Button */}
            <button 
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-container">
          <div className="title-section text-center">
            <h1 className="main-heading">
              What services would you avail <br className="br-desktop" />
              as a farmer using <span className="highlight-text">Farmer ID</span>?
            </h1>
          </div>

          {activeTab === 'panel' ? (
            <ServicePanel 
              counts={counts}
              onServiceClick={handleServiceClick}
              totalClicks={totalClicks}
            />
          ) : (
            <StatsView 
              counts={counts}
              onReset={handleReset}
              totalClicks={totalClicks}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p className="flex-center">
          Made with <Heart size={14} className="heart-icon" /> for Indian Agriculture • Agristack Dashboard © 2026
        </p>
      </footer>

      {/* Confetti Ribbon Particles Overlay */}
      {confettiParticles.map(p => (
        <div 
          key={p.id}
          className={`confetti-particle shape-${p.shape}`}
          style={{
            '--color': p.color,
            '--left': `${p.left}%`,
            '--angle': `${p.angle}deg`,
            '--delay': `${p.delay}s`,
            '--speed': `${p.speed}s`
          }}
        />
      ))}

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className="toast-card animate-slide-in celebrative"
            style={{ borderLeftColor: toast.color }}
          >
            <div className="toast-dot" style={{ backgroundColor: toast.color }}></div>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
