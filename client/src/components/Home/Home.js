import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, {useState, useEffect, useContext} from 'react'
import Container from '@material-ui/core/Container';
import Notecard from '../Shared/Notecard'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Pagination from '@material-ui/lab/Pagination';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from "react-router-dom"
import Loader from 'react-loader';
import {Context} from '../../context/store'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > * + *': {
          marginTop: theme.spacing(2),
        },
        display: 'flex',
        alignItems:'center'
      },
    modal: {
        position: 'absolute',
        top: '50px',
        left: '50px',
        transform: 'translate(-50%, -50%)',
        width: '400',
        bgcolor: 'background.paper',
        color: 'white',
        border: '2px solid #000',
        boxShadow: '24px',
        p: '4px',
    },
    preferences: {
      marginBottom: '8px', 
      color: '#E50914'
    }
  }));


function Home() {
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);
  const [movies, setMovies] = useState([])
  const [pages, setPages] = useState(1) 
  const [query, setQuery] = useState(null)
  const [error, setError] = useState(false)
  const [activePage, setActivePage] = useState(1) 
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!location.search) { 
      setError(false);
      dispatch({type: 'START_LOADING'});
      fetch('http://localhost:5000/api/movie/trending')
        .then(res => {
            return res.json()
        })
        .then((data) => {
              dispatch({type: 'STOP_LOADING'});
              setMovies(data)
              setPages(data.length === 0 ? 0 : Math.floor(data.length / 21) + 1)
        })
      } else {
        let data = location.state.result
        console.log(data)
        console.log(state)
        console.log(data.error)
        if (data.error) {
          setMovies([])
          setError(true);
        } else {
          setError(false)
          setMovies(data)
          setPages(data.length === 0 ? 0 : Math.floor(data.length / 21) + 1)
        }
      }
  }, [location])

  const handlePagination = (event, value) => {
    setActivePage(value);
  };

  const handleScroll = (e) => {
    console.log('here')
    console.log(e.target)
    console.log(e.target.scrollTop)
  }

  return (
    <div onScroll={(e) => handleScroll(e)}>
    <Container >
          <Button onClick={handleOpen} className={classes.preferences}> 📺 Preferences </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
          </Modal>
            <Grid container spacing={4} onScroll={(e) => handleScroll(e)}>
                {state.loading &&
                  <Loader
                  lines={13} 
                  length={20} 
                  width={10} 
                  radius={30}
                  corners={1} 
                  rotate={0} 
                  direction={1} 
                  color="#E50914" 
                  speed={1}
                  trail={60} 
                  shadow={false} 
                  hwaccel={false} 
                  className="spinner"
                  zIndex={2e9} 
                  top="50%" 
                  left="50%" 
                  scale={1.00}
                  loadedClassName="loadedContent" />
                }
                {error &&
                  <p> Nothing was found. Please try to type the exact name in the English version.</p>
                }
                {!state.loading && (movies.length === 0 ? null :
                movies.map((movie) => (
                        <Grid item key={movie.id} xs={12} md={6} lg={4}>
                            <Link to={{pathname: `/movie/${movie.id}`, state:{torrents: movie.torrents, id: movie.imdb_code, name: movie.title, summary: movie.summary}}} style={{ textDecoration: 'none' }}>
                                <Notecard movie={movie} />
                            </Link>
                        </Grid>
                )))}
            </Grid>
            <div className={classes.root}>
            {/* {!state.loading && (movies.length === 0 ? null :
            <Pagination count={pages} color="secondary" page={activePage} onChange={handlePagination} align='center'/>
            )} */}
           </div>
    </Container>
    </div>
  );
}

export default Home;