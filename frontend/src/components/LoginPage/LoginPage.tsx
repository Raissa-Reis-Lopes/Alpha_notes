import React, { useEffect } from 'react';
import './LoginPage.css';

const LoginPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
        document.body.classList.add('login-page');
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    return (
        <div className="login-page" style={{
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

export default LoginPage;
