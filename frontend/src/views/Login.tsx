import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, useUser } from '../contexts/UserContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  //const userContext = useContext(UserContext);
  const { user, setUser } = useUser();

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = { email, password };

    setUser(email);
    navigate('/home');
    return;

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        navigate('/home'); // Redireciona para a página home
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
        // Lógica para exibir erro ao usuário
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '11rem' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          ref={emailInputRef}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
