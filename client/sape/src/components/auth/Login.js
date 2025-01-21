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
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    login: '',
    password: '',
    role: 'user',
  });

  const [showResetBlock, setShowResetBlock] = useState(false);
  const [resetStep, setResetStep] = useState('request');
  const [resetData, setResetData] = useState({
    login: '',
    token: '',
    newPassword: '',
    role: 'user',
  });

  const { login, password, role } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onRoleChange = (e) => {
    setFormData((prev) => ({ ...prev, role: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (role === 'admin') {
        await dispatch(loginAdmin({ login, password })).unwrap();
        toast.success('Авторизация прошла успешно как администратор!');
        navigate('/');
      } else {
        await dispatch(loginUser({ login, password })).unwrap();
        toast.success('Авторизация прошла успешно как пользователь!');
        navigate('/');
      }
    } catch (err) {
      toast.error(err?.message || 'Ошибка при авторизации');
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const goToResetStep = () => setResetStep('reset');
  const goToRequestStep = () => setResetStep('request');

  const onResetChange = (e) => {
    setResetData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onResetRoleChange = (e) => {
    setResetData((prev) => ({ ...prev, role: e.target.value }));
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    const { login, role } = resetData;

    if (!login) {
      toast.error('Введите логин');
      return;
    }
    try {
      if (role === 'admin') {
        const res = await dispatch(requestAdminPasswordReset({ login })).unwrap();
        toast.success(res.message || 'Токен для сброса пароля отправлен');
      } else {
        const res = await dispatch(requestUserPasswordReset({ login })).unwrap();
        toast.success(res.message || 'Токен для сброса пароля отправлен');
      }
      goToResetStep();
    } catch (err) {
      toast.error(err?.message || 'Ошибка при запросе сброса пароля');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const { token, newPassword, role } = resetData;

    if (!token || !newPassword) {
      toast.error('Введите токен и новый пароль');
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
      setShowResetBlock(false);
      setResetData({ login: '', token: '', newPassword: '', role: 'user' });
      setResetStep('request');
    } catch (err) {
      toast.error(err?.message || 'Ошибка при сбросе пароля');
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">
        <FaSignInAlt className="me-2" />
        Авторизация
      </h3>

      {!showResetBlock ? (
        <form onSubmit={onSubmit} className="card p-4 shadow">
          <div className="mb-3">
            <label className="form-label">Роль:</label>
            <select
              name="role"
              value={role}
              onChange={onRoleChange}
              className="form-select"
            >
              <option value="admin">Администратор</option>
              <option value="user">Пользователь</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Логин:</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaUser />
              </span>
              <input
                type="text"
                name="login"
                value={login}
                onChange={onChange}
                required
                placeholder="Введите логин"
                className="form-control"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Пароль:</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaLock />
              </span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                placeholder="Введите пароль"
                className="form-control"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Входим...' : 'Войти'}
          </button>

          <button
            type="button"
            className="btn btn-link mt-3"
            onClick={() => setShowResetBlock(true)}
          >
            Забыли пароль?
          </button>
        </form>
      ) : (
        <div className="card p-4 shadow">
          <h4 className="mb-4">Восстановление пароля</h4>

          <button
            className="btn btn-link mb-3"
            onClick={() => {
              setShowResetBlock(false);
              setResetStep('request');
            }}
          >
            Назад к логину
          </button>

          {resetStep === 'request' ? (
            <form onSubmit={handleRequestReset}>
              <div className="mb-3">
                <label className="form-label">Роль:</label>
                <select
                  name="role"
                  value={resetData.role}
                  onChange={onResetRoleChange}
                  className="form-select"
                >
                  <option value="admin">Администратор</option>
                  <option value="user">Пользователь</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Логин:</label>
                <input
                  type="text"
                  name="login"
                  value={resetData.login}
                  onChange={onResetChange}
                  placeholder="Введите логин"
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Запросить токен
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="mb-3">
                <label className="form-label">Токен:</label>
                <input
                  type="text"
                  name="token"
                  value={resetData.token}
                  onChange={onResetChange}
                  placeholder="Введите токен"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Новый пароль:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={resetData.newPassword}
                  onChange={onResetChange}
                  placeholder="Введите новый пароль"
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-success w-100">
                Сбросить пароль
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Login;
