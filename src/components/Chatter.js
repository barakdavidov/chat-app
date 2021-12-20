import React from "react";
import { useState, useContext } from "react";
import { getCurrentUser } from "../util/firebase.config";

import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

import FormControl from "@mui/material/FormControl";
import { isValidLength } from "../util";
import InfoContext from "./InfoContext";
import CircularProgress from "@mui/material/CircularProgress";

import { getAuth } from "firebase/auth";

export default function Chatter() {
  const context = useContext(InfoContext);

  // State for tweet content
  const [content, setContent] = useState("");

  // State for tweet validation(between 1 and 140 chars)
  const [submitDisabled, setSubmitDisabled] = useState(true);

  // Error message flag only if needed
  const [error, setError] = useState(false);

  const [userName, setUserName] = React.useState();
  React.useEffect(() => {
    async function effect() {
      const currentUser = await getCurrentUser();
      setUserName(currentUser.username);
    }

    effect();
  }, []);

  // Saves the tweet text as you write it, also updates the
  // message validation
  const handleChange = ({ target }) => {
    // (remove any whitespace from start and remove newlines from end)
    let cleanMsg = target.value.trimStart().replace(/\n$/, "");

    setContent(cleanMsg);

    setSubmitDisabled(!isValidLength(cleanMsg, 140));

    setError(cleanMsg.length > 140);
  };

  // Once button is clicked, add tweet
  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUser = getAuth().currentUser;

    context.addNewTweet({
      userName,
      content: content.trim(),
      date: new Date(Date.now()).toISOString(),
      authorId: currentUser.uid,
    });

    // Reset the chatter state
    setContent("");
    setSubmitDisabled(true);
    setError(false);
  };

  return (
    <form
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <FormControl style={{ marginTop: "30px" }} sx={{ width: "130%" }}>
        <TextField
          id="outlined-multiline-static"
          multiline
          rows={5}
          onChange={handleChange}
          value={content}
          InputProps={{
            endAdornment: (context.inAddingProcess && <CircularProgress />) || (
              <Button
                style={{ alignSelf: "flex-end" }}
                type="submit"
                disabled={submitDisabled}
                variant="contained"
                endIcon={<SendIcon />}
              >
                Send
              </Button>
            ),
          }}
        />
        <Alert severity={(error && "error") || "primary"}>
          {content.length} characters
        </Alert>
      </FormControl>
    </form>
  );
}
