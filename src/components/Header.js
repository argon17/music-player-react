import React from 'react';
import { AppBar, Toolbar, Typography, makeStyles } from '@material-ui/core';
import MusicNoteSharpIcon from '@material-ui/icons/MusicNoteSharp';

const useStyles = makeStyles(theme=>({
    title:{
        marginLeft: theme.spacing(1)
    }
}));

function Header(){
    const classes=useStyles();
    return (
        <AppBar color="primary" position='fixed'>
            <Toolbar>
                <MusicNoteSharpIcon/>
                <Typography className={classes.title} variant="h6" component="h1">
                    Music Player
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default Header;