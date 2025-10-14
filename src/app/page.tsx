'use client';

import Image from 'next/image';

export default function Home() {
  return (
    <div>
      {/* Modern Navigation */}
      <nav id="navbar">
        <div className="nav-container">
          <div className="logo">
            <div>
              <div className="logo-text">Rishi Malik</div>
            </div>
          </div>
          <ul className="nav-links">
            <li><a href="#properties">Properties</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <section className="hero" id="home">
        <Image 
          src="/images/banner.png" 
          alt="Rishi Malik Real Estate Banner" 
          fill
          style={{ objectFit: 'cover',top:'150px' }}
          priority 
        />
      </section>
    </div>
  );
}