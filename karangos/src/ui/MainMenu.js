import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    menuLink: {
        color: theme.palette.text.primary,
        textDecoration: 'none'
    }
}));

export default function MainMenu() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton 
                aria-controls="simple-menu" 
                aria-haspopup="true" 
                onClick={handleClick} 
                edge="start" 
                className={classes.menuButton} 
                color="inherit" 
                aria-label="menu"
            >
                <MenuIcon />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose} >
                    <Link className={classes.menuLink} to="/list">Listagem de Karangos</Link>
                </MenuItem>
                <MenuItem onClick={handleClose} >
                    <Link className={classes.menuLink} to="/new">Cadastrar novo Karango</Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link className={classes.menuLink} to="/clientesList">Listagem de Clientes</Link>
                </MenuItem>
                <MenuItem>
                    <Link className={classes.menuLink} to="/clientesNew">Cadastrar novo Cliente</Link>
                </MenuItem>
            </Menu>
        </div>
    );
}