import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from "react-router-dom";
import { googleProvider} from '../../config/authMethods';
import socialMediaAuth from '../../service/auth';
import axios from "axios"
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import OAuth2Login from 'react-simple-oauth2-login';
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
  // 42 auth
  const onSuccess = response => {
    console.log(response.code);
    axios.post(`http://localhost:5000/42auth`, {code : response.code})
  
  }

  const onFailure = response => console.error(response);
  // Hypertube auth 
  const [email, setEmail] = useState('');
  const [passwords, setPassword] = useState('')
  //const [state, dispatch] = useContext(Context);
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
        localStorage.setItem('provider', res.data.provider);
        console.log('user created');
     //   dispatch({type: 'SET_USER', payload: isAuth()});
        history.push("/home");
      }
    })
    .catch( error => {
      console.log(error.response)
      confirmAlert({
        title: 'Email or Password incorect',
        message: 'Please try again',
        buttons: [
          {
            label: 'Ok',
            onClick: () => {}
          }
        ]
      });
    }
    )
  }
  // google auth 
  const handleGoogleOnClick = async (provider) => {
    const res = await socialMediaAuth(provider);
    if (provider === googleProvider && res){
      console.log(res)
      const user = {
        email : res.user.email,
        username : res.user.displayName,
        image : res.user.photoURL,
        token : res.credential.idToken
      }
      localStorage.setItem('provider', "google");
      localStorage.setItem('token', res.credential.idToken)
      axios.post(`http://localhost:5000/googleauth`, { user })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
    }
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
          <button onClick={() => handleGoogleOnClick(googleProvider)}>
            sign in with google
          </button>
        </div>
      </Container>
      <OAuth2Login
        id="auth-code-login-btn"
        authorizationUrl="https://api.intra.42.fr/oauth/authorize"
        clientId="7f1fe4f23776049319f73d74b48c2f99bfe8713c182a70ab051f52f3c21b2cdc"
        redirectUri="http://localhost:3000/login"
        responseType="code"
        scope=""
        buttonText="Sign in with 42"
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
    </div>
  );
}

export default Login;