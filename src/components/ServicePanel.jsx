import React, { useState } from 'react';
import { SERVICES } from '../data/services';
import { ServiceIcon } from './ServiceIcon';
import { TRANSLATIONS } from '../data/translations';
import { Sparkles, Grid, RotateCcw } from 'lucide-react';

const CONFETTI_COLORS = ['#2ecc71', '#e74c3c', '#f1c40f', '#3498db', '#9b59b6', '#e67e22', '#1abc9c'];

export const ServicePanel = ({ 
  counts, 
  onServiceClick, 
  totalClicks, 
  lang = 'en',
  selectedServices = [],
  activeMessages = {},
  onNextFarmer
}) => {
  const [hoveredService, setHoveredService] = useState(null);
  const [layoutMode, setLayoutMode] = useState('circular'); // 'circular' or 'grid'

  const t = TRANSLATIONS[lang];
  const activeServices = SERVICES.filter(s => s.active);

  // SVG dimensions
  const centerSize = 400; // 800px width / 2

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div className="badge-container">
          <span className="badge">{t.choosePlaceDiscover}</span>
        </div>
        <h2 className="panel-subtitle">{t.subtitle}</h2>
        
        <div className="layout-toggle">
          <button 
            className={`toggle-btn ${layoutMode === 'circular' ? 'active' : ''}`}
            onClick={() => setLayoutMode('circular')}
            title="Circular Layout"
          >
            <RotateCcw size={16} /> {lang === 'en' ? 'Radial Dial' : 'रेडियल डायल'}
          </button>
          <button 
            className={`toggle-btn ${layoutMode === 'grid' ? 'active' : ''}`}
            onClick={() => setLayoutMode('grid')}
            title="Grid Layout"
          >
            <Grid size={16} /> {lang === 'en' ? 'Grid Layout' : 'ग्रिड लेआउट'}
          </button>
        </div>
      </div>

      {layoutMode === 'circular' ? (
        <div className="circular-wrapper">
          {/* Circular dial container */}
          <div className="dial-container">
            {/* SVG Connecting Lines - placed behind buttons */}
            <svg className="connecting-lines-svg" width="800" height="800">
              {SERVICES.map((service, index) => {
                if (!service.active) return null;

                const angleDeg = (index * 45) - 90; // 8 items -> 45 deg step
                const radius = 310;
                const angleRad = (angleDeg * Math.PI) / 180;
                
                const x = Math.round(radius * Math.cos(angleRad));
                const y = Math.round(radius * Math.sin(angleRad));

                const startX = centerSize;
                const startY = centerSize;
                const endX = centerSize + x;
                const endY = centerSize + y;

                const isHovered = hoveredService === service.id;

                return (
                  <line
                    key={service.id}
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    className={`connecting-line ${isHovered ? 'line-hovered' : ''}`}
                    style={{ 
                      stroke: isHovered ? service.color : 'rgba(39, 174, 96, 0.25)',
                      '--service-color': service.color 
                    }}
                  />
                );
              })}
            </svg>

            {/* Central Farmer & Info */}
            <div className={`central-hub ${hoveredService ? 'hub-hovered' : ''}`}>
              <div className="hub-inner">
                <div className="farmer-avatar">
                  {/* Image cutout loading custom farmers illustration, fallback to custom multi-farmer SVG */}
                  <img 
                    src="/images/farmers-group.png" 
                    alt="Indian Farmers Group" 
                    className="farmer-avatar-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.nextSibling;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  {/* Overlapping Multi-Farmer SVG Vector Fallback */}
                  <svg viewBox="0 0 64 64" width="64" height="64" className="farmer-cutout" style={{ display: 'none' }}>
                    <circle cx="32" cy="32" r="30" fill="rgba(39, 174, 96, 0.05)" stroke="rgba(39, 174, 96, 0.2)" strokeWidth="1"/>
                    
                    {/* Left Farmer (Smaller, Back) */}
                    <g transform="translate(-10, 4) scale(0.82)">
                      <path d="M16 26 C 16 12, 48 12, 48 26 C 44 20, 20 20, 16 26 Z" fill="#d35400" />
                      <path d="M18 22 C 20 10, 44 10, 46 22 C 40 16, 24 16, 18 22 Z" fill="#c0392b" />
                      <circle cx="32" cy="33" r="13" fill="#e0ab76" />
                      <path d="M22 36 C 26 34, 30 36, 32 38 C 34 36, 38 34, 42 36 Z" fill="#1e293b" />
                      <path d="M14 50 C 14 42, 50 42, 50 50 Z" fill="#f3f4f6" />
                    </g>

                    {/* Right Farmer (Smaller, Back) */}
                    <g transform="translate(10, 4) scale(0.82)">
                      <path d="M16 26 C 16 12, 48 12, 48 26 C 44 20, 20 20, 16 26 Z" fill="#16a085" />
                      <path d="M18 22 C 20 10, 44 10, 46 22 C 40 16, 24 16, 18 22 Z" fill="#117a65" />
                      <circle cx="32" cy="33" r="13" fill="#e59866" />
                      <path d="M22 36 C 26 34, 30 36, 32 38 C 34 36, 38 34, 42 36 Z" fill="#1e293b" />
                      <path d="M14 50 C 14 42, 50 42, 50 50 Z" fill="#f3f4f6" />
                    </g>

                    {/* Main Center Farmer (In Front) */}
                    <g transform="translate(0, 2)">
                      <path d="M16 26 C 16 12, 48 12, 48 26 C 44 20, 20 20, 16 26 Z" fill="#e67e22" />
                      <path d="M18 22 C 20 10, 44 10, 46 22 C 40 16, 24 16, 18 22 Z" fill="#d35400" />
                      <circle cx="32" cy="33" r="13" fill="#f5cba7" />
                      <circle cx="27" cy="31" r="1.8" fill="#2c3e50" />
                      <circle cx="37" cy="31" r="1.8" fill="#2c3e50" />
                      <path d="M22 36 C 26 34, 30 36, 32 38 C 34 36, 38 34, 42 36 C 44 39, 38 39, 32 39 C 26 39, 20 39, 22 36 Z" fill="#2c3e50" />
                      <path d="M30 12 C 32 8, 36 8, 38 12 Z" fill="#e67e22" />
                      <path d="M14 50 C 14 42, 50 42, 50 50 Z" fill="#ffffff" />
                      <path d="M28 42 L 32 48 L 36 42 Z" fill="#f5cba7" />
                    </g>
                  </svg>
                </div>
                <div className="farmer-text">
                  <span className="farmer-title">10,00,00,000+</span>
                  <span className="farmer-year">{t.indianFarmers}</span>
                </div>
              </div>
              <div className="hub-glow"></div>
            </div>

            {/* Service Buttons placed in circle */}
            {SERVICES.map((service, index) => {
              const angleDeg = (index * 45) - 90; // 8 items -> 45 deg step
              const radius = 310;
              const angleRad = (angleDeg * Math.PI) / 180;
              
              const x = Math.round(radius * Math.cos(angleRad));
              const y = Math.round(radius * Math.sin(angleRad));
              const isSelected = selectedServices.includes(service.id);

              return (
                <div 
                  key={service.id}
                  className="dial-item-wrapper"
                  style={{
                    transform: `translate(${x}px, ${y}px)`
                  }}
                >
                  <button
                    className={`dial-item ${service.active ? 'active' : 'disabled'} ${hoveredService === service.id ? 'hovered' : ''} ${isSelected ? 'selected-glow' : ''}`}
                    onClick={() => service.active && onServiceClick(service.id)}
                    onMouseEnter={() => setHoveredService(service.id)}
                    onMouseLeave={() => setHoveredService(null)}
                    style={{
                      '--theme-color': service.color,
                      borderColor: service.active ? 'var(--theme-color)' : '#bbb'
                    }}
                  >
                    <div className="icon-box">
                      <ServiceIcon name={service.icon} size={34} color={service.active ? service.color : '#888'} />
                    </div>
                  </button>
                  <div className="dial-label-container">
                    <span className="dial-label">{t[service.id]}</span>
                  </div>

                  {/* Speech bubble next to circle */}
                  {isSelected && (
                    <div 
                      className={`node-message-bubble ${x >= 0 ? 'pos-right' : 'pos-left'}`}
                      style={{ '--service-color': service.color }}
                    >
                      <div className="bubble-arrow" />
                      <span>{TRANSLATIONS[lang][service.id + '_impact']}</span>
                    </div>
                  )}

                  {/* Local Confetti Burst */}
                  {isSelected && (
                    <div className="local-confetti-burst">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="burst-particle" 
                          style={{
                            '--angle': `${i * 22.5}deg`,
                            '--delay': `${Math.random() * 0.12}s`,
                            '--color': CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                            '--distance': `${50 + Math.random() * 70}px`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Circular Orbit Rings */}
            <div className="orbit-ring ring-1"></div>
            <div className="orbit-ring ring-2"></div>
            <div className="orbit-ring ring-3"></div>
          </div>

          {/* Service detail card below the dial on hover */}
          <div className="service-details-card">
            {hoveredService ? (
              (() => {
                const s = SERVICES.find(x => x.id === hoveredService);
                return (
                  <div className="detail-content animate-fade-in">
                    <div className="detail-header" style={{ color: s.color }}>
                      <ServiceIcon name={s.icon} size={20} color={s.color} />
                      <h3>{t[s.id]}</h3>
                    </div>
                    <p>{t[s.id + '_desc']}</p>
                    {s.active && (
                      <div className="presses-stat">
                        {t.pressCount}: <strong>{counts[s.id] || 0} {t.times}</strong>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="detail-content placeholder animate-fade-in">
                <Sparkles size={20} color="#27ae60" className="sparkle-icon" />
                <p>{t.hoverPrompt}</p>
              </div>
            )}
          </div>

          {/* Next Farmer Action Button */}
          {selectedServices.length > 0 && (
            <div className="next-farmer-container animate-fade-in">
              <button className="next-farmer-btn" onClick={onNextFarmer}>
                {t.nextFarmer}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid-wrapper animate-fade-in">
          <div className="services-grid">
            {SERVICES.map((service) => (
              <div 
                key={service.id} 
                className={`grid-card ${service.active ? 'active' : 'disabled'}`}
                style={{ '--theme-color': service.color }}
                onClick={() => service.active && onServiceClick(service.id)}
              >
                <div className="grid-card-icon">
                  <ServiceIcon name={service.icon} size={32} color={service.active ? service.color : '#666'} />
                  {service.active && counts[service.id] > 0 && (
                    <span className="badge-count">{counts[service.id]}</span>
                  )}
                </div>
                <div className="grid-card-content">
                  <h3>{t[service.id]}</h3>
                  <p>{t[service.id + '_desc']}</p>
                </div>
                <div className="grid-card-action">
                  {t.clickSelect}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
