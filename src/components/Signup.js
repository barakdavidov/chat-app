import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  TextField,
  Grid,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import InfoContext from "./InfoContext";
import { signUpWithEmailAndPassword } from "../util/firebase.config";

export default function Signup() {
  // Get context
  const context = useContext(InfoContext);

  // States for the data of the form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // As the input is modified, change each state
  const handleChange = ({ target }) => {
    // Map every id with the setter for that state
    const set = {
      email: setEmail,
      password: setPassword,
      confirmPassword: setConfirmPassword,
      username: setUsername,
    };

    // Call the setter for the specific input changed
    set[target.id](target.value);
  };

  // Handle the submission of the form
  const handleSubmit = async (event) => {
    // Prevent default form submission
    event.preventDefault();

    // Validation
    if (confirmPassword !== password) {
      return alert("password not match");
    }

    // If inputs are empty show an error and return
    const inputs = { username, email, password, confirmPassword };
    let empty = false;
    for (let input in inputs) {
      if (!inputs[input]) {
        setErrors((prevErrors) => ({ ...prevErrors, [input]: "Is required" }));
        empty = true;
      }
    }
    if (empty) return;

    // Set loader
    setLoading(true);

    // Register user
    const isRegisteredSuccessful = await signUpWithEmailAndPassword({
      username,
      email,
      password,
    });

    if (isRegisteredSuccessful) {
      // display success msg

      // reset the form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUsername("");
    }

    // remove loader
    setLoading(false);
  };

  return (
    <Grid container>
      <Grid item sm />
      <Grid item sm>
        <Typography style={{ marginTop: "15px" }} variant="h2">
          Sign Up
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            style={{ marginTop: "10px" }}
            id="email"
            name="email"
            type="email"
            label="Email"
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
          <TextField
            style={{ marginTop: "10px" }}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            helperText={errors.confirmPassword}
            error={errors.confirmPassword ? true : false}
            value={confirmPassword}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            style={{ marginTop: "10px" }}
            id="username"
            name="username"
            type="text"
            label="Username"
            helperText={errors.username}
            error={errors.username ? true : false}
            value={username}
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
            SignUp
            {loading && <CircularProgress size={30} />}
          </Button>
          <br />
          <small>
            Already have an account ? Login <Link to="/login">here</Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
}
