import React, { useState } from 'react';
import axios from "axios"
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import useStyles from '../../styles/styles.js'


function Register() {
  const classes = useStyles();

  // Setup state in order to store form value
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [passwords, setPassword] = useState('');
  const history = useHistory();

// take input change value and store in State
  const onInputChangeFirstName = (event) => {
    setFirstName(event.target.value);
   }
   const onInputChangeLastName = (event) => {
    setLastName(event.target.value);
   }
   const onInputChangeUserName = (event) => {
    setUserName(event.target.value);
   }
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
      firstName : firstName,
      lastName : lastName,
      userName : userName,
      email : email,
      password : passwords,
    }
    axios.post(`http://localhost:5000/hypertubeauth`, { user })
    .then(res => {
      console.log(res);
      if (res.data.result) {
        console.log('user created');
        history.push("/login");
      }
      // ADD ALERT MESSAGE 
    })

  }
  return (
    <div >
  `    <Container component="main" maxWidth="xs" className={classes.div}>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            🥳
          </Avatar>
          <Typography component="h1" variant="h5" style={{color: "#E50914"}}>
            Sign up to Hypertube 
          </Typography>
          <form className={classes.form} onSubmit={onSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.field}
                autoComplete="fname"
                name="firstName"
                variant="filled"
                required
                fullWidth
                id="firstName"
                label="First Name"
                type="firstName"
                onChange={onInputChangeFirstName}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.field}
                variant="filled"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname" 
                type="lastName"
                onChange={onInputChangeLastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.field}
                variant="filled"
                required
                fullWidth
                id="email"
                label="Username"
                name="username"
                autoComplete="username"
                type="userName"
                onChange={onInputChangeUserName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.field}
                variant="filled"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
                onChange={onInputChangeEmail}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.field}
                variant="filled"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={onInputChangePassword}
              />
            </Grid>
          </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Container>`
    </div>
  );
}

export default Register;