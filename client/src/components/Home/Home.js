import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import {useState, useEffect} from 'react'
import Container from '@material-ui/core/Container';
import Notecard from '../Shared/Notecard'
import Pagination from '@material-ui/lab/Pagination';
import { Link, useLocation } from "react-router-dom"

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
  const [movies, setMovies] = useState([]) 
  const [pages, setPages] = useState(1) 
  const [query, setQuery] = useState(null)
  const [activePage, setActivePage] = useState(1) 
  const location = useLocation();
  if (location.state && query != location.search) {
    setQuery(location.search)
  }

  if (location.search != query && location.state) {
      let data = location.state.result
      console.log(data)
      setMovies(data)
      setPages(data.length === 0 ? 0 : Math.floor(data.length / 21) + 1)
  }

  useEffect(() => {
      fetch('http://localhost:5000/api/home')
        .then(res => {
            return res.json()
        })
        .then((data) => {
            console.log(data)
            setMovies(data)
            setPages(data.length === 0 ? 0 : Math.floor(data.length / 21) + 1)
        })
  }, [])

  const handlePagination = (event, value) => {
    setActivePage(value);
  };

  return (
    <Container>
         <p> Hello 📺</p>
            <Grid container spacing={4}>
                {movies && 
                movies.map((movie) => (
                        <Grid item key={movie.id} xs={12} md={6} lg={4}>
                            <Link to={{pathname: `/movie/${movie.id}`, state:{torrents: movie.torrents, id: movie.imdb_code}}} style={{ textDecoration: 'none' }}>
                                <Notecard movie={movie} />
                            </Link>
                        </Grid>
                ))}
            </Grid>
            <div className={classes.root}>
            <Pagination count={pages} color="secondary" page={activePage} onChange={handlePagination} align='center'/>
        </div>
    </Container>
  );
}

export default Home;