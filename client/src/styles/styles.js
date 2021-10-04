import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: 'transparent',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#E50914",
        color: "white"
    },
    div: {
        backgroundColor: 'rgba(0,0,0,0.25)',
        borderRadius: "4%"
    },
    field: {
        backgroundColor: "rgba(255,255,255,0.9)",
    },
    textColor: {
        color: "#E50914",
    },
    large:{
        width: theme.spacing(200),
        height: theme.spacing(20),
        cursor: 'pointer',
    },
}));

// const useStyles = makeStyles((theme) => ({
//     paper: {
//       marginTop: theme.spacing(8),
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//     },
//     avatar: {
//       margin: theme.spacing(1),
//       backgroundColor: 'white',
//     },
//     form: {
//       width: '100%', // Fix IE 11 issue.
//       marginTop: theme.spacing(1),
//     },
//     submit: {
//       margin: theme.spacing(3, 0, 2),
//     },
//     large:{
//       width: theme.spacing(20),
//       height: theme.spacing(20),
//       cursor: 'pointer',
//     }
//   }));

export default useStyles;
