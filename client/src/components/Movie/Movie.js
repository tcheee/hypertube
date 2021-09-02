import {useParams} from "react-router-dom"
import {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ReactPlayer from 'react-player'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
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

function Movie() {
    const classes = useStyles();
    let { id } = useParams()
    const [comments, setComments] = useState(null)
    const [magnet, setMagnet] = useState(null)
    const [playing, setPlaying] = useState(false)
    const [launchDownload, setLaunchDownload] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const location = useLocation();
    const tracks = [];
    const variable = 'test'

    if (location.state && magnet == null) {
        console.log(location.state)
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

    function handleSubmit(event) {
        event.preventDefault()
        console.log(magnet)
        tracks.push({
            kind: 'subtitles',
            src: `http://localhost:5000/api/subtitles/${location.state.id}`,
            srcLang: 'en'
        })

        axios.post('http://localhost:5000/api/stream', {
            magnet: magnet,
        })
        .then(function (response) {
            console.log(response)
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    function handleClick() {
        if (!launchDownload) {
            setLaunchDownload(true);
            setDownloading(true);
            axios.post(`http://localhost:5000/api/download/${location.state.torrents[0].hash}`)
        }
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
                    <h2 className={classes.title}> Movie Title for {id} </h2>
                    <video width='100%' controls  crossOrigin="anonymous">
                        <source src={`http://localhost:5000/api/stream/${location.state.torrents[0].hash}`} />
                        <track label='English' kind='subtitles' srcLang='en' src={`http://localhost:5000/api/subtitles/${location.state.id}-en`} />
                        <track label='French' kind='subtitles' srcLang='fr' src={`http://localhost:5000/api/subtitles/${location.state.id}-fr`} />
                        <track label='Spanish' kind='subtitles' srcLang='es' src={`http://localhost:5000/api/subtitles/${location.state.id}-es`} />
                    </video>
                    {downloading && 
                        <p> Currently downloading the movie ...</p>
                    }
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