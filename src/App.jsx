import React, { useState, useEffect } from 'react';
import { ServicePanel } from './components/ServicePanel';
import { StatsView } from './components/StatsView';
import { SERVICES } from './data/services';
import { BarChart3, LayoutDashboard, Heart } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('panel'); // 'panel' | 'stats'
  
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

  useEffect(() => {
    localStorage.setItem('agristack_clicks', JSON.stringify(counts));
  }, [counts]);

  const handleServiceClick = (serviceId) => {
    const service = SERVICES.find(s => s.id === serviceId);
    if (!service) return;

    setCounts(prev => ({
      ...prev,
      [serviceId]: (prev[serviceId] || 0) + 1
    }));

    const id = Date.now();
    const newToast = {
      id,
      message: `Interest registered in ${service.title}!`,
      color: service.color
    };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2500);
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
    <div className="app-shell">
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
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-container">
          <div className="title-section text-center">
            <h1 className="main-heading">
              What services would you avail <br className="br-desktop" />
              as a farmer using <span className="highlight-text">AgriStack</span>?
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

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className="toast-card animate-slide-in"
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
