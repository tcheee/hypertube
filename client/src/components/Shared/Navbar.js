import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import {useState, useEffect, useContext} from 'react'
import {useHistory, Link} from 'react-router-dom' 
import axios from 'axios'
import {Context} from '../../context/store'
import isAuth from "../../service/decodeToken"

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    color: "#E50914",
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    align: "center",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 100,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

function Navbar() {
  const classes = useStyles();
  const history = useHistory();
  const [state, dispatch] = useContext(Context);
//  const [auth, setAuth] = useState(false);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

//  useEffect(() => {
//    dispatch({type: 'SET_USER', payload: isAuth()});
//  }, []);

//  useEffect(() => {
//    if (state.user.id) {
//      setAuth(true);
//    }
//    else {
//      setAuth(false);
 //   }
 // }, [state])

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleTyping = (event) => {
    event.preventDefault();
    setSearch(event.target.value)
  }

  const handleSearch = (event) => {
    event.preventDefault();
    event.target.value = '';
    dispatch({type: 'START_LOADING'});
    axios.post('http://localhost:5000/api/movie/search', {
      query: search,
    })
    .then(function (response) {
      console.log(response.data)
      console.log(state.loading)
      dispatch({type: 'STOP_LOADING'});
      history.push({
        pathname: '/home',
        search: '?q=' + search,
        state: { result: response.data }
      })
      setSearch('')
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  if (state.error) {
    console.log("There was an error while getting the state")
  }

  const handleClickAccount = () => {
    handleMenuClose()
    const id = localStorage.getItem("uuid")
    history.push(`/profile/` + id)
  }

  const handleClickUsers = () => {
    handleMenuClose()
    history.push(`/profiles`)
  }

  const handleClickLogout = () => {
    handleMenuClose()
 //   dispatch({type: 'DELETE_USER'});
    localStorage.clear();
    history.push(`/login`)
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
      <MenuItem onClick={handleClickAccount}>My Account</MenuItem>
      <MenuItem onClick={handleClickUsers}> Users </MenuItem>
      <MenuItem onClick={handleClickLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Link to="/home" style={{ textDecoration: 'none', color: '#FFF'  }}>
            <Typography className={classes.title} variant="h6" noWrap>
            🍿 Hypertube
            </Typography>
          </Link>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <form onSubmit={handleSearch}>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleTyping}
              value = {search}
            />
            </form>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

export default Navbar;