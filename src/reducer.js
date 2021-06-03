import {createContext} from 'react';

export const PAUSE_SONG = "PAUSE_SONG"
export const PLAY_SONG = "PLAY_SONG"
export const SET_SONG = "SET_SONG"

export const SongContext = createContext({
    song:{
      id:"d9443a71-16ab-4a7e-aff7-1a226ddeb47b",
      title: "Pariah",
      artist: "Steven Wilson, Ninet Tayeb",
      thumbnail : "https://img.youtube.com/vi/cNTaFArEObU/0.jpg",
      url: "https://youtu.be/cNTaFArEObU",
      duration: 279,
    },
    isPlaying: false
  });

function SongReducer(state, action){
    switch(action.type){
        case PAUSE_SONG:{
            return {
                ...state,
                isPlaying:false
            }
        }
        case PLAY_SONG:{
            return {
                ...state,
                isPlaying:true
            }
        }
        case SET_SONG:{
            return {
                ...state,
                song: action.payload.song
            }
        }
        default:
            return state
    }

}

export default SongReducer