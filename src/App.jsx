import React, { useState, useEffect } from 'react';
import { ServicePanel } from './components/ServicePanel';
import { StatsView } from './components/StatsView';
import { SERVICES } from './data/services';
import { TRANSLATIONS } from './data/translations';
import { BarChart3, LayoutDashboard, Heart, Sun, Moon, Languages, X } from 'lucide-react';
import './App.css';

const CONFETTI_COLORS = ['#2ecc71', '#e74c3c', '#f1c40f', '#3498db', '#9b59b6', '#e67e22', '#1abc9c'];

export default function App() {
  const [activeTab, setActiveTab] = useState('panel'); // 'panel' | 'stats'
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('agristack_theme') || 'light';
  });

  // Language state: 'en' | 'hi'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('agristack_lang') || 'en';
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

  const [selectedServices, setSelectedServices] = useState([]);
  const [activeMessages, setActiveMessages] = useState({}); // { serviceId: msgIndex }
  const [confettiParticles, setConfettiParticles] = useState([]);

  // Sync click counts to localStorage
  useEffect(() => {
    localStorage.setItem('agristack_clicks', JSON.stringify(counts));
  }, [counts]);

  // Sync theme
  useEffect(() => {
    localStorage.setItem('agristack_theme', theme);
  }, [theme]);

  // Sync language
  useEffect(() => {
    localStorage.setItem('agristack_lang', lang);
  }, [lang]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  const handleServiceClick = (serviceId) => {
    const service = SERVICES.find(s => s.id === serviceId);
    if (!service) return;

    setCounts(prev => ({
      ...prev,
      [serviceId]: (prev[serviceId] || 0) + 1
    }));

    // Add to selected services if not already present
    if (!selectedServices.includes(serviceId)) {
      setSelectedServices(prev => [...prev, serviceId]);
      const randomIdx = Math.floor(Math.random() * 5); // 0 to 4
      setActiveMessages(prev => ({
        ...prev,
        [serviceId]: randomIdx
      }));
    }

    // Trigger confetti particles
    const id = Date.now();
    const newParticles = Array.from({ length: 45 }).map((_, i) => ({
      id: `${id}-${i}`,
      left: Math.random() * 100, // random X position across screen width
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      angle: (Math.random() * 80) - 40, // tilt angle -40 to 40 deg
      delay: Math.random() * 0.5, // delayed explosion flow
      speed: 1.2 + Math.random() * 1.8, // flight speed
      shape: Math.random() > 0.5 ? 'rect' : 'circle'
    }));

    setConfettiParticles(prev => [...prev, ...newParticles]);

    // Clean up particles
    setTimeout(() => {
      setConfettiParticles(prev => prev.filter(p => !p.id.startsWith(id)));
    }, 3500);
  };

  const handleNextFarmer = () => {
    setSelectedServices([]);
    setActiveMessages({});
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
  const t = TRANSLATIONS[lang];

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
              <span>{t.servicesPanel}</span>
            </button>
            <button 
              className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              <BarChart3 size={18} />
              <span>{t.statsCharts}</span>
              {totalClicks > 0 && (
                <span className="total-badge">{totalClicks}</span>
              )}
            </button>

            {/* Language Switcher Button */}
            <button 
              className="lang-toggle-btn"
              onClick={toggleLang}
              title={lang === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}
            >
              <Languages size={18} />
              <span className="lang-label">{lang === 'en' ? 'हिन्दी' : 'EN'}</span>
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
              {t.headingPart1} <br className="br-desktop" />
              {t.headingPart2} <span className="highlight-text">{t.farmerId}</span>?
            </h1>
          </div>

          {activeTab === 'panel' ? (
            <ServicePanel 
              counts={counts}
              onServiceClick={handleServiceClick}
              totalClicks={totalClicks}
              lang={lang}
              selectedServices={selectedServices}
              activeMessages={activeMessages}
              onNextFarmer={handleNextFarmer}
            />
          ) : (
            <StatsView 
              counts={counts}
              onReset={handleReset}
              totalClicks={totalClicks}
              lang={lang}
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

    </div>
  );
}
