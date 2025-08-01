'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default function LenisProvider() {
  useEffect(() => {
    // Inicializar Lenis con las opciones especificadas
    const lenis = new Lenis({
      autoRaf: false,
      duration: 0.5,
      easing: t => 1 - Math.pow(1 - t, 3)
    });

    // Función para el loop RAF
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Iniciar el loop RAF
    requestAnimationFrame(raf);

    // Cleanup al desmontar el componente
    return () => {
      lenis.destroy();
    };
  }, []);

  // Este componente no renderiza nada
  return null;
}