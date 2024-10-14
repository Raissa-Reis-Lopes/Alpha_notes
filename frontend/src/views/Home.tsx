import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const Home: React.FC = () => {
  const userContext = useContext(UserContext);

  return (
    <div>
      <h2>Home</h2>
      {userContext?.user ? (
        <p>Welcome, {userContext.user.name}!</p>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
};

export default Home;
