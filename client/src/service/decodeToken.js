const isAuth = () => {
    if(localStorage.getItem('uuid') !== undefined){
      return true
    }
    else
      return false
  }

export default isAuth;