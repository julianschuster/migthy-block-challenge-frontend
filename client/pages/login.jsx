import { useRouter } from 'next/router';
import { useState } from 'react';

function Login() {
  const { push } = useRouter();

  const [invalidRequest, setInvalidRequest] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const {
      pwd: { value: password },
      username: { value: username },
    } = e.target.elements;
    const { success } = await fetch('/api/auth/me', { method: 'POST', body: JSON.stringify({ username, password }) }).then((res) => res.json());
    if (success) push('/');
    else setInvalidRequest(true);
  };

  const cleanError = () => {
    setInvalidRequest(false);
  };

  return (
    <div className="container-with-header login-container display-flex flex-direction-column login">
      <form onSubmit={onSubmit} className="flex-direction-column flex-align align-items-baseline login">
        <h2 className="flex-align justify-content-space-around width-100 font-size-x-large margin-bottom-5">Login</h2>
        <div className={`login flex-align align-items-flex-end ${invalidRequest ? 'invalid' : ''}`}>
          <i className="ri-user-line" />
          <input type="text" id="username" onChange={cleanError} placeholder="username" className="margin-top-10 font-size-large width-100 input" />
        </div>
        <div className={`login flex-align align-items-flex-end ${invalidRequest ? 'invalid' : ''}`}>
          <i className="ri-key-line" />
          <input type="password" id="pwd" onChange={cleanError} placeholder="password" className="margin-top-10 font-size-large width-100 input" />
        </div>
        {
          invalidRequest && (
            <div className="invalidMessage">
              <i className="ri-error-warning-fill" />
              Invalid username or password
            </div>
          )
        }
        <div className="flex-align justify-content-space-between width-100 margin-top-10">
          <label htmlFor="rememberMe" className="description padding-5 flex-align cursor-pointer">
            <input type="checkbox" id="rememberMe" className="margin-right-5 checkbox" />
            remember me
          </label>
          <button type="submit" className="signin">Sign in</button>
        </div>
      </form>
      <div className="social flex-align flex-direction-column">
        <button type="button" className="width-100 margin-top-10 font-size-large facebook">
          <i className="ri-facebook-fill" />
          Sign in with facebook
        </button>
        <button type="button" className="width-100 margin-top-10 font-size-large google">
          <i className="ri-google-fill" />
          Sign in with google
        </button>
        <button type="button" className="width-100 margin-top-10 font-size-large pixowlgram" onClick={() => push('/signup')}>
          <i className="ri-landscape-fill" />
          Sign up
        </button>
      </div>
    </div>
  );
}

export default Login;
