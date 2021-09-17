import React, { useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from "react-router-dom";
import { googleProvider, githubProvider } from '../../config/authMethods';
import socialMediaAuth from '../../service/auth';
import {Context} from '../../context/store'
import isAuth from "../../service/decodeToken"
import axios from "axios"

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: 'white',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


function Login() {
  // Hypertube auth 
  const [email, setEmail] = useState('');
  const [passwords, setPassword] = useState('')
  const [state, dispatch] = useContext(Context);
  const history = useHistory();

  const onInputChangeEmail = (event) => {
    setEmail(event.target.value);
   }
   const onInputChangePassword = (event) => {
    setPassword(event.target.value);
   }
   // Submit Form
  const onSubmit = (event) => {
    event.preventDefault();
    const user = {
      email : email,
      password : passwords,
    }
    axios.post(`http://localhost:5000/login`, { user })
    .then(res => {
      console.log(res.data);
      if (res.data.result) {
        localStorage.setItem('accessToken', res.data.accesstoken);
        console.log('user created');
        dispatch({type: 'SET_USER', payload: isAuth()});
        history.push("/home");
      }
    })
    .catch( error => {
      console.log(error.response)
    }

    )
  }

  // github and google auth 
  const handleOnClick = async (provider) => {
    const res = await socialMediaAuth(provider);
    if (provider === githubProvider && res){
      const user = {
        email : res.email
      }
      axios.post(`http://localhost:5000/githubauth`, { user })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
    }
    if (provider === googleProvider && res){
      console.log(res)
      const user = {
        email : res.user.email,
        username : res.user.displayName,
        image : res.user.photoURL,
        token : res.credential.idToken
      }
      axios.post(`http://localhost:5000/googleauth`, { user })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
    }
    console.log(res.credential)
    console.log(res)
  }
  const classes = useStyles();
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={onSubmit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              onChange={onInputChangeEmail}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={onInputChangePassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
           
            <Grid container>
              <Grid item xs>
                <Link to="/reset-password" variant="body2" style={{ textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register" variant="body2" style={{ textDecoration: 'none' }}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
          <button onClick={() => handleOnClick(githubProvider)}
            >
              Sign in with github
            </button>
          <button onClick={() => handleOnClick(googleProvider)}>
            sign in with google
          </button>
        </div>
      </Container>
    </div>
  );
}

export default Login;