import React from 'react';
import TitleBar from '../components/TitleBar';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ExperienceSection from '../components/ExperienceSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import '../styles/LandingPage.css';

function LandingPage() {
  return (
    <>
      <TitleBar />
      <Navbar />
      <main className="landing-main">

        <Hero />

        <section id="about" className="landing-section">
          <AboutSection />
        </section>

        <section id="experience" className="landing-section">
          <ExperienceSection />
        </section>

        <section id="contact" className="landing-section">
          <ContactSection />
        </section>

      </main>
    </>
  );
}

export default LandingPage;
