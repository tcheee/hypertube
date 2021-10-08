import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@mui/material/Rating';

const useStyles = makeStyles((theme) => ({
    hover: {
        alignItems: "center",
        position:'relative',
        '&:hover': {
            "& $opacity": {
                objectFit: 'cover',
                opacity: 0.2,
                backgroundColor: "black",
              },
            "& $overlay": {
                display: "block",
              },
            // "& $media": {
            //     objectFit: 'cover',
            //     opacity: 0.4,
            //   }
            },
    },
    opacity: {
    },
    media: {
      height: 250,
      paddingTop: '56.25%', // 16:9
    },
    overlay: {
        position: 'absolute',
        margin:'auto',
        color: "white",
        display:'none',
    },
  }));

function Notecard({movie}) {
    const classes = useStyles();
    return ( 
        <div className={classes.hover}>
            <div className={classes.overlay}>
                {movie.summary}
            </div>
        <div className={classes.opacity}>
            <Card elevation={1}>
                <CardMedia
                    className={classes.media}
                    image={movie.image? movie.image : "https://productimages.artboxone.com/826383195-PO-big.jpg"}
                    title={movie.column_2 || movie.title}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {movie.column_2 || movie.title + " - " + movie.year }
                    </Typography>
                    <Rating name="read-only" value={movie.rating} precision={0.5} max={10} readOnly />
                </CardContent>
            </Card>
        </div>
        </div>
    )
}

export default Notecard;