import React, { useEffect, useContext, useRef, useState } from 'react'
import QueuedSongList from './QueuedSongList';
import { Card, CardContent, Typography, IconButton, Slider, CardMedia, makeStyles } from '@material-ui/core';
import { SkipPrevious, SkipNext, PlayArrow, Pause } from '@material-ui/icons';
import { PAUSE_SONG, PLAY_SONG, SET_SONG, SongContext} from '../reducer';
import { useQuery } from '@apollo/client';
import { GET_QUEUED_SONGS } from '../graphql/queries';
import ReactPlayer from 'react-player';

const useStyles = makeStyles(theme=>({
    container:{
        display:'flex',
        justifyContent:'space-between',
        background: "linear-gradient(to right, rgba(72, 85, 99, 0.5), rgba(41, 50, 60, 0.5))"
    },
    content:{
        flex:'1 0 auto'
    },
    controls:{
        alignItems:'center',
        display:'flex',
        paddingLeft:theme.spacing(1),
        paddingRight:theme.spacing(1),
    },
    timestamps:{
        display:'flex',
        justifyContent:'space-between'
    },
    details:{
        display:'flex',
        flexDirection:'column',
        padding:'0px 15px'
    },
    playIcon:{
        height:38,
        width:38
    },
    thumbnail:{
        width:150
    },
}));
function SongPlayer(){
    const {state, dispatch} = useContext(SongContext);
    const {data} = useQuery(GET_QUEUED_SONGS);
    const classes = useStyles();
    const [played, setPlayed] = useState(0);
    const [seeking,setSeeking] = useState(false);
    const reactPlayerRef = useRef()
    const [playedSeconds, setPlayedSeconds] = useState(0);
    const [positionInQueue, setPositionInQueue] = useState(0);

    useEffect(()=>{
        const songIndex = data.queue.findIndex(song=>song.id===state.song.id);
        setPositionInQueue(songIndex);
    },[state.song.id,data.queue]);

    useEffect(()=>{
        const nextSong = data.queue[positionInQueue+1]
        if(played === 1 && nextSong){
            setPlayed(0);
            dispatch({type: SET_SONG, payload:{ song:nextSong}})
        }
    },[data.queue,played,dispatch,positionInQueue]);

    function handlePlayNextSong(){
        const nextSong = data.queue[positionInQueue+1]
        if(played && nextSong){
            dispatch({type: SET_SONG, payload:{ song:nextSong}})
        }
    }

    function handlePlayPrevSong(){
        const prevSong = data.queue[positionInQueue-1];
        if(prevSong){
            dispatch({type: SET_SONG, payload:{ song:prevSong}});
        }
    }

    function handleProgressChange(event,newValue){
        setPlayed(newValue);
    }

    function handleSeekMouseDown(){
        setSeeking(true);
    }

    function handleSeekMouseUp(){
        setSeeking(false);
        reactPlayerRef.current.seekTo(played);
    }

    function handleTogglePlay(){
        dispatch({type: state.isPlaying ? PAUSE_SONG : PLAY_SONG});
    }

    function formatDuration(seconds){
        return new Date(seconds*1000).toISOString().substr(11,8)
    }

    return (
        <>
            <Card className={classes.container} variant="outlined">
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography variant="h5" component="h3">
                            {state.song.title}
                        </Typography>
                        <Typography variant="subtitle1" component="p" color="textSecondary">
                            {state.song.artist}
                        </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                        <IconButton onClick={handlePlayPrevSong}>
                            <SkipPrevious/>
                        </IconButton>
                        <IconButton onClick={handleTogglePlay}>
                            {state.isPlaying ? <Pause className={classes.playIcon}/> : <PlayArrow className={classes.playIcon}/>}
                        </IconButton>
                        <IconButton onClick={handlePlayNextSong}>
                            <SkipNext/>
                        </IconButton>
                    </div>
                    <div className={classes.timestamps}>
                        <Typography variant="subtitle1" component="p" color="textSecondary">
                            {formatDuration(playedSeconds)}
                        </Typography>
                        <Typography variant="subtitle1" component="p" color="textSecondary">
                            {formatDuration(state.song.duration)}
                        </Typography>
                    </div>
                    <Slider
                        max={1}
                        min={0}
                        onChange={handleProgressChange}
                        onMouseDown={handleSeekMouseDown}
                        onMouseUp={handleSeekMouseUp}
                        step={0.01}
                        type="range"
                        value={played}
                        color="secondary"
                    />
                </div>
                <ReactPlayer 
                    hidden url={state.song.url} 
                    onProgress={({played, playedSeconds})=>{
                        if(!seeking){
                            setPlayed(played);
                            setPlayedSeconds(playedSeconds);
                        }
                    }}
                    playing={state.isPlaying}
                    ref={reactPlayerRef}
                    />
                <CardMedia
                    className={classes.thumbnail}
                    image={state.song.thumbnail}
                />
            </Card>
            <QueuedSongList queue={data.queue}/>
        </>
    );
}

export default SongPlayer;