import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import {
  getProfilePic,
  uploadToFireBase,
  updateUsername,
  getCurrentUser,
} from "../util/firebase.config";

export default function Profile() {
  const [imageFile, setImagefile] = React.useState();
  const [imageURL, setImageURL] = React.useState();
  const [isUploading, setIsUploading] = React.useState(false);

  const [userName, setUserName] = React.useState();
  React.useEffect(() => {
    async function effect() {
      const currentUser = await getCurrentUser();
      setUserName(currentUser.username);
    }
    effect();
  }, []);

  const handleSubmit = async () => {
    if (!userName) return;
    // Save Username
    updateUsername(userName);
  };

  const handleImageFile = (e) => {
    const image = e.target.files[0];
    setImagefile(image);
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
    setIsUploading(true);

    if (!imageFile) return alert("Nothing to upload");
    function getImageURL(imgURL) {
      setImageURL(imgURL);
      setIsUploading(false);
    }

    uploadToFireBase(imageFile, getImageURL);
  };

  React.useEffect(() => {
    getProfilePic().then((imgURL) => {
      setImageURL(imgURL);
      setIsUploading(false);
    });
  }, []);

  return (
    <div>
      <h1>Profile Page</h1>
      {imageURL && <img src={imageURL} alt="" width="200" />}

      <h3>User Details</h3>

      <div>
        <TextField
          required
          id="outlined-required"
          label="User Name"
          defaultValue="Enter username here"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <Button onClick={handleSubmit}>Submit</Button>

      <form>
        <h3>Upload a Profile Picture </h3>

        <input type="file" onChange={handleImageFile} />
        {isUploading ? (
          <span>upload...</span>
        ) : (
          <Button variant="contained" onClick={handleImageUpload}>
            Upload
          </Button>
        )}
      </form>
    </div>
  );
}
