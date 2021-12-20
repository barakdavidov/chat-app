import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Chatter from "./components/Chatter";
import Messages from "./components/Messages";
import NavBar from "./components/NavBar";
import Profile from "./components/Profile";
import { addTweet } from "./util/server";
import { useState, useEffect } from "react";
import InfoContext from "./components/InfoContext";
import CircularProgress from "@mui/material/CircularProgress";
import Signup from "./components/Signup";
import Login from "./components/Login";
import {
  getFirestore,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import {
  AuthContextProvider,
  getAnotherProfilePic,
} from "./util/firebase.config";
import placeholder from "./images/placeholder.jpeg";
import AuthenticatedRoute from "./components/Authenticated";

function App() {
  // Firestore db
  const db = getFirestore();

  const [inAddingProcess, setInAddingProcess] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsloading] = useState(true);

  // Effect to retrieve messages from db
  useEffect(() => {
    const q = query(collection(db, "chatter"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setIsloading(true);
      const res = [];
      querySnapshot.forEach((doc) => res.push({ id: doc.id, ...doc.data() }));

      Promise.all(
        res.map((msg) => {
          if (!msg.authorId) {
            msg.authorAvatar = placeholder;
            return;
          }
          return getAnotherProfilePic(msg.authorId)
            .then((profileImageUrl) => {
              msg.authorAvatar = profileImageUrl || placeholder;
            })
            .catch(console.error);
        })
      ).then(() => {
        setMessages(res);

        setIsloading(false);
      });
    });
    return () => {
      unsub();
    };
  }, []);

  const addNewTweet = async (newTweet) => {
    // Set adding as true at start and false at end
    setInAddingProcess(true);

    await addTweet(newTweet);

    // No longer adding
    setInAddingProcess(false);
  };

  return (
    <div className="App">
      <AuthContextProvider>
        <InfoContext.Provider
          value={{
            inAddingProcess,
            messages,
            addNewTweet,
            signUpUser: () =>
              new Promise((resolve) => setTimeout(resolve, 1000)),
            logInUser: () =>
              new Promise((resolve) => setTimeout(resolve, 1000)),
          }}
        >
          <Router>
            <NavBar />
            <Routes>
              <Route exact path="/" element={<AuthenticatedRoute />}>
                <Route
                  exact
                  path="/"
                  element={
                    <>
                      <Chatter />
                      {/* if loading show loader, else the messages */}
                      {(isLoading && <CircularProgress />) || <Messages />}
                    </>
                  }
                />
                {/* <Route exact path="/" element={<AuthenticatedRoute />}></Route> */}
                <Route exact path="/profile" element={<Profile />} />
              </Route>
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signup" element={<Signup />} />
            </Routes>
          </Router>
        </InfoContext.Provider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
