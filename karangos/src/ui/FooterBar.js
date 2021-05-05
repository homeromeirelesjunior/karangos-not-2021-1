import { Typography } from '@material-ui/core'
import Toolbar from '@material-ui/core/Toolbar'
import LocalCafeTwoToneIcon from '@material-ui/icons/LocalCafeTwoTone';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    text: {
        width: '100%',
        color: theme.palette.text.secondary
    },
    toolbar: {
        backgroundColor: theme.palette.background.paper,
        minHeight: '42px',
        width: '100%',
        position: 'fixed',
        bottom: 0
    },
    link: {
        color: theme.palette.secondary.light,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
}));

export default function FooterBar() {
    const classes = useStyles();

    return (
        <Toolbar className={classes.toolbar}>
            <Typography variant="caption" align="center" className={classes.text}>
                Desenvolvido com <LocalCafeTwoToneIcon fontSize="small" /> por <a href="mailto:homeromeirelesjunior@gmail.com" className={classes.link}>Homero Meireles Junior</a>
            </Typography>
        </Toolbar>
    )
}