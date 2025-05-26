"use client";
import React from "react";
import Nav from "./Nav";
import Hero from "./Hero";
import Feature2 from "./Feature2";
import Features from "./Features";
import Cards from "./Cards";
import CallToAction from "./CallToAction";
import Footer from "./Footer";
import Scroller from "./components/Scroller";
const App: React.FC = () => {
  return (
    <div
      className="leading-normal tracking-normal bg-white gradient"
      style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
    >
      <Nav />
      <Cards />
      <Scroller />
      <Hero />
      <Feature2 />
      <Features />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default App;
