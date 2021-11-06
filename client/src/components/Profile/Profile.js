import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { Context } from '../../context/store';
import axios from 'axios';
import useStyles from '../../styles/styles.js';
import { useHistory, useLocation } from 'react-router-dom';

function Profile() {
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);
  //let { id } = useParams()
  const [editable, setEditable] = useState(false);
  const [user, setUser] = useState();
  // get uuid value from Url
  const location = useLocation();
  const id = location.pathname.replace('/profile/', '');
  console.log(id);
  // Check if form must be editable
  useEffect(() => {
    axios
      .get('http://localhost:5000/userId', { params: { id: id } })
      .then((res) => {
        console.log(res);
        console.log(res.data.user.username);
        setUser(res.data.user.username);
      });

    if (id === localStorage.getItem('uuid')) {
      setEditable(true);
    }
  }, [user, id]);

  const onDrop = useCallback(async (acceptedFiles) => {
    console.log(acceptedFiles);
    axios.post(`http://localhost:5000/user/image`, {
      image: acceptedFiles,
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <Avatar
              style={{ width: 100, height: 100, cursor: 'pointer' }}
              alt="Remy Sharp"
              src="https://via.placeholder.com/100"
            />
          </div>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  className={classes.field}
                  autoComplete="fname"
                  name="user"
                  variant="filled"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  disabled={!editable}
                  defaultValue={user}
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
                  disabled={!editable}
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
                  disabled={!editable}
                />
              </Grid>
              {editable && (
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
                  />
                </Grid>
              )}
              {editable && (
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
                    disabled={!editable}
                  />
                </Grid>
              )}
            </Grid>
            {editable && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submit}
              >
                Save Changes
              </Button>
            )}
          </form>
        </div>
      </Container>
    </div>
  );
}

export default Profile;
