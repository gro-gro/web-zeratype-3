import React from 'react';

export default function Navbar() {
  return (
    <nav className="navbar inter-uniquifier">
      <a href="/" className="nav-logo">
        <img src="/medias/ISO_negro.svg" alt="Zeratype Logo" className="logo-img" />
      </a>
      <div className="nav-links-centered">
        <a href="/"><span>STUDIOS</span></a>
        <a href="/"><span>PROCESS</span></a>
        <a href="/"><span>SERVICES</span></a>
      </div>
      <a href="/" className="nav-button">GET IN TOUCH</a>
    </nav>
  );
}