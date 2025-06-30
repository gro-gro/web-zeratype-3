'use client';
import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Model from './Model';
import { Environment } from '@react-three/drei'
import { useMotionValue, useSpring } from "framer-motion"

export default function Index() {
  const [cameraZoom, setCameraZoom] = useState(10);
  const [isMobile, setIsMobile] = useState(false);
  const [viewport, setViewport] = useState({ width: 1920, height: 1080 });

  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0)
  }

  const smoothMouse = {
    x: useSpring(mouse.x, {stiffness: 75, damping: 100, mass: 3}),
    y: useSpring(mouse.y, {stiffness: 75, damping: 100, mass: 3})
  }

  const manageMouse = e => {
    const { innerWidth, innerHeight } = window;
    const { clientX, clientY } = e;
    const x = clientX / innerWidth
    const y = clientY / innerHeight
    mouse.x.set(x);
    mouse.y.set(y);
  }

  const updateResponsiveSettings = () => {
    const { innerWidth, innerHeight } = window;
    const isMobileDevice = innerWidth <= 768 || innerHeight <= 768;
    setIsMobile(isMobileDevice);
    
    // Update viewport dimensions
    setViewport({ width: innerWidth, height: innerHeight });
    
    // Calculate responsive zoom based on aspect ratio and screen size
    const aspectRatio = innerWidth / innerHeight;
    let newZoom;
    
    if (isMobileDevice) {
      // Mobile: adjust zoom based on aspect ratio
      if (aspectRatio > 1) {
        // Landscape mobile
        newZoom = 2.5;
      } else {
        // Portrait mobile
        newZoom = 5;
      }
    } else {
      // Desktop: adjust zoom based on aspect ratio
      if (aspectRatio > 1.5) {
        // Ultra-wide
        newZoom = 8;
      } else if (aspectRatio > 1.2) {
        // Wide
        newZoom = 9;
      } else {
        // Standard
        newZoom = 10;
      }
    }
    
    setCameraZoom(newZoom);
  }

  useEffect(() => {
    updateResponsiveSettings();
    window.addEventListener("mousemove", manageMouse);
    window.addEventListener("resize", updateResponsiveSettings);
    window.addEventListener("orientationchange", updateResponsiveSettings);
    
    return () => {
      window.removeEventListener("mousemove", manageMouse);
      window.removeEventListener("resize", updateResponsiveSettings);
      window.removeEventListener("orientationchange", updateResponsiveSettings);
    }
  }, [])

  return (
    <Canvas 
      style={{background: "#e0e0e2"}} 
      orthographic 
      camera={{position: [0, 0, 200], zoom: cameraZoom}}
    >
        <Model mouse={smoothMouse} viewport={viewport} cameraZoom={cameraZoom}/>
        <Environment preset="studio"/>
    </Canvas>
  )
}
