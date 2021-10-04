import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, {useState, useEffect, useContext} from 'react'
import Container from '@material-ui/core/Container';
import Notecard from '../Shared/Notecard'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Pagination from '@material-ui/lab/Pagination';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from "react-router-dom"
import Loader from 'react-loader';
import {Context} from '../../context/store'
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';


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
        top: '300px',
        left: '500px',
        width: '400',
        background: 'white',
        color: 'red',
        border: '2px solid #000',
        boxShadow: '30px',
        p: '4px',
    },
    preferences: {
      bottom: '8px', 
      color: '#E50914'
    }
  }));

const categories = [
  'All',
  'Comedy',
  'Horror',
  'Romance',
  'Action',
  'Adventure',
  'Thriller',
  'Animation',
  'Sci-fi',
  'Fantasy'
]

const sortMovie = (type, object) => {
  if (type === "name") {
    object.sort()
  }
  if (type === "rating") {
    object.sort(function(a, b) {
      return (b.rating - a.rating)
    })
  }
  if (type === "year") {
    object.sort(function(a, b) {
      return (b.year - a.year)
    })
  }
  return (object)
}

function Home() {
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);
  const [movies, setMovies] = useState([])
  const [originalSearch, setOriginalSearch] = useState([])
  const [pages, setPages] = useState(1) 
  const [query, setQuery] = useState(null)
  const [error, setError] = useState(false)
  const [activePage, setActivePage] = useState(1) 
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [productionYear, setProductionYear] = useState([1950, 2022])
  const [rating, setRating] = useState([0, 10])
  const [sorting, setSorting] = useState('')
  const [category, setCategory] = useState('')

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchMovies = (category, page) => {
    setError(false);
    dispatch({type: 'START_LOADING'});
    fetch('http://localhost:5000/api/movie/trending?category=' + category.toLowerCase() + "&page=" + page)
      .then(res => {
          return res.json()
      })
      .then((data) => {
            dispatch({type: 'STOP_LOADING'});
            console.log(data)
            setPages(data.count);
            const result = data.movies.filter(movie => movie.rating >= rating[0] && movie.rating <= rating[1] && movie.year >= productionYear[0] && movie.year <= productionYear[1]);
            setMovies(result)
      })
  };

  useEffect(() => {
    if (!location.search) { 
        fetchMovies('')
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
          setOriginalSearch(data)
          setMovies(data)
          setPages(data.length === 0 ? 0 : Math.floor(data.length / 21) + 1)
        }
      }
  }, [location])

  const handlePreferences = async () => {
    setOpen(false);
    if (!location.search) { 
      category === 'All' ? fetchMovies('') : fetchMovies(category)    
    } else {
      const result = originalSearch.filter(movie => movie.rating >= rating[0] && movie.rating <= rating[1] && movie.year >= productionYear[0] && movie.year <= productionYear[1]);
      setMovies(sortMovie(sorting, result))
    }
  }

  const handlePagination = (event, value) => {
    setActivePage(value);
    category === 'All' ? fetchMovies('', value) : fetchMovies(category, value)   
  };

  const handleScroll = (e) => {
    console.log('here')
    console.log(e.target)
    console.log(e.target.scrollTop)
  }

  return (
    <div onScroll={(e) => handleScroll(e)}>
    <Container >
          {!state.loading && <Button onClick={handleOpen} className={classes.preferences}> 📺 Preferences </Button>}
          <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className={classes.modal}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                value={sorting}
                onChange={(e) => setSorting(e.target.value)}
                input={<OutlinedInput />}
              >
                  <MenuItem key="name" value="Name">
                    Name
                  </MenuItem>
                  <MenuItem key="rating" value="rating">
                    Rating
                  </MenuItem>
                  <MenuItem key="year" value="year">
                    Year
                  </MenuItem>
              </Select>
              <FormHelperText>Select a way to sort the result of your search</FormHelperText>
            </FormControl>
            {!location.search && <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                input={<OutlinedInput />}
                placeholder="Category"
              >
                <MenuItem disabled value="">
                  <em>Category</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select a category to filter movies</FormHelperText>
            </FormControl>}
            <Slider
              getAriaLabel={() => 'Temperature range'}
              value={productionYear}
              onChange={(event, newValue) => setProductionYear(newValue)}
              min={1950}
              max={2022}
              valueLabelDisplay="auto"
            />
            <Slider
              getAriaLabel={() => 'Temperature range'}
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              step={0.5}
              min={0}
              max={10}
              valueLabelDisplay="auto"
            />
            <Button variant="contained" onClick={() => handlePreferences()}>Save</Button>
          </Box>
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
                  loadedClassName="loadedContent" 
                  />
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
            {!state.loading && !location.search && (movies.length === 0 ? null :
            <Stack spacing={2}>
              <Pagination count={pages} color="secondary" variant="outlined" shape="rounded" page={activePage} onChange={handlePagination}/>
            </Stack>
            )}
           </div>
    </Container>
    </div>
  );
}

export default Home;