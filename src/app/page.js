'use client';
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./page.module.css";
import FloatingShape from "../components/floatingShape";
import NumberFlow from '@number-flow/react';
import Navbar from "../components/Navbar";

export default function Home() {
  // Refs para scrollear a cada sección
  const heroRef = useRef(null);
  const mediaRef = useRef(null);
  const hechoRef = useRef(null);
  const contactoRef = useRef(null);

  // Estado para menú hamburguesa
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [hamburgerOpacity, setHamburgerOpacity] = useState(1);

  // Detectar orientación
  useEffect(() => {
    function checkOrientation() {
      setIsPortrait(window.innerHeight > window.innerWidth);
    }
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Detectar scroll para fade del hamburger menu
  useEffect(() => {
    function handleScroll() {
      if (!isPortrait || menuOpen) return; // No hacer fade si el menú está abierto
      
      const scrollY = window.scrollY;
      const heroHeight = heroRef.current?.offsetHeight || 0;
      const fadeStart = heroHeight * 0.3; // Comienza a fade cuando está 30% del hero
      const fadeEnd = heroHeight * 0.8;   // Completamente invisible al 80% del hero
      
      if (scrollY <= fadeStart) {
        setHamburgerOpacity(1);
      } else if (scrollY >= fadeEnd) {
        setHamburgerOpacity(0);
      } else {
        // Fade gradual entre fadeStart y fadeEnd
        const fadeProgress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
        setHamburgerOpacity(1 - fadeProgress);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPortrait, menuOpen]);

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (menuOpen) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar la posición del scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Scroll suave
  const scrollToSection = (ref) => {
    setMenuOpen(false);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.container}>
      {/* Menú hamburguesa móvil */}
      {isPortrait && (
        <>
          <motion.button 
            className={styles.mobileNavHamburger} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            data-menu-open={menuOpen}
            style={{ 
              opacity: menuOpen ? 1 : hamburgerOpacity,
              pointerEvents: hamburgerOpacity <= 0 ? 'none' : 'auto',
              zIndex: menuOpen ? 3001 : 2000, // Mayor z-index cuando está abierto
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div 
              className={styles.hamburgerLine}
              animate={{
                rotate: menuOpen ? 45 : 0,
                y: menuOpen ? 10 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ transformOrigin: 'center' }}
            />
            <motion.div 
              className={styles.hamburgerLine}
              animate={{
                opacity: menuOpen ? 0 : 1,
                scale: menuOpen ? 0 : 1,
              }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ transformOrigin: 'center' }}
            />
            <motion.div 
              className={styles.hamburgerLine}
              animate={{
                rotate: menuOpen ? -45 : 0,
                y: menuOpen ? -10 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ transformOrigin: 'center' }}
            />
          </motion.button>
          
                    <AnimatePresence>
            {menuOpen && (
              <motion.div 
                className={styles.mobileNavOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeInOut",
                  delay: 0.4 // Tarda más en desaparecer
                }}
              >
                <div className={styles.mobileNavMenu}>
                  <motion.a 
                    href="#media-building" 
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ 
                      duration: 0.15, 
                      ease: "easeInOut",
                      delay: 0.1 
                    }}
                  >
                    Media Building
                  </motion.a>
                  <motion.a 
                    href="#hecho-con" 
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ 
                      duration: 0.15, 
                      ease: "easeInOut",
                      delay: 0.2 
                    }}
                  >
                    Hecho Con
                  </motion.a>
                  <motion.a 
                    href="#contacto" 
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ 
                      duration: 0.15, 
                      ease: "easeInOut",
                      delay: 0.3 
                    }}
                  >
                    Contacto
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
      
      {/* Hero principal con formas 3D */}
      <section className={styles.hero} ref={heroRef} id="hero">
        <div className={styles.heroLegend}>
          <span className={styles.heroLegendText}>
            En Zeratype <span className={styles.heroLegendStrong}>conectamos</span> marcas, creadores y audiencias<br />
            para construir comunidades auténticas y conversaciones relevantes.
          </span>
        </div>
        <FloatingShape />
      </section>
      {/* Secciones scrolleables debajo */}
      <div className={styles.sectionsWrapper}>
        <ResizableSection ref={mediaRef} className={styles.section} id="media-building" label={null} color="#212121">
          <MediaBuildingContent />
        </ResizableSection>
        <ResizableSection ref={hechoRef} className={styles.section} id="hecho-con" label={null} color="#fff">
          <HechoConZeratypeContent />
        </ResizableSection>
        <ResizableSection ref={contactoRef} className={styles.section} id="contacto" label={null} color="#212121">
          <ContactoContent />
                </ResizableSection>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={`${styles.grid} ${styles.gridMobile}`}>
          <div className={`${styles.footerContent} ${styles.col12}`}>
            <span className={styles.copyright}>Copyright © 2025 Zeratype</span>
            <div className={styles.footerLinks}>
              <span>Todos los derechos reservados</span>
              <span className={styles.separator}>|</span>
              <a href="/privacidad" className={styles.footerLink}>Política de privacidad</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de sección que abraza el contenido
const ResizableSection = React.forwardRef(({ id, label, color, className, children }, ref) => {
  const sectionRef = React.useRef();
  React.useImperativeHandle(ref, () => sectionRef.current);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={className}
      style={{ background: color }}
    >
      <div className={styles.sectionContent}>
        {label && <h2>{label}</h2>}
        {children}
      </div>
    </section>
  );
});

// Componente para Media Building
function MediaBuildingContent() {
  const [kpis, setKpis] = React.useState([
    { label: 'Total creators', value: 150 },
    { label: 'Total audience', value: 712400 },
    { label: 'Total interactions', value: 986000 },
  ]);

  // Generar números aleatorios en los rangos pedidos
  function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      setKpis([
        { label: 'Total creators', value: randomInRange(100, 200) },
        { label: 'Total audience', value: randomInRange(500000, 999999) },
        { label: 'Total interactions', value: randomInRange(10_000_000, 99_000_000) },
      ]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Función para abreviar números grandes
  function formatNumber(num) {
    if (num < 1000) return num;
    const units = ["k", "M", "B", "T", "Q"];
    let unit = -1;
    let n = num;
    while (n >= 1000 && unit < units.length - 1) {
      n /= 1000;
      unit++;
    }
    return n % 1 === 0 ? n.toFixed(0) + units[unit] : n.toFixed(1) + units[unit];
  }

  return (
    <div className={styles.mediaBuildingRoot}>
      <div className={`${styles.grid} ${styles.gridMobile}`}>
        <div className={styles.col12}>
          <div className={`${styles.kpiRow}`}>
            {kpis.map((kpi, i) => (
              <div className={styles.kpiBox} key={kpi.label}>
                <div className={styles.kpiLabel}>{kpi.label}</div>
                <div className={styles.kpiValue + ' special-gothic-expanded-one-regular'}>
                  <NumberFlow value={kpi.value} format={{ notation: 'compact' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.col12}>
          <div className={styles.mediaTitle}>
            Media Building
          </div>
        </div>
        <div className={styles.col12}>
          <div className={styles.mediaDesc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </div>
        </div>
        <div className={styles.col12}>
          <div className={styles.igButtonWrapper} style={{ justifyContent: 'center' }}>
            <a href="https://instagram.com/zeratype_" target="_blank" rel="noopener noreferrer" className={styles.igButtonMediaBuilding}>
              <span className={styles.igIcon}>
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" style={{marginRight: '8px', verticalAlign: 'middle'}} fill="currentColor"><title>Instagram</title><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>
              </span>
              @zeratype_
            </a>
          </div>
        </div>
        <div className={styles.col12}>
          <div className={styles.dropdownList}>
            <Dropdown title={<span className={styles.dropdownTitleNormal}><b>Creadores</b></span>}>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </Dropdown>
            <Dropdown title={<span className={styles.dropdownTitleNormal}><b>Estudios</b></span>}>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </Dropdown>
            <Dropdown title={<span className={styles.dropdownTitleNormal}><b>Servicios</b></span>}>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}

function HechoConZeratypeContent() {
  return (
    <div className={styles.hechoConRoot}>
      <div className={`${styles.grid} ${styles.gridMobile}`}>
      {/* Logo arriba */}
        <div className={`${styles.hechoLogo} ${styles.col12}`}>
          <img src="/medias/hechoEnZeratype.svg" alt="Hecho con Zeratype" />
        </div>
        
        {/* Grid de proyectos */}
        <div className={`${styles.proyectosGrid} ${styles.col12}`}>
          <ProyectoCard 
            logo="/image/0mg_logo.svg"
            nombre="Cero Miligramos"
            seguidores={15420}
            likes={8920}
            comentarios={1240}
            descripcion="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod."
            instagram="@ceromiligramos"
            header="/image/0mg_header.png"
            logoScale={1}
          />
          <ProyectoCard 
            logo="/image/cl_logo.svg"
            nombre="Criemos Libres"
            seguidores={15420}
            likes={8920}
            comentarios={1240}
            descripcion="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod."
            instagram="@criemoslibres"
            header="/image/cl_header.png"
            logoScale={1}
          />
          <ProyectoCard 
            logo="/image/esdlvp_logo.svg"
            nombre="El Sueño de la Vida Propia"
            seguidores={15420}
            likes={8920}
            comentarios={1240}
            descripcion="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod."
            instagram="@vidapropiaok"
            header="/image/esdlvp_header.png"
            logoScale={1.75}
          />
          <ProyectoCard 
            logo="/image/et_logo.png"
            nombre="En Teoría"
            seguidores={15420}
            likes={8920}
            comentarios={1240}
            descripcion="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod."
            instagram="@enteoriaok"
            header="/image/et_header.png"
            logoScale={1.75}
          />
        </div>
      </div>
    </div>
  );
}

// Componente individual para cada proyecto
function ProyectoCard({ logo, nombre, seguidores, likes, comentarios, descripcion, instagram, header, logoScale }) {
  const [stats, setStats] = React.useState({
    seguidores: seguidores,
    likes: likes,
    comentarios: comentarios
  });

  // Animación de números como en Media Building
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        seguidores: Math.floor(Math.random() * (seguidores * 1.2 - seguidores * 0.8) + seguidores * 0.8),
        likes: Math.floor(Math.random() * (likes * 1.2 - likes * 0.8) + likes * 0.8),
        comentarios: Math.floor(Math.random() * (comentarios * 1.2 - comentarios * 0.8) + comentarios * 0.8)
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [seguidores, likes, comentarios]);

  return (
    <div className={styles.proyectoCard}>
      {/* 1. Logo del proyecto */}
      <div className={styles.proyectoLogo}>
        <img src={logo} alt={`Logo ${nombre}`} style={{ height: `${48 * logoScale}px` }} />
      </div>

      {/* 3. Descripción */}
      <p className={styles.proyectoDescripcion}>
        {descripcion}
      </p>

      {/* 4. Stats y Botón Instagram en la misma línea */}
      <div className={styles.proyectoStatsRow}>
        <div className={styles.proyectoIgButtonWrapper}>
          <a href={`https://instagram.com/${instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className={styles.proyectoIgButton}>
            <span className={styles.igIcon}>
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="22" height="22" style={{marginRight: '8px', verticalAlign: 'middle'}} fill="currentColor"><title>Instagram</title><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>
            </span>
            {instagram}
          </a>
        </div>

        <div className={styles.statsPill}>
          <div className={styles.statItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className={styles.statNumber}>
              <NumberFlow value={stats.seguidores} format={{ notation: 'compact' }} />
            </span>
          </div>
          <div className={styles.statItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className={styles.statNumber}>
              <NumberFlow value={stats.likes} format={{ notation: 'compact' }} />
            </span>
          </div>
          <div className={styles.statItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
            <span className={styles.statNumber}>
              <NumberFlow value={stats.comentarios} format={{ notation: 'compact' }} />
            </span>
          </div>
        </div>
      </div>

      {/* 5. Imagen */}
      <div className={styles.proyectoImagen}>
        <img src={header} alt={`${nombre} header`} />
      </div>
    </div>
  );
}

// Dropdown simple
function Dropdown({ title, children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className={styles.dropdown}>
      <button className={styles.dropdownHeader} onClick={() => setOpen(o => !o)}>
        <span className={styles.dropdownTitle}>{title}</span>
        <span className={`${styles.dropdownArrow} ${open ? styles.dropdownArrowOpen : ''}`}>{'>'}</span>
      </button>
      {open && <div className={styles.dropdownContent}>{children}</div>}
    </div>
  );
}

function ContactoContent() {
  return (
    <div className={styles.contactoRoot}>
      <div className={`${styles.grid} ${styles.gridMobile}`}>
        {/* Columna izquierda */}
        <div className={`${styles.contactoLeft} ${styles.col6} ${styles.mobileCol2}`}>
          <img src="/medias/WM_negro.svg" alt="Zeratype" className={styles.contactoLogo} />
          <p className={styles.contactoDescripcion}>
            Lorem ipsum dolor sit amet consectetur adipiscing elit aliquam
          </p>
          <div className={styles.contactoRedes}>
            <a href="https://instagram.com/zeratype" target="_blank" rel="noopener noreferrer" className={styles.redSocial}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://tiktok.com/@zeratype" target="_blank" rel="noopener noreferrer" className={styles.redSocial}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            <a href="https://linkedin.com/company/zeratype" target="_blank" rel="noopener noreferrer" className={styles.redSocial}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://youtube.com/@zeratype" target="_blank" rel="noopener noreferrer" className={styles.redSocial}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Columna derecha */}
        <div className={`${styles.contactoRight} ${styles.col6} ${styles.mobileCol2}`}>
          <div className={styles.contactoMenu}>
            <div className={styles.menuColumna}>
              <a href="#zeratype" className={styles.menuLink}>Zeratype</a>
              <a href="#media-building" className={styles.menuLink}>Media building</a>
              <a href="#hecho-con" className={styles.menuLink}>Hecho con</a>
            </div>
            <div className={styles.menuColumna}>
              <h3 className={styles.menuTitulo}>Contacto</h3>
              <div className={styles.contactoItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>contacto@zeratype.com</span>
              </div>
              <div className={styles.contactoItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span>+54-11-1234-5678</span>
              </div>
              <div className={styles.contactoItem}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <a href="https://maps.app.goo.gl/oEpitm4z1kLmpGsV7" target="_blank" rel="noopener noreferrer">
                  Bernardo de Irigoyen 330, Ciudad Autónoma de Buenos Aires
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
