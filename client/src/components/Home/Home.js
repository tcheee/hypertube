import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import {useState, useEffect, useContext} from 'react'
import Container from '@material-ui/core/Container';
import Notecard from '../Shared/Notecard'
import Pagination from '@material-ui/lab/Pagination';
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

  return (
    <Container>
        <p> Hello 📺</p>
            <Grid container spacing={4}>
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
            {!state.loading && (movies.length === 0 ? null :
            <Pagination count={pages} color="secondary" page={activePage} onChange={handlePagination} align='center'/>
            )}
        </div>
    </Container>
  );
}

export default Home;