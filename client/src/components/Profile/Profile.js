import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { useState, useEffect, useCallback} from 'react';
import { useDropzone } from 'react-dropzone';
import axios from "axios"
import useStyles from '../../styles/styles.js'
import { useLocation } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


function Profile() {
  // set State
  const classes = useStyles();
  const [editable, setEditable] = useState(false);
  const [user, setUser] = useState(undefined);
  const [isLoading, setLoading] = useState(true);
  const [language, setLanguage] = useState('');
  const [image, setImage] = useState('')
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  // get uuid value from Url
  const location = useLocation()
  const id = location.pathname.replace("/profile/", "")


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

  // Check if form must be editable
  useEffect(() => {
    axios.get("http://localhost:5000/userId", {params: {id : id} }).then(res => {
		setUser(res.data.user);
    setImage("data:image/png;base64," + res.data.user.image )
    setLanguage(res.data.user.language)
    setFirstName(res.data.user.firstname)
    setLastName(res.data.user.lastname)
    setUserName(res.data.user.email)
    setLoading(false);
	});

    if (id === localStorage.getItem('uuid')) {
      setEditable(true);
    }
  }, [id]);

  const onDrop = useCallback(async (acceptedFiles) => {
    // convert to base64
    const base64 = await convertBase64(acceptedFiles[0]);
    setImage(base64)
    const image = base64.replace("data:image/png;base64,", "")
    axios.post("http://localhost:5000/updateimage", { 
      image: image,
      uuid: id,
    })
  }, [id]);


  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  
  // is State Loading else render nothing
  if (isLoading) {
		return <div className="App">Loading...</div>;
	}

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };


   // Submit Form
   const onSubmit = (event) => {
    event.preventDefault();
    const user = {
      firstname : firstName,
      lastname : lastName,
      username : userName,
      language: language,
      uuid: id,
    }
    axios.patch("http://localhost:5000/updateUser", {
      user : user,
    })
  }

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <div {...getRootProps({ className: 'dropzone' })}>
              {editable && <input {...getInputProps()} type="file"/>}
              {image === "data:image/png;base64," &&
              <Avatar style={{ width: 100, height: 100, cursor: 'pointer' }} alt="Remy Sharp" src="https://via.placeholder.com/100"/>}
              {image !== "data:image/png;base64," && 
              <Avatar style={{ width: 100, height: 100, cursor: 'pointer' }} alt="Remy Sharp"  src={image}/> }
          </div>
          <form className={classes.form} onSubmit={onSubmit} noValidate>
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
                onChange={onInputChangeFirstName}
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
                defaultValue={user.lastname}
                onChange={onInputChangeLastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className={classes.field}
                variant="filled"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                disabled={!editable}
                defaultValue={user.username}
                onChange={onInputChangeUserName}
              />
            </Grid>
            {editable && <Grid item xs={12}>
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
                disabled={true}
              />
            </Grid>}
            {editable && <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Choose Language</InputLabel>
            <Select
            className={classes.MenuItem}
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={language}
            onChange={handleChange}
            autoWidth
            >
            <MenuItem value={"English"}>English</MenuItem>
            <MenuItem value={"French"}>French</MenuItem>
            <MenuItem value={"Spanish"}>Spanish</MenuItem>
            </Select>
            </FormControl>}
          </Grid>
            {editable && <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit }
            >
              Save Changes
            </Button>}
          </form>
        </div>
      </Container>
    </div>
  );
}

export default Profile;