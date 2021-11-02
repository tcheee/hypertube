const isAuth = () => {
    if(localStorage.getItem('uuid')){
      return true
    }
    else
      return false
  }

export default isAuth;