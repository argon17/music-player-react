import React from 'react';
import { Dialog, DialogActions, TextField, InputAdornment, Button, DialogTitle, DialogContent, makeStyles } from '@material-ui/core';
import { Link, AddBoxOutlined } from '@material-ui/icons'
import ReactPlayer from 'react-player';
// import SoundcloudPlayer from 'react-player/lib/players/SoundCloud';
import YoutubePlayer from 'react-player/lib/players/YouTube';
import {ADD_SONG} from '../graphql/mutations';
import { useMutation } from '@apollo/react-hooks';

const useStyles = makeStyles(theme => ({
    container:{
        display: 'flex',
        alignItems:'center'
    },
    urlInput:{
        margin: theme.spacing(1)
    },
    addSongButton:{
        margin: theme.spacing(1)
    },
    dialog:{
        textAlign:'center'
    },
    thumbnail:{
        width:'90%'
    }
}));

const DEFAULT_SONG = {
    artist:"",
    duration:0,
    thumbnail:"",
    title:"",
    url:""
}

function AddSong(){
    const [addSong, {error}] = useMutation(ADD_SONG);
    const classes=useStyles();
    const [dialog,setDialog] = React.useState(false);
    const [playable, setPlayable] = React.useState(false);
    const [url,setUrl] = React.useState('');
    const [song,setSong] = React.useState(DEFAULT_SONG);

    React.useEffect(()=>{
        const isPlayable = YoutubePlayer.canPlay(url);
        setPlayable(isPlayable);
    },[url]);

    function handleCloseDialog(){
        setDialog(false);
    }

    async function handleEditSong({player}){
        const nestedPlayer = player.player.player;
        let songData;
        if(nestedPlayer.getVideoData){
            songData = getYoutubeInfo(nestedPlayer);
        }
        // else if(nestedPlayer.getCurrentSound){
        //     songData = await getSoundcloudInfo(nestedPlayer);
        // }
        setSong({...songData,url});
    }

    // function getSoundcloudInfo(player){
    //     return new Promise(resolve => {
    //         player.getCurrentSound(songData=>{
    //             if(songData){
    //                 resolve({
    //                     artist: songData.user.username,
    //                     duration: Number(songData.duration / 1000),
    //                     thumbnail: songData.artwork_url.replace('-large','-t500x500'),
    //                     title: songData.title,
    //                 });
    //             }
    //         });
    //     })
    // }

    function getYoutubeInfo(player){
        const duration = player.getDuration();
        const {title, video_id, author} = player.getVideoData();
        const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;
        return {
            artist: author,
            duration,            
            thumbnail,
            title
        }
    }

    async function handleAddSong(){
        //addSong({variables:})
        const {artist, duration, thumbnail, title, url} = song
        try{
            await addSong({
                variables: {
                    artist: artist.length > 0 ? artist : null,
                    duration: duration > 0 ? duration : null,
                    thumbnail: thumbnail.length > 0 ? thumbnail:null,
                    title: title.length > 0 ? title: null,
                    url: url.length > 0 ? url : null,
                }
            })
            handleCloseDialog();
            setSong(DEFAULT_SONG);
            setUrl('');
        }catch(error){
            console.log('Error adding song',song);
        }        
    }

    function handleChangeSong(event){
        const {name, value} = event.target;
        setSong(prevSong=>({
            ...prevSong,
            [name]:value
        }))
    }
    function handleError(field){
        return error?.graphQLErrors[0]?.extensions?.path.includes(field)
    }

    const {thumbnail,title,artist} = song;
    return (
        <div className={classes.container}>
            <Dialog
                className={classes.dialog}
                onClose={handleCloseDialog}
                open={dialog}
            >
                <DialogTitle>Edit Song</DialogTitle>
                <DialogContent>
                    <img 
                        alt="Song Thumbnail"
                        className={classes.thumbnail}
                        src={thumbnail}
                    />
                    <TextField
                        error={handleError('title')}
                        fullWidth
                        helperText={handleError('title') && "Fill out field"}
                        label="Title"
                        margin="dense"
                        name="title"
                        onChange={handleChangeSong}
                        value={title}
                    />
                    <TextField
                        error={handleError('artist')}
                        fullWidth
                        helperText={handleError('artist') && "Fill out field"}
                        label="Artist"
                        margin="dense"
                        name="artist"
                        onChange={handleChangeSong}
                        value={artist}
                    />
                    <TextField
                        error={handleError('thumbnail')}
                        fullWidth
                        helperText={handleError('thumbnail') && "Fill out field"}
                        margin="dense"
                        label="Thumbnail"
                        name="thumbnail"
                        onChange={handleChangeSong}
                        value={thumbnail}
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        color="secondary"
                        onClick={handleCloseDialog}
                    >
                        Cancel
                    </Button>
                    <Button 
                        color="primary"
                        onClick={handleAddSong}
                        variant="outlined"
                    >
                        Add Song
                    </Button>
                </DialogActions>

            </Dialog>
            <TextField 
                className={classes.urlInput}
                fullWidth
                InputProps={{
                    startAdornment:(
                        <InputAdornment position="start">
                            <Link/>
                        </InputAdornment>
                    )
                }}
                margin="normal"
                onChange={event=>setUrl(event.target.value)}
                placeholder="Add YouTube URL"
                type="url"
                value={url}
            />
            <Button
                className={classes.addSongButton}
                color="primary"
                disabled={!playable}
                endIcon={<AddBoxOutlined/>}
                onClick={()=>setDialog(true)}
                variant="contained"
            >
                Add
            </Button>
            <ReactPlayer url={url} hidden onReady={handleEditSong}/>
        </div>
    );
}

export default AddSong;