import React from 'react';
import { AppBar, Toolbar, Typography, makeStyles, useMediaQuery } from '@material-ui/core';
import MusicNoteSharpIcon from '@material-ui/icons/MusicNoteSharp';
import identity from '../assets/identity.png'

const useStyles = makeStyles(theme=>({
    title:{
        marginLeft: theme.spacing(1)
    },
    avatar:{
        height:25,
        objectFit: 'contain'
    },
    info:{
        // marginRight:50
        display:'flex',
        position:'absolute',
        right:40
    }
}));

function Header(){
    const greaterThanMd = useMediaQuery(theme => theme.breakpoints.up('md'));

    const classes=useStyles();
    return (
        <AppBar color="primary" position='fixed'>
            <Toolbar>
                <MusicNoteSharpIcon/>
                <Typography className={classes.title} variant="h6" component="h1">
                    Music Player
                </Typography>
                <div className={classes.info} >
                    {greaterThanMd && 
                        <>
                        <Typography variant="body1" color="inherit">
                            Developed and designed by argon &nbsp;
                        </Typography>
                        <a href="https://github.com/argon17" >
                            <img src={identity} className={classes.avatar} alt="argon" />
                        </a>
                        </>
                    }
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Header;