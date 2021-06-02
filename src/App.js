import React from 'react';
import Header from './components/Header';
import AddSong from './components/AddSong';
import SongList from './components/SongList';
import SongPlayer from './components/SongPlayer';
import Footer from './components/Footer';
import { Grid, useMediaQuery } from '@material-ui/core';
import SongReducer, {SongContext} from './reducer';


function App() {
  const greaterThanMd = useMediaQuery(theme => theme.breakpoints.up('md'));

  const initialSongState = React.useContext(SongContext);
  const [state, dispatch] = React.useReducer(SongReducer,initialSongState);
  
  if(greaterThanMd) {return (
    <SongContext.Provider value={{state,dispatch}}>

      <Header/>
      <Grid 
        container 
        spacing={3}
        style={{
          paddingTop: 80,
          // background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)"
        }}
      >
        <Grid item xs={12} md={7}>
          <AddSong/>
          <SongList/>
        </Grid>
        <Grid item xs={12} md={5} style={
          {
            position:'fixed',
            right: 0,
            top:70,
            width:'100%',
          }
        }>
          <SongPlayer/>
        </Grid>
      </Grid>
    </SongContext.Provider>
  );}else{
    return(
      <>
        <SongContext.Provider value={{state,dispatch}}>
          <Header/>
          <Grid 
            container 
            spacing={3}
            style={{
              paddingTop: 80,
              // background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)"
            }}
          >
            <Grid item xs={12}>
              <SongPlayer/>
            </Grid>
            <Grid item xs={12} style={
              {
                top:170,
                width:'100%'
              }
            } >
              <AddSong/>
              <SongList/>
            </Grid>
          </Grid>
          <Footer/>
        </SongContext.Provider>
      </>
    )
  }
}

export default App;
