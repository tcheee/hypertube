import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Forget() {
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    const user = {
      email: email,
    };
    axios
      .post(`/forgetPassword`, { user })
      .then((res) => {
        if (res.data.result) {
          history.push('login');
        }
      })
      .catch((error) => {
        confirmAlert({
          title: 'Email Incorrect ',
          message: 'Please try again',
          buttons: [
            {
              label: 'Ok',
              onClick: () => {},
            },
          ],
        });
      });
  };

  return (
    <div className={classes.full}>
      `{' '}
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Receive an email to reset password
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
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Send me an email
            </Button>
          </form>
        </div>
      </Container>
      `
    </div>
  );
}

export default Forget;
