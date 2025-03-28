import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1>Your Name</h1>
        <p>Full Stack Developer</p>
      </header>
      <div className="navbar">
        <div className="navbarButton">Home</div>
        <div className="navbarButton">About</div>
        <div className="navbarButton">Projects</div>
        <div className="navbarButton">Contact</div>
      </div>
      <section className="about">
        <h2>About Me</h2>
        <p>Brief bio about yourself and your skills.</p>
      </section>
      <section className="projects">
        <h2>Projects</h2>
        <div className="project">
          <h3>Project 1</h3>
          <p>Description of project 1.</p>
        </div>
        <div className="project">
          <h3>Project 2</h3>
          <p>Description of project 2.</p>
        </div>
      </section>
      <section className="contact">
        <h2>Contact</h2>
        <p>Email: your.email@example.com</p>
        <p>LinkedIn: <a href="https://www.linkedin.com/in/yourprofile">yourprofile</a></p>
      </section>
      <footer className="footer">
        <p>&copy; 2023 Your Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
