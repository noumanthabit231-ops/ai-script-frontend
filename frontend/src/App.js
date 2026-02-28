import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `https://ai-script-backend-production.up.railway.app/api`;

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`);
      setUser(response.data);
    } catch (e) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post(`${API}/auth/login`, { email, password });
    const { access_token, user } = response.data;
    localStorage.setItem('token', access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    setToken(access_token);
    setUser(user);
    return user;
  };

  const register = async (email, password, company_name, phone) => {
    const response = await axios.post(`${API}/auth/register`, { email, password, company_name, phone });
    const { access_token, user } = response.data;
    localStorage.setItem('token', access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    setToken(access_token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Landing Page
const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-heading font-bold text-lg tracking-tight">Скриптолог</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900"
              data-testid="login-nav-btn"
            >
              Войти
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-orange-500 text-white rounded-sm font-medium hover:bg-orange-600 transition-colors"
              data-testid="register-nav-btn"
            >
              Начать бесплатно
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-heading text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 leading-tight">
              AI-помощник для ваших менеджеров
            </h1>
            <p className="mt-6 text-xl text-zinc-600 leading-relaxed">
              Подсказывает лучший ответ клиенту прямо в WhatsApp. 
              Новый менеджер продаёт как опытный с первого дня.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-orange-500 text-white rounded-sm font-bold text-lg hover:bg-orange-600 transition-colors shadow-sm"
                data-testid="hero-cta-btn"
              >
                Попробовать 24 часа бесплатно
              </button>
              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border border-zinc-300 text-zinc-700 rounded-sm font-medium text-lg hover:bg-zinc-50 transition-colors"
                data-testid="learn-more-btn"
              >
                Узнать больше
              </button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Без привязки карты
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Настройка за 10 минут
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-zinc-100 rounded-sm p-8 border border-zinc-200">
              <div className="bg-white rounded-sm border border-zinc-200 p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-100">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">К</div>
                  <div>
                    <div className="font-medium text-zinc-900">Клиент</div>
                    <div className="text-sm text-zinc-500">WhatsApp</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-zinc-100 rounded-sm p-3 max-w-xs">
                    <p className="text-sm text-zinc-700">Дорого, я видел дешевле у других</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-sm p-3 ml-auto max-w-xs">
                    <div className="flex items-center gap-2 mb-2 text-orange-600 text-xs font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      AI-подсказка
                    </div>
                    <p className="text-sm text-zinc-700">Понимаю! А вы сравнивали что входит в стоимость? У нас включена доставка, установка и гарантия 5 лет. У других это отдельно +15,000₸</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-zinc-900">Как это работает</h2>
            <p className="mt-4 text-xl text-zinc-600">Три простых шага к росту продаж</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-sm border border-zinc-200">
              <div className="w-12 h-12 bg-orange-100 rounded-sm flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-900 mb-3">Настройте базу</h3>
              <p className="text-zinc-600">Добавьте продукты, цены и ответы на частые возражения клиентов</p>
            </div>
            <div className="bg-white p-8 rounded-sm border border-zinc-200">
              <div className="w-12 h-12 bg-orange-100 rounded-sm flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-900 mb-3">Установите расширение</h3>
              <p className="text-zinc-600">Менеджеры устанавливают Chrome-расширение за 30 секунд</p>
            </div>
            <div className="bg-white p-8 rounded-sm border border-zinc-200">
              <div className="w-12 h-12 bg-orange-100 rounded-sm flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-900 mb-3">Продавайте больше</h3>
              <p className="text-zinc-600">AI анализирует чат и даёт лучший ответ одним кликом</p>
            </div>
          </div>
        </div>
      </section>

      {/* AmoCRM Integration Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 bg-orange-500 text-white text-sm font-bold rounded-full mb-4">
              ТОЛЬКО В PRO
            </div>
            <h2 className="font-heading text-4xl font-bold text-zinc-900 mb-4">Работает везде, не только WhatsApp</h2>
            <p className="text-xl text-zinc-600">Расширение активно в AmoCRM, Telegram Web и других сервисах</p>
          </div>

          <div className="bg-white rounded-sm border-2 border-orange-200 p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-heading text-2xl font-bold text-zinc-900 mb-4">
                  💡 Универсальное расширение
                </h3>
                <p className="text-zinc-600 mb-6">
                  Кнопка AI появляется на любом сайте. Вставьте сообщения из AmoCRM, Telegram или другого мессенджера — получите подсказку прямо на странице.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-medium text-zinc-900">Работает на любых сайтах</div>
                      <div className="text-sm text-zinc-500">AmoCRM, Telegram Web, и другие</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-medium text-zinc-900">Встроенная панель</div>
                      <div className="text-sm text-zinc-500">Вставьте текст — получите ответ</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-medium text-zinc-900">Эксклюзивно для Pro</div>
                      <div className="text-sm text-zinc-500">Обычные пользователи - только WhatsApp</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-zinc-50 rounded-sm border border-zinc-200 p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <span>Откройте AmoCRM (или другой сайт)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <span>Нажмите кнопку AI (появится на странице)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <span>Вставьте сообщения в текстовое поле</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                    <span>Получите AI подсказку за 2 секунды</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-orange-100 rounded-sm">
                  <p className="text-sm font-medium text-orange-900">
                    💎 Эксклюзивно для тарифа Про
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    60,000₸/мес • 5,000 подсказок/мес
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-zinc-900 mb-4">Простые тарифы</h2>
            <p className="text-xl text-zinc-600">Оплата через Kaspi — просто и удобно</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Старт */}
            <div className="bg-white border-2 border-zinc-200 rounded-sm p-8 hover:border-orange-300 transition-all">
              <div className="text-sm font-medium text-orange-600 mb-2">СТАРТ</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-heading font-bold text-zinc-900">15,000</span>
                <span className="text-lg text-zinc-500">₸/мес</span>
              </div>
              <p className="text-sm text-zinc-500 mb-6">Для небольшой команды</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  300 AI-подсказок в месяц
                </li>
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  До 2 менеджеров
                </li>
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Продукты без лимита
                </li>
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  База возражений
                </li>
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Аналитика
                </li>
              </ul>
              <button
                onClick={() => navigate('/register')}
                className="w-full py-3 border-2 border-zinc-900 text-zinc-900 rounded-sm font-bold hover:bg-zinc-50 transition-colors"
              >
                Начать бесплатно
              </button>
            </div>

            {/* Бизнес - Популярный */}
            <div className="bg-white border-2 border-orange-500 rounded-sm p-8 relative shadow-lg scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                ПОПУЛЯРНЫЙ
              </div>
              <div className="text-sm font-medium text-orange-600 mb-2">БИЗНЕС</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-heading font-bold text-zinc-900">35,000</span>
                <span className="text-lg text-zinc-500">₸/мес</span>
              </div>
              <p className="text-sm text-zinc-500 mb-6">Для растущего бизнеса</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  1,000 AI-подсказок в месяц
                </li>
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  До 5 менеджеров
                </li>
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Продукты без лимита
                </li>
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  База возражений
                </li>
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Аналитика
                </li>
              </ul>
              <button
                onClick={() => navigate('/register')}
                className="w-full py-3 bg-orange-500 text-white rounded-sm font-bold hover:bg-orange-600 transition-colors"
                data-testid="pricing-cta-btn"
              >
                Начать бесплатно
              </button>
            </div>

            {/* Про */}
            <div className="bg-white border-2 border-zinc-200 rounded-sm p-8 hover:border-orange-300 transition-all">
              <div className="text-sm font-medium text-orange-600 mb-2">ПРО</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-heading font-bold text-zinc-900">60,000</span>
                <span className="text-lg text-zinc-500">₸/мес</span>
              </div>
              <p className="text-sm text-zinc-500 mb-6">Для крупных компаний</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  5,000 AI-подсказок в месяц
                </li>
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  До 20 менеджеров
                </li>
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Продукты без лимита
                </li>
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  База возражений
                </li>
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Расширенная аналитика
                </li>
                <li className="flex items-center gap-3 text-zinc-700 text-sm">
                  <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                  <span className="font-medium">💡 Расширение работает везде</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/register')}
                className="w-full py-3 border-2 border-zinc-900 text-zinc-900 rounded-sm font-bold hover:bg-zinc-50 transition-colors"
              >
                Начать бесплатно
              </button>
            </div>
          </div>

          <p className="text-center text-zinc-500 mt-8 text-sm">
            Все тарифы включают 24-часовой бесплатный пробный период
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-zinc-900 rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <span className="font-heading font-bold text-sm">Скриптолог</span>
          </div>
          <p className="text-sm text-zinc-500">© 2024 ИП HIKM AI. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

// Login Page
const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (e) {
      setError(e.response?.data?.detail || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-zinc-900 rounded-sm flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <span className="font-heading font-bold text-xl">Скриптолог</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-zinc-900">Вход в аккаунт</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-sm border border-zinc-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-sm text-sm" data-testid="login-error">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="email@company.kz"
              required
              data-testid="login-email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-700 mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="••••••••"
              required
              data-testid="login-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 text-white rounded-sm font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
            data-testid="login-submit"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
          <p className="mt-4 text-center text-sm text-zinc-600">
            Нет аккаунта?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-orange-600 font-medium hover:underline"
              data-testid="goto-register"
            >
              Зарегистрироваться
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

// Register Page
const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    company_name: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.company_name, formData.phone);
      navigate('/dashboard');
    } catch (e) {
      setError(e.response?.data?.detail || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-zinc-900 rounded-sm flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <span className="font-heading font-bold text-xl">Скриптолог</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-zinc-900">Создать аккаунт</h1>
          <p className="text-zinc-600 mt-2">24 часа бесплатно, без привязки карты</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-sm border border-zinc-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-sm text-sm" data-testid="register-error">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-700 mb-2">Название компании</label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              className="w-full px-4 py-3 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="ТОО Рога и Копыта"
              required
              data-testid="register-company"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="email@company.kz"
              required
              data-testid="register-email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-700 mb-2">Телефон</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="+7 777 123 4567"
              data-testid="register-phone"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-700 mb-2">Пароль</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Минимум 6 символов"
              required
              minLength={6}
              data-testid="register-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 text-white rounded-sm font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
            data-testid="register-submit"
          >
            {loading ? 'Создание...' : 'Создать аккаунт'}
          </button>
          <p className="mt-4 text-center text-sm text-zinc-600">
            Уже есть аккаунт?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-orange-600 font-medium hover:underline"
              data-testid="goto-login"
            >
              Войти
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

// Dashboard Components
const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userTier, setUserTier] = useState(null);

  useEffect(() => {
    // Fetch user subscription tier
    const fetchTier = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/subscription`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUserTier(response.data.tier);
      } catch (error) {
        console.error('Failed to fetch tier:', error);
      }
    };
    fetchTier();
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Обзор', icon: '📊', path: '/dashboard' },
    { id: 'company', label: 'Компания', icon: '🏢', path: '/dashboard/company' },
    { id: 'products', label: 'Продукты', icon: '📦', path: '/dashboard/products' },
    { id: 'objections', label: 'Возражения', icon: '💬', path: '/dashboard/objections' },
    { id: 'managers', label: 'Менеджеры', icon: '👥', path: '/dashboard/managers' },
    { id: 'subscription', label: 'Подписка', icon: '💳', path: '/dashboard/subscription' },
    { id: 'extension', label: 'Расширение', icon: '🔌', path: '/dashboard/extension' },
  ];

  // Filter menu items based on tier
  const visibleMenuItems = menuItems.filter(item => {
    if (item.proOnly && userTier !== 'pro') {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-zinc-200 flex flex-col transition-all duration-200`}>
        <div className="p-4 border-b border-zinc-200 flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-sm flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          {sidebarOpen && <span className="font-heading font-bold text-sm truncate">Скриптолог</span>}
        </div>
        <nav className="flex-1 p-2">
          {visibleMenuItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-left mb-1 transition-colors ${
                window.location.pathname === item.path
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-zinc-600 hover:bg-zinc-50'
              }`}
              data-testid={`nav-${item.id}`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && (
                <span className="text-sm font-medium flex items-center gap-2">
                  {item.label}
                  {item.proOnly && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-orange-500 text-white rounded">PRO</span>
                  )}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-200">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-zinc-600 hover:bg-zinc-50 rounded-sm"
            data-testid="logout-btn"
          >
            <span className="text-lg">🚪</span>
            {sidebarOpen && <span className="text-sm font-medium">Выйти</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-zinc-100 rounded-sm"
            data-testid="toggle-sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600">{user?.company_name}</span>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-orange-700">
                {user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// Overview Page
const OverviewPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API}/analytics`);
      setAnalytics(response.data);
    } catch (e) {
      console.error('Analytics error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div data-testid="overview-page">
      <h1 className="font-heading text-2xl font-bold text-zinc-900 mb-6">Обзор</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-sm border border-zinc-200">
          <div className="text-3xl font-bold text-zinc-900 font-mono">{analytics?.total_hints || 0}</div>
          <div className="text-sm text-zinc-500 mt-1">Подсказок использовано</div>
        </div>
        <div className="bg-white p-6 rounded-sm border border-zinc-200">
          <div className="text-3xl font-bold text-zinc-900 font-mono">{analytics?.total_products || 0}</div>
          <div className="text-sm text-zinc-500 mt-1">Продуктов</div>
        </div>
        <div className="bg-white p-6 rounded-sm border border-zinc-200">
          <div className="text-3xl font-bold text-zinc-900 font-mono">{analytics?.total_objections || 0}</div>
          <div className="text-sm text-zinc-500 mt-1">Возражений</div>
        </div>
        <div className="bg-white p-6 rounded-sm border border-zinc-200">
          <div className="text-3xl font-bold text-zinc-900 font-mono">{analytics?.total_managers || 0}</div>
          <div className="text-sm text-zinc-500 mt-1">Менеджеров</div>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-zinc-200">
        <div className="px-6 py-4 border-b border-zinc-200">
          <h2 className="font-heading font-bold text-zinc-900">Последние подсказки</h2>
        </div>
        <div className="p-6">
          {analytics?.recent_hints?.length > 0 ? (
            <div className="space-y-4">
              {analytics.recent_hints.map((hint, i) => (
                <div key={i} className="p-4 bg-zinc-50 rounded-sm">
                  <p className="text-sm text-zinc-700">{hint.hint}</p>
                  <p className="text-xs text-zinc-400 mt-2">
                    {new Date(hint.created_at).toLocaleString('ru-RU')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-center py-8">Подсказки пока не использовались</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Company Page
const CompanyPage = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newAdvantage, setNewAdvantage] = useState('');

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await axios.get(`${API}/company`);
      setCompany(response.data);
    } catch (e) {
      console.error('Company error:', e);
    } finally {
      setLoading(false);
    }
  };

  const saveCompany = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/company`, {
        name: company.name,
        description: company.description,
        advantages: company.advantages,
        phone: company.phone,
        address: company.address
      });
    } catch (e) {
      console.error('Save error:', e);
    } finally {
      setSaving(false);
    }
  };

  const addAdvantage = () => {
    if (newAdvantage.trim()) {
      setCompany({
        ...company,
        advantages: [...(company.advantages || []), newAdvantage.trim()]
      });
      setNewAdvantage('');
    }
  };

  const removeAdvantage = (index) => {
    setCompany({
      ...company,
      advantages: company.advantages.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div data-testid="company-page">
      <h1 className="font-heading text-2xl font-bold text-zinc-900 mb-6">Информация о компании</h1>
      
      <div className="bg-white rounded-sm border border-zinc-200 p-6">
        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Название компании</label>
            <input
              type="text"
              value={company?.name || ''}
              onChange={(e) => setCompany({...company, name: e.target.value})}
              className="w-full px-4 py-3 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              data-testid="company-name-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Описание (для AI)</label>
            <textarea
              value={company?.description || ''}
              onChange={(e) => setCompany({...company, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Опишите чем занимается ваша компания, какие услуги оказывает..."
              data-testid="company-description-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Преимущества</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {(company?.advantages || []).map((adv, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-sm text-sm"
                >
                  {adv}
                  <button
                    onClick={() => removeAdvantage(i)}
                    className="hover:text-orange-900"
                    data-testid={`remove-advantage-${i}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAdvantage}
                onChange={(e) => setNewAdvantage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAdvantage()}
                className="flex-1 px-4 py-2 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Добавить преимущество..."
                data-testid="new-advantage-input"
              />
              <button
                onClick={addAdvantage}
                className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-sm hover:bg-zinc-200"
                data-testid="add-advantage-btn"
              >
                Добавить
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Телефон</label>
              <input
                type="tel"
                value={company?.phone || ''}
                onChange={(e) => setCompany({...company, phone: e.target.value})}
                className="w-full px-4 py-3 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                data-testid="company-phone-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Адрес</label>
              <input
                type="text"
                value={company?.address || ''}
                onChange={(e) => setCompany({...company, address: e.target.value})}
                className="w-full px-4 py-3 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                data-testid="company-address-input"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={saveCompany}
              disabled={saving}
              className="px-6 py-3 bg-orange-500 text-white rounded-sm font-medium hover:bg-orange-600 disabled:opacity-50"
              data-testid="save-company-btn"
            >
              {saving ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Products Page
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', features: [] });
  const [newFeature, setNewFeature] = useState('');
  const [importing, setImporting] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (e) {
      console.error('Products error:', e);
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async () => {
    try {
      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, {
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          features: formData.features
        });
      } else {
        await axios.post(`${API}/products`, {
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          features: formData.features
        });
      }
      fetchProducts();
      resetForm();
    } catch (e) {
      console.error('Save error:', e);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Удалить продукт?')) {
      try {
        await axios.delete(`${API}/products/${id}`);
        fetchProducts();
      } catch (e) {
        console.error('Delete error:', e);
      }
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description || '',
      features: product.features || []
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', price: '', description: '', features: [] });
    setNewFeature('');
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const downloadTemplate = () => {
    window.open(`${API}/products/template`, '_blank');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API}/products/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(response.data.message);
      fetchProducts();
    } catch (e) {
      alert(e.response?.data?.detail || 'Ошибка импорта');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div data-testid="products-page">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-zinc-900">Продукты</h1>
        <div className="flex gap-2">
          <button
            onClick={downloadTemplate}
            className="px-4 py-2 border border-zinc-200 text-zinc-700 rounded-sm font-medium hover:bg-zinc-50"
            data-testid="download-template-btn"
          >
            Скачать шаблон
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="px-4 py-2 border border-orange-200 text-orange-700 rounded-sm font-medium hover:bg-orange-50 disabled:opacity-50"
            data-testid="import-products-btn"
          >
            {importing ? 'Импорт...' : 'Импорт Excel'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-sm font-medium hover:bg-orange-600"
            data-testid="add-product-btn"
          >
            + Добавить
          </button>
        </div>
      </div>

      {/* Import Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Быстрый импорт:</strong> Скачайте шаблон Excel, заполните данные и загрузите файл. 
          Колонки: Название, Цена, Описание, Особенности (через запятую).
        </p>
      </div>

      {showForm && (
        <div className="bg-white rounded-sm border border-zinc-200 p-6 mb-6">
          <h2 className="font-heading font-bold text-zinc-900 mb-4">
            {editingProduct ? 'Редактировать продукт' : 'Новый продукт'}
          </h2>
          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Название</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Окно ПВХ 1.5x1.2м"
                  data-testid="product-name-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Цена (₸)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-2 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="45000"
                  data-testid="product-price-input"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={2}
                className="w-full px-4 py-2 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Пластиковое окно с двойным стеклопакетом..."
                data-testid="product-description-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Характеристики</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.features.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-sm text-sm">
                    {f}
                    <button
                      onClick={() => setFormData({
                        ...formData,
                        features: formData.features.filter((_, idx) => idx !== i)
                      })}
                      className="text-zinc-400 hover:text-zinc-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  className="flex-1 px-3 py-2 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Добавить характеристику..."
                  data-testid="product-feature-input"
                />
                <button
                  onClick={addFeature}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-sm hover:bg-zinc-200"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-zinc-200 rounded-sm text-zinc-600 hover:bg-zinc-50"
                data-testid="cancel-product-btn"
              >
                Отмена
              </button>
              <button
                onClick={saveProduct}
                className="px-4 py-2 bg-orange-500 text-white rounded-sm font-medium hover:bg-orange-600"
                data-testid="save-product-btn"
              >
                {editingProduct ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-sm border border-zinc-200">
        {products.length > 0 ? (
          <div className="divide-y divide-zinc-200">
            {products.map(product => (
              <div key={product.id} className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-zinc-900">{product.name}</h3>
                  <p className="text-sm text-zinc-500">{product.description}</p>
                  <p className="text-lg font-mono font-bold text-orange-600 mt-1">
                    {product.price.toLocaleString()} ₸
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editProduct(product)}
                    className="px-3 py-1 text-sm border border-zinc-200 rounded-sm hover:bg-zinc-50"
                    data-testid={`edit-product-${product.id}`}
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="px-3 py-1 text-sm border border-red-200 text-red-600 rounded-sm hover:bg-red-50"
                    data-testid={`delete-product-${product.id}`}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-500">
            <p>Продукты не добавлены</p>
            <p className="text-sm mt-2">Добавьте продукты чтобы AI мог использовать их в подсказках</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Objections Page
const ObjectionsPage = () => {
  const [objections, setObjections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingObjection, setEditingObjection] = useState(null);
  const [formData, setFormData] = useState({ trigger: '', response: '', category: 'general' });
  const [aiModeEnabled, setAiModeEnabled] = useState(false);
  const [importing, setImporting] = useState(false);
  const [savingAiMode, setSavingAiMode] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchObjections();
    fetchCompanySettings();
  }, []);

  const fetchCompanySettings = async () => {
    try {
      const response = await axios.get(`${API}/company`);
      setAiModeEnabled(response.data.ai_mode_enabled || false);
    } catch (e) {
      console.error('Settings error:', e);
    }
  };

  const fetchObjections = async () => {
    try {
      const response = await axios.get(`${API}/objections`);
      setObjections(response.data);
    } catch (e) {
      console.error('Objections error:', e);
    } finally {
      setLoading(false);
    }
  };

  const saveObjection = async () => {
    try {
      if (editingObjection) {
        await axios.put(`${API}/objections/${editingObjection.id}`, formData);
      } else {
        await axios.post(`${API}/objections`, formData);
      }
      fetchObjections();
      resetForm();
    } catch (e) {
      console.error('Save error:', e);
    }
  };

  const deleteObjection = async (id) => {
    if (window.confirm('Удалить возражение?')) {
      try {
        await axios.delete(`${API}/objections/${id}`);
        fetchObjections();
      } catch (e) {
        console.error('Delete error:', e);
      }
    }
  };

  const editObjection = (objection) => {
    setEditingObjection(objection);
    setFormData({
      trigger: objection.trigger,
      response: objection.response,
      category: objection.category || 'general'
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingObjection(null);
    setFormData({ trigger: '', response: '', category: 'general' });
  };

  const categories = {
    'general': 'Общие',
    'price': 'Цена',
    'quality': 'Качество',
    'competitors': 'Конкуренты',
    'timing': 'Сроки'
  };

  const downloadTemplate = () => {
    window.open(`${API}/objections/template`, '_blank');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await axios.post(`${API}/objections/import`, uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(response.data.message);
      fetchObjections();
    } catch (e) {
      alert(e.response?.data?.detail || 'Ошибка импорта');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const toggleAiMode = async () => {
    setSavingAiMode(true);
    try {
      await axios.put(`${API}/company/ai-settings`, { ai_mode_enabled: !aiModeEnabled });
      setAiModeEnabled(!aiModeEnabled);
    } catch (e) {
      console.error('AI mode error:', e);
    } finally {
      setSavingAiMode(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div data-testid="objections-page">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-zinc-900">Возражения</h1>
        <div className="flex gap-2">
          <button
            onClick={downloadTemplate}
            className="px-4 py-2 border border-zinc-200 text-zinc-700 rounded-sm font-medium hover:bg-zinc-50"
            data-testid="download-objections-template-btn"
          >
            Скачать шаблон
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="px-4 py-2 border border-orange-200 text-orange-700 rounded-sm font-medium hover:bg-orange-50 disabled:opacity-50"
            data-testid="import-objections-btn"
          >
            {importing ? 'Импорт...' : 'Импорт Excel'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-sm font-medium hover:bg-orange-600"
            data-testid="add-objection-btn"
          >
            + Добавить
          </button>
        </div>
      </div>

      {/* AI Mode Toggle */}
      <div className={`rounded-sm p-4 mb-6 border ${aiModeEnabled ? 'bg-purple-50 border-purple-200' : 'bg-zinc-50 border-zinc-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-zinc-900">AI-режим возражений</h3>
            <p className="text-sm text-zinc-500 mt-1">
              {aiModeEnabled 
                ? 'AI сам придумывает ответы на возражения без базы данных'
                : 'AI использует вашу базу возражений для ответов'}
            </p>
          </div>
          <button
            onClick={toggleAiMode}
            disabled={savingAiMode}
            className={`relative w-14 h-8 rounded-full transition-colors ${aiModeEnabled ? 'bg-purple-500' : 'bg-zinc-300'}`}
            data-testid="ai-mode-toggle"
          >
            <span className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${aiModeEnabled ? 'left-7' : 'left-1'}`}></span>
          </button>
        </div>
        {aiModeEnabled && (
          <div className="mt-3 p-3 bg-purple-100 rounded-sm">
            <p className="text-sm text-purple-800">
              <strong>Включен AI-режим:</strong> Менеджеры получают подсказки от AI который сам анализирует возражения и генерирует ответы на основе данных о компании и продуктах.
            </p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-sm border border-zinc-200 p-6 mb-6">
          <h2 className="font-heading font-bold text-zinc-900 mb-4">
            {editingObjection ? 'Редактировать возражение' : 'Новое возражение'}
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Когда клиент говорит (триггер)
              </label>
              <input
                type="text"
                value={formData.trigger}
                onChange={(e) => setFormData({...formData, trigger: e.target.value})}
                className="w-full px-4 py-2 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Дорого / У других дешевле / Подумаю..."
                data-testid="objection-trigger-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Ответ</label>
              <textarea
                value={formData.response}
                onChange={(e) => setFormData({...formData, response: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Понимаю! А вы сравнивали что входит в стоимость?..."
                data-testid="objection-response-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Категория</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                data-testid="objection-category-select"
              >
                {Object.entries(categories).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-zinc-200 rounded-sm text-zinc-600 hover:bg-zinc-50"
                data-testid="cancel-objection-btn"
              >
                Отмена
              </button>
              <button
                onClick={saveObjection}
                className="px-4 py-2 bg-orange-500 text-white rounded-sm font-medium hover:bg-orange-600"
                data-testid="save-objection-btn"
              >
                {editingObjection ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-sm border border-zinc-200">
        {objections.length > 0 ? (
          <div className="divide-y divide-zinc-200">
            {objections.map(objection => (
              <div key={objection.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs rounded-sm mb-2">
                      {categories[objection.category] || 'Общие'}
                    </span>
                    <p className="font-medium text-zinc-900">"{objection.trigger}"</p>
                    <p className="text-sm text-zinc-600 mt-2 bg-orange-50 p-3 rounded-sm border-l-2 border-orange-300">
                      {objection.response}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => editObjection(objection)}
                      className="px-3 py-1 text-sm border border-zinc-200 rounded-sm hover:bg-zinc-50"
                      data-testid={`edit-objection-${objection.id}`}
                    >
                      Изменить
                    </button>
                    <button
                      onClick={() => deleteObjection(objection.id)}
                      className="px-3 py-1 text-sm border border-red-200 text-red-600 rounded-sm hover:bg-red-50"
                      data-testid={`delete-objection-${objection.id}`}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-500">
            <p>Возражения не добавлены</p>
            <p className="text-sm mt-2">Добавьте типичные возражения клиентов и готовые ответы на них</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Managers Page
const ManagersPage = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const response = await axios.get(`${API}/managers`);
      setManagers(response.data);
    } catch (e) {
      console.error('Managers error:', e);
    } finally {
      setLoading(false);
    }
  };

  const createManager = async () => {
    try {
      await axios.post(`${API}/managers`, formData);
      fetchManagers();
      setShowForm(false);
      setFormData({ email: '', password: '', name: '' });
    } catch (e) {
      alert(e.response?.data?.detail || 'Ошибка создания менеджера');
    }
  };

  const deleteManager = async (id) => {
    if (window.confirm('Удалить менеджера?')) {
      try {
        await axios.delete(`${API}/managers/${id}`);
        fetchManagers();
      } catch (e) {
        console.error('Delete error:', e);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div data-testid="managers-page">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-zinc-900">Менеджеры</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-sm font-medium hover:bg-orange-600"
          data-testid="add-manager-btn"
        >
          + Добавить менеджера
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-sm border border-zinc-200 p-6 mb-6">
          <h2 className="font-heading font-bold text-zinc-900 mb-4">Новый менеджер</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Имя</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Айдос"
                data-testid="manager-name-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="manager@company.kz"
                data-testid="manager-email-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Пароль</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2 border border-zinc-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="••••••••"
                data-testid="manager-password-input"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData({ email: '', password: '', name: '' });
                }}
                className="px-4 py-2 border border-zinc-200 rounded-sm text-zinc-600 hover:bg-zinc-50"
                data-testid="cancel-manager-btn"
              >
                Отмена
              </button>
              <button
                onClick={createManager}
                className="px-4 py-2 bg-orange-500 text-white rounded-sm font-medium hover:bg-orange-600"
                data-testid="save-manager-btn"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-sm border border-zinc-200">
        {managers.length > 0 ? (
          <div className="divide-y divide-zinc-200">
            {managers.map(manager => (
              <div key={manager.id} className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-zinc-900">{manager.name}</h3>
                  <p className="text-sm text-zinc-500">{manager.email}</p>
                </div>
                <button
                  onClick={() => deleteManager(manager.id)}
                  className="px-3 py-1 text-sm border border-red-200 text-red-600 rounded-sm hover:bg-red-50"
                  data-testid={`delete-manager-${manager.id}`}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-500">
            <p>Менеджеры не добавлены</p>
            <p className="text-sm mt-2">Создайте аккаунты для ваших менеджеров</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Subscription Page
const SubscriptionPage = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifying, setNotifying] = useState(false);
  const [selectedTier, setSelectedTier] = useState('start');
  const [buyingHints, setBuyingHints] = useState(false);
  const [selectedHintsPack, setSelectedHintsPack] = useState(100);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await axios.get(`${API}/subscription`);
      setSubscription(response.data);
      setSelectedTier(response.data.tier || 'start');
    } catch (e) {
      console.error('Subscription error:', e);
    } finally {
      setLoading(false);
    }
  };

  const notifyPayment = async (tier) => {
    setNotifying(true);
    try {
      await axios.post(`${API}/subscription/notify-payment?tier=${tier}`);
      alert('Уведомление отправлено! Доступ продлен на 24 часа для проверки оплаты.');
      fetchSubscription();
    } catch (e) {
      alert(e.response?.data?.detail || 'Ошибка отправки уведомления');
    } finally {
      setNotifying(false);
    }
  };

  const buyExtraHints = async () => {
    setBuyingHints(true);
    try {
      await axios.post(`${API}/subscription/buy-hints?pack_size=${selectedHintsPack}`);
      alert('Уведомление отправлено! После проверки оплаты будут добавлены подсказки.');
      fetchSubscription();
    } catch (e) {
      alert(e.response?.data?.detail || 'Ошибка');
    } finally {
      setBuyingHints(false);
    }
  };

  // Format remaining time until next confirm
  const formatTimeUntilConfirm = () => {
    if (!subscription?.hints_next_confirm_time) return null;
    const nextTime = new Date(subscription.hints_next_confirm_time);
    const now = new Date();
    const diffMs = nextTime - now;
    if (diffMs <= 0) return null;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} ч. ${minutes} мин.`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const tiers = subscription?.pricing_tiers || {
    start: { name: 'Старт', price: 15000, hints: 300, managers: 2 },
    business: { name: 'Бизнес', price: 35000, hints: 1000, managers: 5 },
    pro: { name: 'Про', price: 60000, hints: -1, managers: -1 }
  };

  return (
    <div data-testid="subscription-page">
      <h1 className="font-heading text-2xl font-bold text-zinc-900 mb-6">Подписка</h1>

      {/* Usage Stats */}
      <div className="bg-white rounded-sm border border-zinc-200 p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-zinc-500">Тариф</div>
            <div className="text-xl font-bold text-zinc-900">{subscription?.tier_name || 'Старт'}</div>
          </div>
          <div>
            <div className="text-sm text-zinc-500">Подсказок использовано</div>
            <div className="text-xl font-bold text-zinc-900">
              {subscription?.hints_used || 0} / {subscription?.hints_limit === -1 ? '∞' : (subscription?.hints_limit + (subscription?.extra_hints || 0))}
            </div>
            {subscription?.extra_hints > 0 && (
              <div className="text-xs text-green-600">+{subscription.extra_hints} доп.</div>
            )}
          </div>
          <div>
            <div className="text-sm text-zinc-500">Дней осталось</div>
            <div className="text-xl font-bold text-zinc-900">{subscription?.days_left || 0}</div>
          </div>
          <div>
            <div className="text-sm text-zinc-500">Статус</div>
            <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-sm text-sm font-medium ${
              subscription?.is_expired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {subscription?.is_expired ? 'Истекла' : 'Активна'}
            </div>
          </div>
        </div>
        
        {subscription?.hints_limit !== -1 && subscription?.hints_remaining <= 50 && subscription?.hints_remaining > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-sm flex items-center justify-between">
            <span className="text-sm text-yellow-800">Осталось мало подсказок ({subscription?.hints_remaining})</span>
            <a
              href="#extra-hints"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('extra-hints')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1 bg-yellow-500 text-white rounded-sm text-sm hover:bg-yellow-600"
              data-testid="buy-hints-btn"
            >
              Купить подсказки
            </a>
          </div>
        )}
      </div>

      {/* Tiers */}
      <h2 className="font-heading text-xl font-bold text-zinc-900 mb-4">Тарифы</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {Object.entries(tiers).map(([key, tier]) => (
          <div 
            key={key}
            className={`bg-white rounded-sm border-2 p-6 cursor-pointer transition-all ${
              selectedTier === key ? 'border-orange-500 shadow-lg' : 'border-zinc-200 hover:border-zinc-300'
            } ${subscription?.tier === key ? 'ring-2 ring-orange-200' : ''}`}
            onClick={() => setSelectedTier(key)}
          >
            {subscription?.tier === key && (
              <div className="text-xs font-medium text-orange-600 mb-2">ТЕКУЩИЙ ТАРИФ</div>
            )}
            <div className="text-lg font-bold text-zinc-900">{tier.name}</div>
            <div className="text-3xl font-bold text-zinc-900 mt-2">
              {tier.price.toLocaleString()}<span className="text-lg text-zinc-500">₸/мес</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {tier.hints === -1 ? 'Безлимит подсказок' : `${tier.hints} подсказок/мес`}
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {tier.managers === -1 ? 'Безлимит менеджеров' : `До ${tier.managers} менеджеров`}
              </li>
              {key === 'pro' && (
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                  <span className="font-medium text-orange-700">💡 Расширение работает везде (AmoCRM, Telegram)</span>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Payment */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-sm border border-zinc-200 p-6">
          <h2 className="font-heading font-bold text-zinc-900 mb-4">Оплата тарифа {tiers[selectedTier]?.name}</h2>
          
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-zinc-900 font-heading">
              {tiers[selectedTier]?.price.toLocaleString()} ₸
            </div>
            <div className="text-zinc-500">в месяц</div>
          </div>

          <div className="bg-zinc-50 p-4 rounded-sm mb-4">
            <p className="text-sm text-zinc-600 text-center mb-3">Отсканируйте QR или перейдите по ссылке</p>
            {subscription?.kaspi_qr && (
              <img 
                src={subscription.kaspi_qr} 
                alt="Kaspi QR" 
                className="max-w-[200px] mx-auto rounded-sm"
              />
            )}
          </div>

          <a
            href={subscription?.kaspi_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-[#F14635] text-white text-center rounded-sm font-bold hover:bg-[#D93F30] transition-colors mb-3"
            data-testid="kaspi-pay-link"
          >
            Оплатить через Kaspi
          </a>

          <button
            onClick={() => notifyPayment(selectedTier)}
            disabled={notifying}
            className="w-full py-3 border-2 border-zinc-900 text-zinc-900 rounded-sm font-bold hover:bg-zinc-50 transition-colors disabled:opacity-50"
            data-testid="notify-payment-btn"
          >
            {notifying ? 'Отправка...' : 'Я оплатил'}
          </button>
          
          <p className="text-xs text-zinc-400 text-center mt-3">
            После нажатия "Я оплатил" доступ продлится на 24 часа для проверки
          </p>
        </div>

        {/* Extra Hints Pack */}
        <div id="extra-hints" className="bg-white rounded-sm border border-zinc-200 p-6">
          <h2 className="font-heading font-bold text-zinc-900 mb-4">Дополнительные подсказки</h2>
          
          <p className="text-zinc-600 mb-4">
            Закончились подсказки? Купите дополнительный пакет без смены тарифа.
          </p>

          {/* Pack selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-700 mb-2">Выберите пакет</label>
            <div className="grid grid-cols-2 gap-2">
              {subscription?.extra_hints_packs && Object.entries(subscription.extra_hints_packs).map(([size, pack]) => (
                <button
                  key={size}
                  onClick={() => setSelectedHintsPack(parseInt(size))}
                  className={`p-3 rounded-sm border-2 text-left transition-all ${
                    selectedHintsPack === parseInt(size)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-zinc-200 hover:border-purple-300'
                  }`}
                  data-testid={`hints-pack-${size}`}
                >
                  <div className="font-bold text-zinc-900">+{pack.count}</div>
                  <div className="text-sm text-zinc-500">{pack.price.toLocaleString()}₸</div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected pack summary */}
          <div className="bg-purple-50 border border-purple-200 rounded-sm p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-900">
                  +{subscription?.extra_hints_packs?.[selectedHintsPack]?.count || selectedHintsPack}
                </div>
                <div className="text-sm text-purple-600">подсказок</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-900">
                  {(subscription?.extra_hints_packs?.[selectedHintsPack]?.price || 5000).toLocaleString()}₸
                </div>
              </div>
            </div>
          </div>

          {/* Kaspi payment link */}
          <a
            href={subscription?.kaspi_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-[#F14635] text-white text-center rounded-sm font-bold hover:bg-[#D93F30] transition-colors mb-3"
            data-testid="kaspi-hints-link"
          >
            Оплатить через Kaspi
          </a>

          {/* Confirm payment button with 24h protection */}
          {subscription?.hints_confirm_available ? (
            <button
              onClick={buyExtraHints}
              disabled={buyingHints}
              className="w-full py-3 border-2 border-purple-500 text-purple-700 rounded-sm font-bold hover:bg-purple-50 transition-colors disabled:opacity-50"
              data-testid="buy-extra-hints-btn"
            >
              {buyingHints ? 'Отправка...' : 'Я оплатил'}
            </button>
          ) : (
            <div className="w-full py-3 border-2 border-zinc-200 text-zinc-500 rounded-sm font-medium text-center">
              Повторить можно через {formatTimeUntilConfirm()}
            </div>
          )}

          {subscription?.pending_hints_pack && !subscription?.hints_confirm_available && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-sm text-sm text-yellow-800">
              Ожидается проверка оплаты за {subscription.pending_hints_pack} подсказок
            </div>
          )}

          <p className="text-xs text-zinc-400 text-center mt-3">
            После нажатия "Я оплатил" подсказки будут добавлены после проверки (до 24ч)
          </p>

          {subscription?.extra_hints > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-sm text-sm text-green-800">
              У вас есть {subscription.extra_hints} доп. подсказок
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Extension Page
const ExtensionPage = () => {
  const { token } = useAuth();
  
  return (
    <div data-testid="extension-page">
      <h1 className="font-heading text-2xl font-bold text-zinc-900 mb-6">Chrome-расширение</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-sm border border-zinc-200 p-6">
          <h2 className="font-heading font-bold text-zinc-900 mb-4">Установка</h2>
          
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <div>
                <p className="font-medium text-zinc-900">Скачайте расширение</p>
                <p className="text-sm text-zinc-500">Нажмите кнопку ниже для скачивания</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <div>
                <p className="font-medium text-zinc-900">Распакуйте архив</p>
                <p className="text-sm text-zinc-500">Извлеките файлы в удобную папку</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <div>
                <p className="font-medium text-zinc-900">Откройте chrome://extensions</p>
                <p className="text-sm text-zinc-500">Включите "Режим разработчика"</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <div>
                <p className="font-medium text-zinc-900">Загрузите расширение</p>
                <p className="text-sm text-zinc-500">"Загрузить распакованное расширение" → выберите папку</p>
              </div>
            </li>
          </ol>

          <a
            href={`${BACKEND_URL}/api/download-extension`}
            download
            className="mt-6 block w-full py-3 bg-orange-500 text-white text-center rounded-sm font-bold hover:bg-orange-600 transition-colors"
            data-testid="download-extension-btn"
          >
            Скачать расширение
          </a>
        </div>

        <div className="bg-white rounded-sm border border-zinc-200 p-6">
          <h2 className="font-heading font-bold text-zinc-900 mb-4">Авторизация в расширении</h2>
          
          <p className="text-zinc-600 mb-4">
            После установки расширения, войдите используя эти данные:
          </p>

          <div className="bg-zinc-50 p-4 rounded-sm">
            <p className="text-sm text-zinc-500 mb-2">Ваш токен для входа:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={token || ''}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded-sm text-sm font-mono"
                data-testid="extension-token"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(token);
                  alert('Токен скопирован!');
                }}
                className="px-3 py-2 bg-zinc-200 rounded-sm hover:bg-zinc-300 text-sm"
                data-testid="copy-token-btn"
              >
                Копировать
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-sm">
            <h3 className="font-medium text-orange-900 mb-2">Как пользоваться</h3>
            <ul className="text-sm text-orange-800 space-y-2">
              <li>• Откройте WhatsApp Web (web.whatsapp.com)</li>
              <li>• Нажмите на иконку AI-Скриптолог справа внизу</li>
              <li>• Выберите продукт из списка</li>
              <li>• Нажмите "Дай подсказку" когда нужна помощь</li>
              <li>• Скопируйте ответ и отправьте клиенту</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI Assistant Page (Pro only)
const AIAssistantPage = () => {
  const [subscription, setSubscription] = useState(null);
  const [chatText, setChatText] = useState('');
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [hintsInfo, setHintsInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/subscription`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSubscription(response.data);
      
      // Check if Pro tier
      if (response.data.tier !== 'pro') {
        alert('AI Помощник доступен только на тарифе Про. Обновите подписку.');
        navigate('/dashboard/subscription');
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    }
  };

  const getHint = async () => {
    if (!chatText.trim()) {
      alert('Вставьте сообщения из чата');
      return;
    }

    setLoading(true);
    setHint('');

    try {
      // 1. Готовим данные
      const lines = chatText.split('\n').filter(line => line.trim());
      const chatHistory = lines.map(line => {
        const isClient = line.toLowerCase().includes('клиент:') || 
                        line.toLowerCase().includes('client:') || 
                        !line.toLowerCase().includes('менеджер:');
        const text = line.replace(/^(клиент|client|менеджер|manager):/i, '').trim();
        return { role: isClient ? 'client' : 'manager', text };
      });

      // 2. ОТПРАВЛЯЕМ ЗАПРОС
      const response = await axios.post(
        `${BACKEND_URL}/api/ai/hint`,
        {
          chat_history: chatHistory,
          use_ai_mode: true
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      // 3. ОБНОВЛЯЕМ ИНТЕРФЕЙС И СИНХРОНИЗИРУЕМ СЧЕТЧИК
      setHint(response.data.hint);
      setHintsInfo({
        used: response.data.hints_used,
        limit: response.data.total_hints || response.data.hints_limit,
        extra: response.data.extra_hints || 0
      });

      if (setSubscription) {
        setSubscription(prev => ({ 
          ...prev, 
          hints_used: response.data.hints_used 
        }));
      }

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || 'Ошибка при получении подсказки');
    } finally {
      setLoading(false);
    }
  }; // КОНЕЦ ФУНКЦИИ GETHINT

  // ДАЛЬШЕ ИДУТ ДРУГИЕ ФУНКЦИИ (БЕЗ ДУБЛИКАТОВ!)
  const copyHint = () => {
    navigator.clipboard.writeText(hint);
    alert('Скопировано!');
  };

  if (!subscription) {
    return <div className="p-8">Загрузка...</div>;
  }
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-zinc-900 mb-2">💡 AI Помощник</h1>
        <p className="text-zinc-600">Доступно только на тарифе Про. Вставьте сообщения из любого чата (AmoCRM, WhatsApp, Telegram и т.д.)</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-sm p-6 mb-6">
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Вставьте сообщения из чата (по одному на строку)
        </label>
        <textarea
          value={chatText}
          onChange={(e) => setChatText(e.target.value)}
          placeholder="Пример:&#10;Клиент: Здравствуйте, сколько стоит?&#10;Менеджер: Добрый день!&#10;Клиент: Есть ли доставка?&#10;&#10;Или просто вставьте текст - AI сам определит кто клиент"
          className="w-full h-64 p-4 border border-zinc-300 rounded-sm font-mono text-sm resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          data-testid="chat-input"
        />
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-zinc-500">
            {hintsInfo && (
              <span>
                Использовано: <b>{hintsInfo.used}</b> / {hintsInfo.limit === -1 ? '∞' : hintsInfo.limit}
              </span>
            )}
          </div>
          <button
            onClick={getHint}
            disabled={loading || !chatText.trim()}
            className="px-6 py-2 bg-orange-500 text-white rounded-sm font-bold hover:bg-orange-600 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors"
            data-testid="get-hint-btn"
          >
            {loading ? 'Генерация...' : '💡 Дай подсказку'}
          </button>
        </div>
      </div>

      {hint && (
        <div className="bg-green-50 border border-green-200 rounded-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-medium text-green-900">AI подсказка:</h3>
            <button
              onClick={copyHint}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded-sm hover:bg-green-700"
              data-testid="copy-hint-btn"
            >
              Копировать
            </button>
          </div>
          <p className="text-green-900 whitespace-pre-wrap">{hint}</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-sm">
        <h3 className="font-medium text-blue-900 mb-2">💡 Как пользоваться:</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Откройте любой чат (AmoCRM, WhatsApp, Telegram и т.д.)</li>
          <li>• Скопируйте последние сообщения из переписки</li>
          <li>• Вставьте в поле выше (по одному сообщению на строку)</li>
          <li>• Нажмите "Дай подсказку" и получите AI ответ</li>
          <li>• Скопируйте ответ и отправьте клиенту</li>
        </ul>
      </div>
    </div>
  );
};

// Main App
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout><OverviewPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/company" element={
            <ProtectedRoute>
              <DashboardLayout><CompanyPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/products" element={
            <ProtectedRoute>
              <DashboardLayout><ProductsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/objections" element={
            <ProtectedRoute>
              <DashboardLayout><ObjectionsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/managers" element={
            <ProtectedRoute>
              <DashboardLayout><ManagersPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/subscription" element={
            <ProtectedRoute>
              <DashboardLayout><SubscriptionPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/extension" element={
            <ProtectedRoute>
              <DashboardLayout><ExtensionPage /></DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
