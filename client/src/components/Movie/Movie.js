import * as React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#E50914',
  },
  summary: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#b3b3b3',
  },
  comment: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
  },
  inputComment: {
    color: 'white',
    marginBottom: theme.spacing(3),
  },
  input: {
    backgroundColor: '#595757',
    width: '1000px',
    borderRadius: '20px',
    marginBottom: '15px',
    padding: '15px',
    border: 0,
    color: 'red',
    '&:focus': {
      outline: 'none',
    },
  },
  output: {
    backgroundColor: '#595757',
    width: '1000px',
    borderRadius: '20px',
    marginBottom: '10px',
    padding: '2px',
    border: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: 'white',
  },
  video: {
    position: 'relative',
    width: '1000px',
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '30px',
  },
  textContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '1000px',
  },
  videoDiv: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function updateMovie(hash, movieId, resolution, img) {
  axios
    .post(`/api/addMovie`, {
      hash,
      movieId: movieId,
      resolution: resolution,
      image_link: img,
    })
    .then((res) => {});
}

function postComment(movieId, comment, userId) {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/addComment`, {
        movieId,
        comment,
        userId,
      })
      .then((res) => {
        resolve(res.data.comments);
      });
  });
}

function Movie() {
  const classes = useStyles();
  const [comments, setComments] = useState(null);
  const [title, setTitle] = useState(null);
  const [summary, setSummary] = useState(null);
  const [comment, setComment] = useState(null);
  const [magnet, setMagnet] = useState(null);
  const [resolution, setResolution] = useState('720p');
  const [hash, setHash] = useState(null);
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (location.state && magnet == null) {
    setTitle(location.state.name);
    setSummary(location.state.summary);
    const torrents = location.state.torrents;
    torrents.map((torrent) => {
      if (torrent.quality === resolution) {
        setHash(torrent.hash);
      }
      return torrent;
    });
    setMagnet(location.state);
  }

  useEffect(() => {
    axios
      .get(`/api/getCommentsMovie`, {
        params: {
          movieId: location.state.id,
        },
      })
      .then((res) => {
        setComments(res.data.comments);
      });

    axios.post(`/api/setMovieSeen`, {
      movieId: location.state.id,
      uuid: localStorage.getItem('uuid'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateMovie(hash, location.state.id, resolution, location.state.img);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  const handleClickResolution = (resolution) => {
    setResolution(resolution);
    const torrents = location.state.torrents;
    torrents.map((torrent) => {
      if (torrent.quality === resolution) {
        setHash(torrent.hash);
      }
      return torrent;
    });
  };

  const handleEnter = async (e) => {
    if (e.key === 'Enter') {
      const id = localStorage.getItem('uuid');
      e.preventDefault();
      e.target.value = null;
      const newComments = await postComment(location.state.id, comment, id);
      setComments(newComments);
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <div>
        <div>
          <div className={classes.textContainer}>
            <h2 className={classes.title}> {title} </h2>
            <h5 className={classes.summary}> {summary} </h5>
          </div>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="tabs"
                centered
              >
                <Tab
                  label="720p"
                  {...a11yProps(0)}
                  onClick={(e) => handleClickResolution('720p')}
                />
                <Tab
                  label="1080p"
                  {...a11yProps(1)}
                  onClick={(e) => handleClickResolution('1080p')}
                />
              </Tabs>
            </Box>
            {resolution === '720p' ? (
              <div className={classes.video}>
                <TabPanel value={value} index={0}>
                  <video
                    controls
                    crossOrigin="anonymous"
                    className={classes.videoDiv}
                  >
                    <source
                      label="720p"
                      src={`http://localhost:5000/stream/${hash}`}
                    />
                    <track
                      label="English"
                      kind="subtitles"
                      srcLang="en"
                      src={`/api/subtitles/${location.state.id}-en`}
                    />
                    <track
                      label="French"
                      kind="subtitles"
                      srcLang="fr"
                      src={`/api/subtitles/${location.state.id}-fr`}
                    />
                    <track
                      label="Spanish"
                      kind="subtitles"
                      srcLang="es"
                      src={`/api/subtitles/${location.state.id}-es`}
                    />
                  </video>
                </TabPanel>
              </div>
            ) : (
              <div className={classes.video}>
                <TabPanel value={value} index={1}>
                  <video
                    controls
                    crossOrigin="anonymous"
                    className={classes.videoDiv}
                  >
                    <source label="1080p" src={`/api/stream/${hash}`} />
                    <track
                      label="English"
                      kind="subtitles"
                      srcLang="en"
                      src={`/api/subtitles/${location.state.id}-en`}
                    />
                    <track
                      label="French"
                      kind="subtitles"
                      srcLang="fr"
                      src={`/api/subtitles/${location.state.id}-fr`}
                    />
                    <track
                      label="Spanish"
                      kind="subtitles"
                      srcLang="es"
                      src={`/api/subtitles/${location.state.id}-es`}
                    />
                  </video>
                </TabPanel>
              </div>
            )}
          </Box>
        </div>
        <div>
          <div className={classes.comment}>
            <input
              placeholder="Give your opiniong about the movie"
              className={classes.input}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={(e) => handleEnter(e)}
            />
          </div>
          {comments &&
            comments.map((comment) => (
              <div className={classes.output} key={comment.id}>
                <p style={{ marginLeft: '15px', fontSize: '15px' }}>
                  <b>{comment.from.username} </b>: {comment.comment}
                </p>
              </div>
            ))}
        </div>
      </div>
    </Grid>
  );
}

export default Movie;
