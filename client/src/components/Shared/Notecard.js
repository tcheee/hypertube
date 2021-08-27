import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    }
  }));

function Notecard({movie}) {
    const classes = useStyles();
    return ( 
        <div>
            <Card elevation={1}>
                <CardMedia
                    className={classes.media}
                    image="https://via.placeholder.com/400"
                    title={movie.column_2 || movie.title}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {movie.column_2 || movie.title}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default Notecard;