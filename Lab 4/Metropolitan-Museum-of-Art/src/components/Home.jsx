import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to The Metropolitan Museum of Art Collection</h1>
      <p>Explore the world of art and creativity!</p>

      {/* Link to the first page of paginated art collection */}
      <Link to="/collection/page/1"> Browse Art Collections</Link>
    </div>
  );
}

export default Home;
