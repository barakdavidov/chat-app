import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Grid,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

import {
  auth,
  loginWithEmailAndPassword,
  loginWithGoogle,
} from "../util/firebase.config";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // As the input is modified, change each state
  const handleChange = ({ target }) => {
    // Map every id with the setter for that state
    const set = {
      email: setEmail,
      password: setPassword,
    };

    // Call the setter for the specific input changed
    set[target.id](target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // If inputs are empty show an error and return
    const inputs = { email, password };
    let empty = false;
    for (let input in inputs) {
      if (!inputs[input]) {
        setErrors((prevErrors) => ({ ...prevErrors, [input]: "Is required" }));
        empty = true;
      }
    }
    if (empty) return;

    setLoading(true);

    // Sign in user
    const loggedUser = await loginWithEmailAndPassword(email, password);
    if (loggedUser) setUser(loggedUser);

    setLoading(false);
  };

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) navigate("/");
    });
  }, []);

  return (
    <Grid container>
      <Grid item sm />
      <Grid item sm>
        <Typography style={{ marginTop: "15px" }} variant="h2">
          Login
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            style={{ marginTop: "10px" }}
            id="email"
            name="email"
            type="email"
            label="email"
            helperText={errors.email}
            error={errors.email ? true : false}
            value={email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            style={{ marginTop: "10px" }}
            id="password"
            name="password"
            type="password"
            label="Password"
            helperText={errors.password}
            error={errors.password ? true : false}
            value={password}
            onChange={handleChange}
            fullWidth
          />
          {errors.general && (
            <Typography variant="body2">{errors.general}</Typography>
          )}
          <Button
            style={{ marginTop: "10px" }}
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Login
            {loading && <CircularProgress size={30} />}
          </Button>

          <br />
        </form>
        <small>
          dont have an account ? sign up <Link to="/signup">here</Link>
        </small>
        <h3>OR</h3>
        <Button
          style={{ marginTop: "10px" }}
          onClick={loginWithGoogle}
          type="submit"
          variant="outlined"
          disabled={loading}
        >
          Sign In with Google
          {loading && <CircularProgress size={30} />}
        </Button>
      </Grid>
      <Grid item sm />
    </Grid>
  );
}
