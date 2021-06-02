import React from 'react'
import { makeStyles, AppBar, Container, Toolbar, Typography } from '@material-ui/core'
import identity from '../assets/identity.png'

const useStyles = makeStyles({
    avatar:{
        height:25,
        objectFit: 'contain'
    },
    toolbar:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
    }
});

const Footer = () => {
    const classes = useStyles()
    return (
        <AppBar position="static" color="primary">
          <Container>
            <Toolbar className={classes.toolbar} >
              <Typography variant="body1" color="inherit">
                Developed and Designed by argon &nbsp;
              </Typography>
              <img src={identity} className={classes.avatar} alt="argon" />
            </Toolbar>
          </Container>
        </AppBar>
    )
}

export default Footer
