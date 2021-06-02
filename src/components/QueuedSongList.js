import React from 'react';
import { 
    Typography, 
    Avatar, 
    IconButton, 
    makeStyles, 
    useMediaQuery } from '@material-ui/core';
import { Delete } from '@material-ui/icons';

import { useMutation } from '@apollo/client';
import { ADD_OR_REMOVE_FROM_QUEUE } from '../graphql/mutations';

function QueuedSongList({queue}){
    const greaterThanMd =useMediaQuery(theme=>theme.breakpoints.up('md'));

    return greaterThanMd && (
        <div style={{margin: '10px 0'}}>
            <Typography color="textSecondary" variant="button">
                QUEUE({queue.length})
            </Typography>
            {queue.map((song,i)=>(
                <QueuedSong key={i} song={song}/>
            ))}
        </div>
    );
}

const useStyles=makeStyles({
    avatar:{
        height:44,
        width:44,
    },
    container:{
        alignItems:'center',
        display:'grid',
        gridAutoFlow:'column',
        gridGap:12,
        gridTemplateColumns:'50px auto 50px',
        marginTop:10,
    },
    songInfoContainer:{
        overflow:"hidden",
        whiteSpace:'nowrap'
    },
    text:{
        overflow:"hidden",
        textOverflow:'ellipsis',
    }
});

function QueuedSong({song}){
    const classes = useStyles();
    const {artist,thumbnail,title} = song;
    const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE,{
        onCompleted: data =>{
            localStorage.setItem('queue',JSON.stringify(data.addOrRemoveFromQueue))
        }
    });

    function handleAddOrRemoveFromQueue(){
        addOrRemoveFromQueue({
            variables: {
                input: {...song, __typename: 'Song'}
            }
        });
    }

    return (
        <div className={classes.container}>
            <Avatar className={classes.avatar} src={thumbnail} alt="Song thumbnail"/>
            <div className={classes.songInfoContainer}>
                <Typography variant="subtitle2" className={classes.text}>
                    {title}
                </Typography>
                <Typography color="textSecondary" variant="body2" className={classes.text}>
                    {artist}
                </Typography>
            </div>
            <IconButton onClick={handleAddOrRemoveFromQueue}>
                <Delete color="error"/>
            </IconButton>
        </div>
    );
}

export default QueuedSongList;