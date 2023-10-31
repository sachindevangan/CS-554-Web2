import React from 'react';
import './Home.css'; 
import fav from '../img/fav.jpg'

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>A Journey Through Art and Culture!</h1>
      </div>

      <div className="favorite-art-section">
        <h2>My Favorite Artwork: Shakuntala by Raja Ravi Varma</h2>
        <img
          src={fav}
          alt="Shakuntala by Raja Ravi Varma"
          className="favorite-art-image"
        />
        <p>
        "Shakuntala" by Raja Ravi Varma really speaks to me. I've always been fascinated by the Mahabharata, having read it and watched numerous TV shows based on its epic stories. This painting, in particular, captures a moment that I remember from those narratives. It shows Shakuntala, pretending to remove a thorn from her foot, her eyes searching for her lover Dushyanta in the distance. Her friends chat nearby, and there's this mysterious figure with a cane in the background, adding an element of mystery. What I find so enchanting about this painting is how it takes me back to those cozy moments with my family, huddled together, engrossed in the Mahabharata tales. The painting's colors, Shakuntala's expression, and the overall scene resonate with the emotions we shared during those family times. It's like a beautiful reminder of the bond we all have over these timeless stories, connecting us across generations
        </p>
      </div>

      <div className="explore-section">
        <h2>Explore the beautiful collection of arts through your eyes</h2>
        <p>Dive into the vast collection of The Metropolitan Museum of Art. Discover masterpieces from different eras, cultures, and styles.</p>
      </div>

      <div className="about-section">
        <h2>About Me</h2>
        <p>Entering the realm of React and Enjoying the process ! </p>
      </div>
    </div>
  );
}

export default Home;

