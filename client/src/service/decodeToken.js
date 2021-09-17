import decode from 'jwt-decode';

const isAuth = () => {
    let user = null;
    const token = localStorage.getItem('accessToken');
    try {
        user = decode(token);
    } catch (err) {
      return (false);
    }
    return (user);
  };

export default isAuth;