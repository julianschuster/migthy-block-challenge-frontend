import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

const Profile = ({ username, setSearchQuery }) => {
  const router = useRouter();
  const logout = async () => {
    const { success } = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).then((res) => res.json());
    if (success) router.push('/login');
  };

  return (
    <div className="user-info index-item width-100">
      <div className="flex-align margin-bottom-5 justify-content-space-between">
        <div className="flex-align">
          <div className="avatar">
            <i className="ri-user-line" />
          </div>
          <div>{username}</div>
        </div>
        <button type="button" className="logout" onClick={logout}>
          <i className="ri-logout-box-r-line margin-right-5" />
          Logout
        </button>
      </div>

      <div className="search">
        <i className="ri-search-line" />
        <input type="text" onChange={({ target: { value } }) => setSearchQuery(value)} className="searchbar input" placeholder="Search" />
      </div>
    </div>
  );
};

export { Profile };

Profile.propTypes = {
  setSearchQuery: PropTypes.func,
  username: PropTypes.string,
};
