import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { useState, useContext,} from 'react';
import { useHistory,} from 'react-router-dom';
import { Context } from '../../context/store';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    color: '#E50914',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    align: 'center',
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
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function Footer() {
  const classes = useStyles();
  const history = useHistory();
  const [state, dispatch] = useContext(Context);
  const [search, setSearch] = useState('');

  return (
    <div>
      {state.loading ? (
        <div> </div>
      ) : (
        <div className={classes.grow}>
          <AppBar position="static">
            <Toolbar>
              <div className={classes.grow} />
              <div>
                <p>
                  {' '}
                  <i> Made for educational purpose only at {'   '}</i>
                  {'      '}
                  <a href="https://42.fr/">
                    <img
                      style={{
                        marginLeft: '4px',
                        width: '20px',
                        height: '20px',
                      }}
                      src="https://seeklogo.com/images/1/42_Chip_Ganassi_Racing-logo-918204A8C8-seeklogo.com.png"
                    />
                  </a>
                </p>
              </div>
            </Toolbar>
          </AppBar>
        </div>
      )}
    </div>
  );
}

export default Footer;
