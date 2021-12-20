import axios from "axios";
import { getFirestore, addDoc, collection } from "@firebase/firestore";
const BASE_URL =
  "https://micro-blogging-dot-full-stack-course-services.ew.r.appspot.com";

export const getTweetsFromServer = async () => {
  try {
    const messages = await axios.get(`${BASE_URL}/tweet`);
    return messages.data.tweets;
  } catch (e) {
    return [];
  }
};

export const addTweet = async (tweet) => {
  const db = getFirestore();
  try {
    // const createdTweet = await axios.post(`${BASE_URL}/tweet`, tweet);
    const docRef = await addDoc(collection(db, "chatter"), tweet);
    return docRef;
  } catch (e) {
    alert(e);
  }
};
