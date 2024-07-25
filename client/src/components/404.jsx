import React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";

//assets

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '50rem',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        '& img': {
            width: '5rem',
            marginBottom: '1rem',
        },
        '& h1': {
            fontSize: 75,
            margin: 0,
        }
    }
});

const Err = () => {

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Container className={classes.container}>
                
                <h1>Moon 404</h1>
                <span>Nothing to see here...</span>
            </Container>
        </Box>
    );
};
//<img src={cupColorLarge} alt="cup" />
export default Err;