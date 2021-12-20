import React, { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { red } from "@mui/material/colors";

export default function Favorite(id) {
  // FUTURE FEATURE COMMENTS
  // To interact with the table on the database
  // the initialState could be something like entryExistsOnLikesTable({userID: user.id, messageID: id})
  const [liked, setLiked] = useState(false);
  const handleClick = () => {
    // toggleLike(id);
    setLiked(!liked);
  };
  return (
    (liked && (
      <FavoriteIcon sx={{ color: red[500] }} onClick={handleClick} />
    )) || <FavoriteBorderIcon sx={{ color: red[500] }} onClick={handleClick} />
  );
}
