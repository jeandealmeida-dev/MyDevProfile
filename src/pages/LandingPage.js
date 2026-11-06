import React from 'react';
import TitleBar from '../components/TitleBar';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ExperienceSection from '../components/ExperienceSection';
import AboutSection from '../components/AboutSection';
import ProjectsSection from '../components/ProjectsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';
import '../styles/LandingPage.css';
import '../styles/SectionHeading.css';

const PU = process.env.PUBLIC_URL;

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

        <section id="projects" className="landing-section">
          <ProjectsSection />
        </section>

        <section id="testimonials" className="landing-section">
          <TestimonialsSection />
        </section>

        <section
          id="contact"
          className="landing-section"
          style={{ backgroundImage: `url(${PU}/background.jpg)` }}
        >
          <ContactSection />
        </section>

      </main>
    </>
  );
}

export default LandingPage;
