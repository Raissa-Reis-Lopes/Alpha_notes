import React, { useEffect } from 'react';
import './RegisterPage.css';

const RegisterPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
        document.body.classList.add('register-page');
        return () => {
            document.body.classList.remove('register-page');
        };
    }, []);

    return (
        <div className="register-page" style={{
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

export default RegisterPage;
