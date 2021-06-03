import React, { useContext, useEffect, useState } from 'react';
import { 
    Card, 
    CardActions, 
    CardContent, 
    CardMedia, 
    Typography, 
    IconButton, 
    makeStyles } from '@material-ui/core';
import { Pause, PlayArrow, AddCircleOutline } from '@material-ui/icons';
import { useMutation, useSubscription } from '@apollo/client';
import { GET_SONGS } from '../graphql/subscriptions'
import {PLAY_SONG, PAUSE_SONG, SET_SONG, SongContext} from '../reducer';
import { ADD_OR_REMOVE_FROM_QUEUE } from '../graphql/mutations';

function SongList(){

    const {data, loading, error} = useSubscription(GET_SONGS)

    if(loading){
        return (
            <div style={{
                alignItems:'center',
                display:'flex',
                flexDirection:'column',
            }}>
                Loading songs...
            </div>
        );
    }
    if(error){return (<div>error occured in fetching songs</div>);}
    return (
        <div className="noob" style={{
                display:'flex',
                flexDirection:'column',
            }}>
            {data.songs.map(song=>(
                <Song key={song.id} song={song}/>
            ))}
        </div>
    );
}

const useStyles = makeStyles(theme=>({
    container:{
        margin: theme.spacing(1),
        background: "linear-gradient(to right, rgba(72, 85, 99, 0.5), rgba(41, 50, 60, 0.5))"
    },
    songInfoContainer:{
        alignItems:'center',
        display:'flex',
        justifyContent:'center'
    },
    songInfo:{
        display:'flex',
        justifyContent:'space-between',
        width:'100%',
    },
    thumbnail:{
        height:140,
        objectFit:'cover',
        width:140,
    }
}));

function Song({song}){

    const {id} = song;
    const classes = useStyles();
    const {state, dispatch} = useContext(SongContext);
    const {artist,thumbnail,title} = song;
    const [currentSongPlaying, setCurrentSongPlaying] = useState(false);

    const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE,{
        onCompleted: data =>{
            localStorage.setItem('queue',JSON.stringify(data.addOrRemoveFromQueue))
        }
    });

    useEffect(()=>{
        const isSongPlaying = state.isPlaying && id===state.song.id;
        setCurrentSongPlaying(isSongPlaying);
    },[id,state.song.id, state.isPlaying])

    function handleAddOrRemoveFromQueue(){
        addOrRemoveFromQueue({
            variables: {
                input: {...song, __typename: 'Song'}
            }
        });
    }

    function handleTogglePlay(){

        dispatch({type: SET_SONG, payload: {song}})

        if(currentSongPlaying){
            dispatch({type: state.isPlaying ? PAUSE_SONG : PLAY_SONG});
        }else{
            dispatch({type: PLAY_SONG})
        }

    }

    return (
        <Card className={classes.container}>
            <div className={classes.songInfoContainer}>
                <CardMedia className={classes.thumbnail} image={thumbnail}/>
                <div className={classes.songInfo}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {title}
                        </Typography>
                        <Typography gutterBottom variant="body1" component="p" color="textSecondary">
                            {artist}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <IconButton onClick={handleTogglePlay} size="medium" color="secondary">
                            {currentSongPlaying ? <Pause/> :<PlayArrow/>}
                        </IconButton>
                        <IconButton onClick={handleAddOrRemoveFromQueue} size="medium" color="secondary">
                            <AddCircleOutline/>
                        </IconButton>
                    </CardActions>
                </div>
            </div>
        </Card>
    );
}

export default SongList;