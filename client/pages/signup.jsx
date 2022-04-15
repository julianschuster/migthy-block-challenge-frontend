import { useRouter } from 'next/router';
import { useState } from 'react';

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

function Signup() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [areSamePasswords, setAreSamePasswords] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const { push } = useRouter();
  const onSubmit = async (e) => {
    e.preventDefault();
    const {
      confirmPwd: { value: confirmPwd },
      pwd: { value: password },
      username: { value: username },
    } = e.target.elements;
    if (username.length < 3) {
      setIsAvailable(false);
      return false;
    }
    if (!isAvailable || !areSamePasswords || !isValidPassword) {
      return true;
    }
    if (confirmPwd !== password) {
      setAreSamePasswords(false);
    }
    const { success } = await fetch('/api/users', { method: 'POST', body: JSON.stringify({ username, password, picture: '' }) }).then(((res) => res.json()));
    if (success) {
      return push('/');
    }
    return console.error('hubo un error');
  };

  const verifyPasswordStrength = ({ target: { value } }) => {
    if (value.length < 8) return setIsValidPassword(true);
    return setIsValidPassword(passwordRegex.test(value));
  };

  const changeConfirmationPwd = () => {
    setAreSamePasswords(true);
  };

  const getIsAvailableUsername = async ({ target: { value } }) => {
    if (value.length < 3) return true;

    const { data: isAvailableUsername } = await fetch(`/api/users/isAvailable?username=${value}`).then((res) => res.json());
    return setIsAvailable(isAvailableUsername);
  };

  return (
    <div>
      <div className="container-with-header login-container display-flex flex-direction-column login">
        <form onSubmit={onSubmit} className="flex-direction-column flex-align align-items-baseline">
          <h2 className="flex-align justify-content-space-around width-100 font-size-x-large">Create Account</h2>
          <div className={`login flex-align align-items-flex-end ${!isAvailable ? 'invalid' : ''}`}>
            <i className="ri-user-line" />
            <input
              type="text"
              onChange={getIsAvailableUsername}
              id="username"
              placeholder="username"
              className="margin-top-10 font-size-large width-100 input"
            />
            <div className="invalidMessage">
              {
                (!isAvailable) && (
                <>
                  <i className="ri-error-warning-fill" />
                  {' '}
                  Username is not available, pick another one
                </>
                )
              }
            </div>
          </div>
          <div className="width-100">
            <div
              className={`login flex-align align-items-flex-end ${!isValidPassword || !areSamePasswords ? 'invalid' : ''}`}
            >
              <i className="ri-key-line" />
              <input
                type="password"
                onChange={verifyPasswordStrength}
                id="pwd"
                placeholder="password"
                className="margin-top-10 font-size-large width-100 input"
              />
            </div>
            <div className="invalidMessage">
              {
                (!isValidPassword || !areSamePasswords) && <i className="ri-error-warning-fill" />
              }
              {
                !isValidPassword && (
                  <>
                    Password must have at least 8 characters, having one capital letter,
                    one lowercase, one number and one special character
                  </>
                )
              }
              {
                !areSamePasswords && (
                  <>
                    Password and confirmation are not equal
                  </>
                )
              }
            </div>

          </div>
          <div className={`login flex-align align-items-flex-end ${!areSamePasswords ? 'invalid' : ''}`}>
            <i className="ri-lock-line" />
            <input
              type="password"
              onChange={changeConfirmationPwd}
              id="confirmPwd"
              placeholder="confirm password"
              className="margin-top-10 font-size-large width-100 input"
            />
          </div>
          <div className="flex-align justify-content-end width-100 margin-top-10">
            <button type="submit" className="signin">Sign up</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
