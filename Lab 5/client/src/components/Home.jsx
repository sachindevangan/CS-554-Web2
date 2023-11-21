import React from 'react';
import './Home.css'; 


const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to the API of Marvel!</h1>
      </div>


      <div className="explore-section">
        <h2>You can explore our comic collections bu going to the "Explore Marvel Collections" Section</h2>
        <p>You will find all types of comics from every issue here from rare comics to the latest one, do give it a read.</p>
        <p>You can also create your own sub-collections to keep your personalised comics together.</p>
      </div>

      <div className="about-section">
        <h2>About Me</h2>
        <p>Entering the realm of React and Enjoying the process ! </p>
      </div>
    </div>
  );
}

export default Home;

