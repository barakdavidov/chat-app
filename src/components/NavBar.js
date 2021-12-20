import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.jpg";
import placeholder from "../images/placeholder.jpeg";

import { AppBar, Toolbar, CssBaseline, makeStyles } from "@material-ui/core";
import { useAuthState, logout, getProfilePic } from "../util/firebase.config";
import { Button } from "@mui/material";
import { getAuth } from "firebase/auth";

const useStyles = makeStyles((theme) => ({
  logo: {
    cursor: "pointer",
    width: "220px",
  },
  link: {
    textDecoration: "none",
    color: "#1153BF",
    fontSize: "18px",
    fontWeight: "bold",
    marginLeft: theme.spacing(5),
    "&:hover": {
      color: "#1153BF",
      borderBottom: "1px solid #1153BF",
    },
  },
  navlinks: {
    alignItems: "center",
    display: "flex",
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const { isAuthenticated } = useAuthState();

  const [url, setUrl] = useState("");
  const safeUrl = url || placeholder;
  const { currentUser } = getAuth();

  useEffect(() => {
    if (currentUser !== null) {
      getProfilePic()
        .then((pic) => setUrl(pic))
        .catch((error) => {
          setUrl("");
        });
    }
  }, [currentUser]);

  return (
    <AppBar position="static" color="inherit">
      <CssBaseline />
      <Toolbar
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <img src={logo} alt="Chat Express!" className={classes.logo} />
        <div className={classes.navlinks}>
          <Link to="/" className={classes.link}>
            Home
          </Link>
          <Link to="/profile" className={classes.link}>
            {
              <img
                style={{ width: "45px", height: "45px", borderRadius: "50%" }}
                src={safeUrl}
                alt="profile"
              />
            }
          </Link>
          {isAuthenticated ? (
            <Button
              variant="outlined"
              onClick={logout}
              style={{ marginLeft: 30 }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Link to="/login" className={classes.link}>
                Log in
              </Link>
              <Link to="/signup" className={classes.link}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
