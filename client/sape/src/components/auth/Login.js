import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginAdmin,
  loginUser,
  requestAdminPasswordReset,
  requestUserPasswordReset,
  resetAdminPassword,
  resetUserPassword,
} from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSignInAlt, FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Основная форма для логина
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    role: 'user',
  });

  // Управляем состоянием процесса восстановления пароля
  const [showResetBlock, setShowResetBlock] = useState(false); // Показывать блок для "Забыли пароль?"
  const [resetStep, setResetStep] = useState('request'); // 'request' или 'reset'
  const [resetData, setResetData] = useState({
    login: '',
    token: '',
    newPassword: '',
    role: 'user',
  });

  const { login, password, role } = formData;

  // Универсальная функция для изменения state
  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onRoleChange = (e) => {
    setFormData((prev) => ({ ...prev, role: e.target.value }));
  };

  // Отправка формы логина
  const onSubmit = async (e) => {
    e.preventDefault();

    // В зависимости от роли отправляем нужный экшен
    if (role === 'admin') {
      try {
        await dispatch(loginAdmin({ login, password })).unwrap();
        toast.success('Авторизация прошла успешно как администратор!');
        navigate('/');
      } catch (err) {
        toast.error(err?.message || 'Не удалось авторизоваться как администратор');
      }
    } else if (role === 'user') {
      try {
        await dispatch(loginUser({ login, password })).unwrap();
        toast.success('Авторизация прошла успешно как пользователь!');
        navigate('/');
      } catch (err) {
        toast.error(err?.message || 'Не удалось авторизоваться как пользователь');
      }
    }
  };

  // Обработка ошибок глобально
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // --- Логика для восстановления пароля ---

  // Смена шага (request -> reset, и наоборот)
  const goToResetStep = () => setResetStep('reset');
  const goToRequestStep = () => setResetStep('request');

  // Хендлеры для ввода данных
  const onResetChange = (e) => {
    setResetData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onResetRoleChange = (e) => {
    setResetData((prev) => ({ ...prev, role: e.target.value }));
  };

  // Запрос токена (request password reset)
  const handleRequestReset = async (e) => {
    e.preventDefault();
    const { login, role } = resetData;

    if (!login) {
      toast.error('Укажите логин');
      return;
    }
    try {
      if (role === 'admin') {
        const res = await dispatch(requestAdminPasswordReset({ login })).unwrap();
        toast.success(res.message || 'Токен для сброса пароля выдан');
      } else {
        const res = await dispatch(requestUserPasswordReset({ login })).unwrap();
        toast.success(res.message || 'Токен для сброса пароля выдан');
      }
      // После успешного запроса можно перейти на шаг "reset"
      goToResetStep();
    } catch (err) {
      toast.error(err?.message || 'Ошибка при запросе сброса пароля');
    }
  };

  // Сброс пароля по токену
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const { token, newPassword, role } = resetData;

    if (!token || !newPassword) {
      toast.error('Нужно указать токен и новый пароль');
      return;
    }

    try {
      if (role === 'admin') {
        const res = await dispatch(resetAdminPassword({ token, newPassword })).unwrap();
        toast.success(res.message || 'Пароль успешно сброшен (admin)');
      } else {
        const res = await dispatch(resetUserPassword({ token, newPassword })).unwrap();
        toast.success(res.message || 'Пароль успешно сброшен (user)');
      }
      // После сброса пароля можно спрятать блок восстановления
      setShowResetBlock(false);
      // Очистим форму
      setResetData({
        login: '',
        token: '',
        newPassword: '',
        role: 'user',
      });
      setResetStep('request');
    } catch (err) {
      toast.error(err?.message || 'Ошибка при сбросе пароля');
    }
  };

  return (
    <div>
      <h3>
        <FaSignInAlt />
        Авторизация
      </h3>

      {/* Блок авторизации (виден только если НЕ показываем блок для восстановления пароля) */}
      {!showResetBlock && (
        <form onSubmit={onSubmit}>
          {/* Роль */}
          <div>
            <label>Роль:</label>
            <select name="role" value={role} onChange={onRoleChange}>
              <option value="admin">Администратор</option>
              <option value="user">Пользователь</option>
            </select>
          </div>

          {/* Логин */}
          <div>
            <label>Логин:</label>
            <div>
              <span>
                <FaUser />
              </span>
              <input
                type="text"
                name="login"
                value={login}
                onChange={onChange}
                required
                placeholder="Введите ваш логин"
              />
            </div>
          </div>

          {/* Пароль */}
          <div>
            <label>Пароль:</label>
            <div>
              <span>
                <FaLock />
              </span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                placeholder="Введите ваш пароль"
              />
            </div>
          </div>

          {/* Кнопка submit */}
          <div>
            <button type="submit" disabled={loading}>
              {loading ? 'Входим...' : 'Войти'}
            </button>
          </div>

          {/* Ссылка на восстановление пароля */}
          <div style={{ marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setShowResetBlock(true)}
            >
              Забыли пароль?
            </button>
          </div>
        </form>
      )}

      {/* Блок восстановления пароля (виден, если showResetBlock = true) */}
      {showResetBlock && (
        <div style={{ border: '1px solid #ccc', marginTop: '2rem', padding: '1rem' }}>
          <h4>Восстановление пароля</h4>

          {/* Кнопка "назад" к логину */}
          <button onClick={() => {
            setShowResetBlock(false);
            setResetStep('request');
          }}>
            Назад к логину
          </button>

          {/* Два шага: Request и Reset */}
          {resetStep === 'request' && (
            <form onSubmit={handleRequestReset}>
              {/* Роль */}
              <div>
                <label>Роль:</label>
                <select name="role" value={resetData.role} onChange={onResetRoleChange}>
                  <option value="admin">Администратор</option>
                  <option value="user">Пользователь</option>
                </select>
              </div>

              {/* Логин (для запроса токена) */}
              <div>
                <label>Логин для восстановления:</label>
                <input
                  type="text"
                  name="login"
                  value={resetData.login}
                  onChange={onResetChange}
                  placeholder="Введите логин, на который зарегистрированы"
                />
              </div>

              <button type="submit" disabled={loading}>
                Запросить токен
              </button>
            </form>
          )}

          {resetStep === 'reset' && (
            <form onSubmit={handleResetPassword}>
              {/* Роль */}
              <div>
                <label>Роль:</label>
                <select name="role" value={resetData.role} onChange={onResetRoleChange}>
                  <option value="admin">Администратор</option>
                  <option value="user">Пользователь</option>
                </select>
              </div>

              {/* Токен */}
              <div>
                <label>Токен:</label>
                <input
                  type="text"
                  name="token"
                  value={resetData.token}
                  onChange={onResetChange}
                  placeholder="Введите полученный токен"
                />
              </div>

              {/* Новый пароль */}
              <div>
                <label>Новый пароль:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={resetData.newPassword}
                  onChange={onResetChange}
                  placeholder="Введите новый пароль"
                />
              </div>

              <button type="submit" disabled={loading}>
                Сбросить пароль
              </button>
            </form>
          )}

          {/* Кнопки для перехода между шагами (опционально) */}
          {resetStep === 'request' ? (
            <button onClick={goToResetStep}>Уже есть токен</button>
          ) : (
            <button onClick={goToRequestStep}>Нужен токен</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Login;
