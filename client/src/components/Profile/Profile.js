import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import useStyles from '../../styles/styles.js';
import { useLocation } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { makeStyles } from '@material-ui/core';

function Profile() {
  // set State
  const classes = useStyles();
  const [editable, setEditable] = useState(false);
  const [user, setUser] = useState(undefined);
  const [isLoading, setLoading] = useState(true);
  const [language, setLanguage] = useState('');
  const [image, setImage] = useState('');

  // get uuid value from Url
  const location = useLocation();
  const id = location.pathname.replace('/profile/', '');

  // Check if form must be editable
  useEffect(() => {
    axios
      .get('http://localhost:5000/userId', { params: { id: id } })
      .then((res) => {
        console.log(res.data.user);
        setUser(res.data.user);
        setImage('data:image/png;base64,' + res.data.user.image);
        setLoading(false);
      });

    if (id === localStorage.getItem('uuid')) {
      setEditable(true);
    }
  }, [user, id]);

  const onDrop = useCallback(async (acceptedFiles) => {
    console.log(acceptedFiles);
    axios
      .post('http://localhost:5000/updateimage', {
        image: acceptedFiles,
        uuid: id,
      })
      .then((res) => console.log(res.data.user));
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // is State Loading else render nothing
  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} webkitdirectory="" type="file" />
            {user.image === 'data:image/png;base64,' && (
              <Avatar
                style={{ width: 100, height: 100, cursor: 'pointer' }}
                alt="Remy Sharp"
                src="https://via.placeholder.com/100"
              />
            )}
            {user.image !== null && (
              <Avatar
                style={{ width: 100, height: 100, cursor: 'pointer' }}
                alt="Remy Sharp"
                src={image}
              />
            )}
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
                  defaultValue={user.firstname}
                />
              </Grid>
              {editable && (
                <Button
                  type="submit"
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  disabled={!editable}
                  defaultValue={user.lastname}
                />
              )}
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
                  defaultValue={user.username}
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
                    defaultValue={user.email}
                  />
                </Grid>
              )}
              <FormControl sx={{ m: 1, minWidth: 350 }}>
                <InputLabel id="demo-simple-select-autowidth-label">
                  Choose Subtitle Language
                </InputLabel>
                <Select
                  className={classes.MenuItem}
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={language}
                  onChange={handleChange}
                  autoWidth
                  label="Age"
                >
                  <MenuItem value={20}>English</MenuItem>
                  <MenuItem value={21}>French</MenuItem>
                  <MenuItem value={22}>Spanish</MenuItem>
                </Select>
              </FormControl>
              {editable && (
                <Grid item xs={12}>
                  <TextField
                    className={classes.field}
                    variant="filled"
                    required
                    fullWidth
                    name="password"
                    label="Change Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
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
