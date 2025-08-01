'use client';

import { useState, useEffect } from 'react';
import styles from './LoadingScreen.module.scss';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isResourcesLoaded, setIsResourcesLoaded] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [logoPhase, setLogoPhase] = useState('hidden'); // 'hidden', 'entering', 'visible', 'exiting'
  const [fadeBackground, setFadeBackground] = useState(false);

  // Mostrar logo después de 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(true);
      setLogoPhase('entering');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Simular carga falsa que se detiene antes del 100%
  useEffect(() => {
    if (!showLogo) return;

    const fakeLoadingInterval = setInterval(() => {
      setProgress(prev => {
        // Carga rápida hasta 60%, luego más lenta hasta 85%
        if (prev < 60) {
          return Math.min(prev + Math.random() * 8, 60);
        } else if (prev < 85) {
          return Math.min(prev + Math.random() * 2, 85);
        }
        // Se detiene en 85% hasta que los recursos estén cargados
        return prev;
      });
    }, 100);

    return () => clearInterval(fakeLoadingInterval);
  }, [showLogo]);

  // Detectar cuando todos los recursos están cargados (REAL loading detection)
  useEffect(() => {
    const checkResourcesLoaded = () => {
      // Verificar si todas las imágenes están cargadas
      const images = document.querySelectorAll('img');
      const allImagesLoaded = Array.from(images).every(img => img.complete && img.naturalHeight !== 0);
      
      // Verificar fuentes
      const fontsReady = document.fonts.status === 'loaded';
      
      // Verificar modelos 3D (canvas de three.js)
      const canvas = document.querySelector('canvas');
      const canvasReady = canvas ? true : false;
      
      // Verificar si el DOM está completamente cargado
      const isDOMReady = document.readyState === 'complete';

      if (allImagesLoaded && fontsReady && canvasReady && isDOMReady) {
        setIsResourcesLoaded(true);
      }
    };

    // Verificar inmediatamente
    checkResourcesLoaded();

    // Verificar cada 300ms (más frecuente)
    const interval = setInterval(checkResourcesLoaded, 300);

    // También escuchar eventos importantes
    window.addEventListener('load', () => setIsResourcesLoaded(true));
    document.fonts.addEventListener('loadingdone', checkResourcesLoaded);

    // Fallback: máximo 8 segundos
    const fallbackTimeout = setTimeout(() => {
      setIsResourcesLoaded(true);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(fallbackTimeout);
      window.removeEventListener('load', () => setIsResourcesLoaded(true));
      document.fonts.removeEventListener('loadingdone', checkResourcesLoaded);
    };
  }, []);

  // Completar carga cuando los recursos estén listos
  useEffect(() => {
    if (isResourcesLoaded && progress >= 85) {
      setLogoPhase('exiting'); // Comenzar animación de salida del logo
      
      const completeLoading = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(completeLoading);
            // Esperar a que termine la animación del logo antes de fade background
            setTimeout(() => {
              setFadeBackground(true);
            }, 500); // Duración de la animación de salida del logo
            return 100;
          }
          return Math.min(prev + 5, 100);
        });
      }, 50);

      return () => clearInterval(completeLoading);
    }
  }, [isResourcesLoaded, progress]);

  // Fade out del background después de que el logo desaparezca
  useEffect(() => {
    if (fadeBackground) {
      const fadeTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 300); // Fade rápido del background

      return () => clearTimeout(fadeTimer);
    }
  }, [fadeBackground, onComplete]);

  // Cambiar phase del logo después de que termine la animación de entrada
  useEffect(() => {
    if (logoPhase === 'entering') {
      const timer = setTimeout(() => {
        setLogoPhase('visible');
      }, 600); // Duración de la animación de entrada
      
      return () => clearTimeout(timer);
    }
  }, [logoPhase]);

  if (!showLogo) {
    return <div className={styles.loadingScreen} />;
  }

  return (
    <div className={`${styles.loadingScreen} ${fadeBackground ? styles.fadeOut : ''}`}>
      <div className={`${styles.logoContainer} ${styles[logoPhase]}`}>
        <svg 
          width="345" 
          height="354" 
          viewBox="0 0 345 354" 
          className={styles.logo}
        >
          <defs>
            <mask id="logoMask">
              <rect width="100%" height="100%" fill="white" />
              <rect 
                width="100%" 
                height={`${100 - progress}%`} 
                fill="black" 
                className={styles.maskRect}
              />
            </mask>
          </defs>
          
          {/* Logo gris de fondo */}
          <g fill="#666666">
            <path d="M297.842 188.21L123.819 232.329L47.1562 165.462L221.507 121.671L297.842 188.21Z"/>
            <path d="M232.838 97.8089L271.023 131.242L345 70.4394V0L0 86.2056V155.989L232.838 97.8089Z"/>
            <path d="M112.588 256.191L74.076 222.659L0 283.561V354L345 267.794V198.109L112.588 256.191Z"/>
          </g>
          
          {/* Logo negro que se llena */}
          <g fill="black" mask="url(#logoMask)">
            <path d="M297.842 188.21L123.819 232.329L47.1562 165.462L221.507 121.671L297.842 188.21Z"/>
            <path d="M232.838 97.8089L271.023 131.242L345 70.4394V0L0 86.2056V155.989L232.838 97.8089Z"/>
            <path d="M112.588 256.191L74.076 222.659L0 283.561V354L345 267.794V198.109L112.588 256.191Z"/>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default LoadingScreen;