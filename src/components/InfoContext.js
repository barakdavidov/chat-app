import { createContext } from "react";

const InfoContext = createContext({
  inAddingProcess: false,
  messages: [],
  getTweets: () => {},
  addNewTweet: () => {},
  signUpUser: () => {},
  logInUser: () => {},
});

export default InfoContext;
