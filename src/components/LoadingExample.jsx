// Ejemplo de integración del LoadingScreen en la página principal

'use client';
import { useState } from 'react';
import LoadingScreen from './LoadingScreen';

const ExampleIntegration = ({ children }) => {
  const [showLoading, setShowLoading] = useState(true);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <>
      {showLoading && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
      
      {/* Contenido principal de la página */}
      <div style={{ opacity: showLoading ? 0 : 1 }}>
        {children}
      </div>
    </>
  );
};

export default ExampleIntegration;

// Para usar en tu page.js:
/*
import LoadingScreen from '../components/LoadingScreen';

export default function Home() {
  const [showLoading, setShowLoading] = useState(true);

  return (
    <>
      {showLoading && (
        <LoadingScreen onComplete={() => setShowLoading(false)} />
      )}
      
      <main style={{ display: showLoading ? 'none' : 'block' }}>
        // Tu contenido actual aquí
      </main>
    </>
  );
}
*/