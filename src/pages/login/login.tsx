import { FC, SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { loginUser } from '@slices';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setError(null);
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        const { from } = location.state || { from: { pathname: '/' } };
        navigate(from, { replace: true });
      })
      .catch((err) => setError(err));
  };

  return (
    <LoginUI
      errorText={error?.message}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
