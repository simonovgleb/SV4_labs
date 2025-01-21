import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerAdmin } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserShield, FaLock, FaUserPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css'; // Подключение Bootstrap стилей

const AdminRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });

  const { login, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerAdmin({ login, password })).unwrap();
      toast.success('Регистрация администратора прошла успешно! Пожалуйста, войдите в систему.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Не удалось зарегистрировать администратора');
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white text-center">
              <h3>
                <FaUserShield className="me-2" />
                Регистрация администратора
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                {/* Логин */}
                <div className="mb-3">
                  <label className="form-label">Логин</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaUserPlus />
                    </span>
                    <input
                      type="text"
                      name="login"
                      value={login}
                      onChange={onChange}
                      className="form-control"
                      required
                      placeholder="Введите логин"
                    />
                  </div>
                </div>

                {/* Пароль */}
                <div className="mb-3">
                  <label className="form-label">Пароль</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={onChange}
                      className="form-control"
                      required
                      placeholder="Введите пароль"
                    />
                  </div>
                </div>

                {/* Кнопка отправки */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Регистрируем...' : 'Зарегистрироваться'}
                  </button>
                </div>
              </form>

              {/* Ошибки */}
              {error && <p className="text-danger mt-3">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
