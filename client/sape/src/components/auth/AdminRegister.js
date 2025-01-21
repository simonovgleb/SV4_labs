import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerAdmin } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserShield, FaLock, FaUserPlus } from 'react-icons/fa';

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
    <div>
      <div>
        <div>
          <div>
            <h3>
              <FaUserShield />
              Регистрация администратора
            </h3>
          </div>
          <div>
            <form onSubmit={onSubmit}>
              <div>
                <label>Логин</label>
                <div>
                  <span>
                    <FaUserPlus />
                  </span>
                  <input
                    type="text"
                    name="login"
                    value={login}
                    onChange={onChange}
                    required
                    placeholder="Введите логин"
                  />
                </div>
              </div>
              <div>
                <label>Пароль</label>
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
                    placeholder="Введите пароль"
                  />
                </div>
              </div>
              <div>
                <button type="submit" disabled={loading}>
                  {loading ? 'Регистрируем...' : 'Зарегистрироваться'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;