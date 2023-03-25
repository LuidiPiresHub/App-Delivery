import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkEmailAndPassword } from '../utils/checkUser';
import loginApi, { setToken } from '../axios/config';
import logo from '../styles/images/logo.png';
import cellPhone from '../styles/images/cellphone.png';
import apps from '../styles/images/apps.png';
import '../styles/login.css';

import dataTestsIds from '../utils/dataTestsIds';

export default function Login() {
  const [user, setUser] = useState({ email: '', password: '' });
  const [isDisable, setIsDisable] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const translate = {
    administrator: '/admin/manage',
    seller: '/seller/orders',
    customer: '/customer/products',
  };

  const handleChange = ({ target: { name, value } }) => {
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const navigate = useNavigate();

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('user'));
    if (local) navigate('/customer/products');
  }, []);

  useEffect(() => {
    const validateForm = () => {
      const { email, password } = user;
      if (checkEmailAndPassword(email, password)) {
        setIsDisable(false);
      } else {
        setIsDisable(true);
      }
    };
    validateForm();
  }, [user]);

  const login = async (event) => {
    event.preventDefault();
    try {
      const { data } = await loginApi.post('/login', user);
      setToken(data.token);
      const { id, ...userInfo } = data;
      localStorage.setItem('user', JSON.stringify(userInfo));
      localStorage.setItem('userId', JSON.stringify(id));
      navigate(translate[data.role]);
    } catch ({ response: { data: { message } } }) {
      setErrorMessage(message);
    }
  };

  return (
    <section className="sectionContainer">
      <section className="loginSection">
        <img src={ cellPhone } alt="cellphone" className="cellphone" />
        <section className="formSection">
          <img src={ logo } className="app" alt="logo" />
          <form className="form" onSubmit={ login }>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="Email"
              onChange={ handleChange }
              data-testid={ dataTestsIds[1] }
            />
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Password"
              onChange={ handleChange }
              data-testid={ dataTestsIds[2] }
            />
            <button
              className="loginBtn"
              type="submit"
              disabled={ isDisable }
              data-testid={ dataTestsIds[3] }
            >
              Entrar
            </button>
            <button
              className="createAccount"
              type="submit"
              data-testid={ dataTestsIds[4] }
              onClick={ () => navigate('/register') }
            >
              Ainda não tenho conta
            </button>
            <span
              className="loginError"
              data-testid={ dataTestsIds[5] }
              style={ { display: errorMessage ? 'block' : 'none' } }
            >
              {errorMessage}
            </span>
          </form>
          <p className="getApp">Obtenha o Aplicativo</p>
          <img src={ apps } alt="apps logo" className="appsLogo" />
        </section>
      </section>
    </section>
  );
}
