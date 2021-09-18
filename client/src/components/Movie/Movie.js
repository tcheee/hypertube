import * as React from 'react';
import PropTypes from 'prop-types';
import {useParams} from "react-router-dom"
import {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ReactPlayer from 'react-player'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@mui/material/Box';
import { Link, useLocation } from "react-router-dom"
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
    title: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    comment:{
        marginBottom: theme.spacing(2)
    }
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

function Movie() {
    const classes = useStyles();
    let { id } = useParams()
    const [comments, setComments] = useState(null)
    const [title, setTitle] = useState(null)
    const [magnet, setMagnet] = useState(null)
    const [playing, setPlaying] = useState(false)
    const [launchDownload, setLaunchDownload] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [resolution, setResolution] = useState('720p')
    const [hash, setHash] = useState(null)
    const location = useLocation();
    const tracks = [];
    const variable = 'test'
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    if (location.state && magnet == null) {
        setTitle(location.state.name)
        console.log(location.state)
        console.log(location.state.torrents)
        const torrents = location.state.torrents
        torrents.map(torrent => {
            if (torrent.quality === resolution) {
                setHash(torrent.hash);
            }
        })
        setMagnet(location.state)
    }

    useEffect(() => {
        fetch('https://retoolapi.dev/Y3m1i2/data')
          .then(res => {
              return res.json()
          })
          .then((data) => {
              setComments(data)
              console.log(data)
          })
    }, [])

    const handleClick = () => {
        setResolution('1080p');
        const torrents = location.state.torrents
        torrents.map(torrent => {
            if (torrent.quality === resolution) {
                setHash(torrent.hash);
            }
        })
    }

    return (
            <Grid container 
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <div> 
                    <div>
                    <h2 className={classes.title}> {title} </h2>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="tabs" centered>
                            <Tab label="720p" {...a11yProps(0)} />
                            <Tab label="1080p" {...a11yProps(1)} />
                        </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                        <video width='100%' controls  crossOrigin="anonymous">
                            <source label="720p" src={`http://localhost:5000/api/stream/${hash}`} />
                            <track label='English' kind='subtitles' srcLang='en' src={`http://localhost:5000/api/subtitles/${location.state.id}-en`} />
                            <track label='French' kind='subtitles' srcLang='fr' src={`http://localhost:5000/api/subtitles/${location.state.id}-fr`} />
                            <track label='Spanish' kind='subtitles' srcLang='es' src={`http://localhost:5000/api/subtitles/${location.state.id}-es`} />
                        </video>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                        <video width='100%' controls  crossOrigin="anonymous">
                            <source label="720p" src={`http://localhost:5000/api/stream/${hash}`} />
                            <track label='English' kind='subtitles' srcLang='en' src={`http://localhost:5000/api/subtitles/${location.state.id}-en`} />
                            <track label='French' kind='subtitles' srcLang='fr' src={`http://localhost:5000/api/subtitles/${location.state.id}-fr`} />
                            <track label='Spanish' kind='subtitles' srcLang='es' src={`http://localhost:5000/api/subtitles/${location.state.id}-es`} />
                        </video>
                        </TabPanel>
                    </Box>
                    </div>
                <form>
                    <TextField
                    id="standard-full-width"
                    label=""
                    style={{ marginTop: 20, marginBottom: 20 }}
                    placeholder="Give your opinion about this movie"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    />
                </form>
                {comments && 
                comments.map((comment) => (
                    <Paper elevation={2} className={classes.comment} key={comment.id}> 
                        <Grid 
                            container
                            spacing={1}
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                        >
                            <Grid item>
                                <Avatar alt="Remy Sharp" src="https://via.placeholder.com/25" />
                            </Grid>
                            <Grid item>
                                <h5> {comment.Username}</h5>
                            </Grid>
                        </Grid>
                        <Typography variant="body1">
                            {comment.Comment}
                        </Typography>
                    </Paper>
                ))}
                </div>
            </Grid>
    );
}

export default Movie;