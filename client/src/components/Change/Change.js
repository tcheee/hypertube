import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useState} from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from "axios";

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

function Change() {
  const classes = useStyles();
  const [password, SetPassword] = useState('');
  const location = useLocation()
  const id = location.pathname.replace("/change-password/", "")
  const history = useHistory();

  const onInputChangePassword = (event) => {
    SetPassword(event.target.value);
   }

  const onSubmit = (event) => {
    console.log(password)
    console.log(id)
    axios.post(`http://localhost:5000/resetpassword`, { 
      password: password,
      id: id,
    })
    history.push('login')
  }

  return (
    <div>
  `    <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Change Password
          </Typography>
          <form className={classes.form} onSubmit={onSubmit}noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="New Password"
              name="password"
              type="password"
              autoComplete="password"
              autoFocus
              onChange={onInputChangePassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Change Password
            </Button>
          </form>
        </div>
      </Container>`
    </div>
  );
}

export default Change;