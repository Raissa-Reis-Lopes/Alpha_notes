import React, { useEffect } from 'react';
import './HomePage.css';

const HomePage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
        document.body.classList.add('home-page');
        return () => {
            document.body.classList.remove('home-page');
        };
    }, []);

    return (
        <div className="home-page" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
        }}>
            {children}
        </div>
    );
};

export default HomePage;
