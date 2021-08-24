import {useParams} from "react-router-dom"
import {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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

    return (
            <Grid container 
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <div> 
                    <h2 className={classes.title}> Movie Title for {id} </h2>
                    <video controls width="800" align="center">
                        <source src="https://media.w3.org/2010/05/bunny/movie.mp4" type="video/mp4" />
                    </video>
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