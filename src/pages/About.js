import React from "react";
import Header from "../components/Header";
import TitleBar from "../components/TitleBar";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import MenuMobile from "../components/MenuMobile";
import '../styles/About.css';
import IconCloud from '../components/IconCloud';

function About() {
  return ( 
    <body>
      <TitleBar />
      <section className="flex-container">
        <section className="main-container">
          <Header />
          <MenuMobile />
          <main className="main-wrapper about">
            <div className="about-container">
              <br/>
                <h1 className="title-about">Olá,</h1>
              <br/>
                <p className="text-about">
                  Meu nome é <span className="span-highlight">Jean Paulo</span> e com mais de <span className="span-highlight">5 anos de experiência</span> como desenvolvedor mobile, possuo um profundo conhecimento da plataforma Android e seu ecossistema de desenvolvimento. 
                </p>
                <p className="text-about">
                  Minhas habilidades técnicas são complementadas por minhas excelentes <span className="span-highlight">soft skills</span>, que incluem escuta ativa, colaboração, apoio aos mais juniores, resiliência e atenção aos detalhes.
                </p>
                <p className="text-about">
                  Meu proposito é desenvolver aplicativos inovadores e de alta qualidade que atendam às necessidades dos usuários e <span className="span-highlight">impactem positivamente o mundo.</span> 
                </p>
                <p className="text-about last">
                  As habilidades relevantes incluem: <span className="span-highlight">Android SDK, Java, Kotlin, Flutter, Dart, python</span>
                </p>
            </div>
            <IconCloud />
          </main>
        </section>
        <SideBar />
      </section>
      <Footer />
    </body>
  );
}

export default About;