import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, {useState, useEffect, useContext} from 'react'
import Container from '@material-ui/core/Container';
import Notecard from '../Shared/Notecard'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Pagination from '@mui/material/Pagination';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from "react-router-dom"
import Loader from 'react-loader';
import {Context} from '../../context/store'
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
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
        top: '300px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '400',
        background: 'white',
        color: 'red',
        border: '2px solid #000',
        boxShadow: '30px',
        p: '4px',
    },
    preferences: {
      bottom: '8px', 
      color: '#E50914',
      backgroundColor:'yellow'
    },
    ul: {
      "& .MuiPaginationItem-root": {
        color: "#E50914"
      }
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
    object.sort(function(a, b) {
      if(a.title > b.title) { return 1; }
      if(a.title < b.title) { return -1; }
    })
    console.log(object)
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

  return (
    <Container >
      <div>
          {!state.loading && 
          <Button onClick={handleOpen}
          style={{ backgroundColor: 'transparent' }}
          sx={{
            color: '#E50914',
            marginTop: "10px",
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          > 
          📺 Preferences 
          </Button>}
          <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              backgroundColor: "white",
              width: "500px",
              marginTop: "200px",
              borderRadius: "4%",
              backgroundColor: 'rgba(255,255,255,0.75)',
              display: 'flex',
              flexDirection: 'column',
              marginLeft: 'auto',
              marginRight: 'auto',
              alignItems: 'center'
            }} 
            >
            <div>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign: 'center', color: '#E50914'}}>
              Select your preferences
            </Typography>
            <Typography>
              Sort the page result
            </Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                value={sorting}
                onChange={(e) => setSorting(e.target.value)}
                input={<OutlinedInput />}
              >
                  <MenuItem key="name" value="name">
                    Name
                  </MenuItem>
                  <MenuItem key="rating" value="rating">
                    Rating
                  </MenuItem>
                  <MenuItem key="year" value="year">
                    Year
                  </MenuItem>
              </Select>
            </FormControl>
            {!location.search && (
              <div> 
              <Typography>
                Filter per category
              </Typography>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
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
              </FormControl>
            </div>)}
            <div>
            <Typography>
              Production Year Range
            </Typography>
              <Slider
                getAriaLabel={() => 'Temperature range'}
                value={productionYear}
                sx={{
                  width:"400px",
                  marginLeft: '40px',
                  textAlign: 'center',
                  color: "#E50914",
                }}
                onChange={(event, newValue) => setProductionYear(newValue)}
                min={1950}
                max={2022}
                valueLabelDisplay="auto"
              />
            <Typography>
              Rating Range
            </Typography>
              <Slider
                getAriaLabel={() => 'Temperature range'}
                value={rating}
                sx={{
                  width:"400px",
                  marginLeft: '40px',
                  textAlign: 'center',
                  color: "#E50914",
                }}
                onChange={(event, newValue) => setRating(newValue)}
                step={0.5}
                min={0}
                max={10}
                valueLabelDisplay="auto"
              />
            </div>
            <Button variant="contained"
             sx={{marginLeft: 'auto', marginRight: 'auto'}} 
             onClick={() => handlePreferences()}
             sx={{
              marginLeft: '190px',
              marginBottom: '10px',
              backgroundColor: "#E50914",
              textAlign: 'center'
            }}
             >
               Save</Button>
            </div>
          </Box>
        </Modal>
            <Grid container spacing={4} >
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
            <Stack spacing={2} 
            sx={{
              marginTop: "20px",
              marginBottom: "20px",
              display: 'flex',
              flexDirection: 'column',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              <Pagination 
              count={pages} 
              variant="outlined" 
              className={classes.ul}
              shape="rounded" 
              page={activePage} 
              onChange={handlePagination}/>
            </Stack>
            )}
           </div>
           </div>
    </Container>
  );
}

export default Home;