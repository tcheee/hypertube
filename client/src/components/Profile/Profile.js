import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useParams} from "react-router-dom"
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import {Context} from '../../context/store'
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
  large:{
    width: theme.spacing(20),
    height: theme.spacing(20),
    cursor: 'pointer',
  }
}));

function Profile() {
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);
  let { id } = useParams()
  const [editable, setEditable] = useState(false)

  useEffect(() => {
    if (parseInt(id,10) === parseInt(state.user.id)) {
      setEditable(true);
    }
  }, [state])

  const onDrop = useCallback(async (acceptedFiles) => {
    console.log(acceptedFiles);
    axios.post(`http://localhost:5000/user/image`, { 
      image: acceptedFiles 
    })
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <Avatar alt="Remy Sharp" src="https://via.placeholder.com/100" className={classes.large}/>
          </div>
          <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                disabled={!editable}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                disabled={!editable}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Username"
                name="username"
                autoComplete="username"
                disabled={!editable}
              />
            </Grid>
            {editable && <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>}
            {editable && <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                disabled={!editable}
              />
            </Grid>}
          </Grid>
            {editable && <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>}
          </form>
        </div>
      </Container>
    </div>
  );
}

export default Profile;