'use client';

import React from 'react';

export default function Navbar() {
  // Detectar orientación
  const [isPortrait, setIsPortrait] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  React.useEffect(() => {
    function checkOrientation() {
      // Use consistent breakpoint: mobile if width < 768px
      setIsPortrait(window.innerWidth < 768);
      setIsInitialized(true);
    }
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // No renderizar nada hasta que se determine la orientación
  if (!isInitialized) return null;
  if (isPortrait) return null;

  return (
    <nav className="navbar inter-uniquifier">
      <div className="nav-pill">
        <a href="#media-building">MEDIA BUILDING</a>
        <a href="#hecho-con">HECHO CON</a>
        <a href="#contacto">CONTACTO</a>
      </div>
    </nav>
  );
}