import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  collection,
  getFirestore,
  addDoc,
  query,
  where,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5qu9oLw3V9p8l67Ua9fwTBl5RyBCPDeU",
  authDomain: "monkey-chat-2021.firebaseapp.com",
  projectId: "monkey-chat-2021",
  storageBucket: "monkey-chat-2021.appspot.com",
  messagingSenderId: "692820386600",
  appId: "1:692820386600:web:720acb0a6dc785e966261d",
  measurementId: "G-852VN0L3RP",
};

const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [user, setUser] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), setUser, setError);
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, error }} {...props} />;
};

const useAuthState = () => {
  const auth = useContext(AuthContext);
  return { ...auth, isAuthenticated: auth?.user != null };
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

async function getUser(uid) {
  const q = query(collection(db, "users"), where("uid", "==", uid));
  const { docs } = await getDocs(q);
  return docs[0].data();
}

async function getCurrentUser() {
  const q = query(
    collection(db, "users"),
    where("uid", "==", getAuth().currentUser.uid)
  );
  const { docs } = await getDocs(q);
  return docs[0].data();
}

async function updateUsername(username) {
  const q = query(
    collection(db, "users"),
    where("uid", "==", getAuth().currentUser.uid)
  );
  const { docs } = await getDocs(q);

  updateDoc(docs[0].ref, {
    username,
  });
}

const loginWithEmailAndPassword = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  } catch (err) {
    alert(err.message);
    return null;
  }
};

const signUpWithEmailAndPassword = async ({ username, email, password }) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await addDoc(collection(db, "users"), {
      uid: user.uid,
      username,
      email,
      authProvider: "local",
    });
    return true;
  } catch (err) {
    alert(err.message);
    return false;
  }
};

const loginWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;

    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docSnapShot = await getDocs(q);

    if (docSnapShot.size === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        username: user.displayName,
        email: user.email,
        authProvider: "google",
      });
    }
  } catch (err) {
    alert(err.message);
  }
};

const logout = async () => {
  await getAuth().signOut();
};

// to set profile picture
const uploadToFireBase = (file, cb) => {
  const storageRef = ref(storage, `/images/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
        default:
          console.log("");
      }
    },
    (error) => {
      // Handle unsuccessful uploads
    },
    // on complete
    async () => {
      const q = query(
        collection(db, "users"),
        where("uid", "==", getAuth().currentUser.uid)
      );
      const { docs } = await getDocs(q);

      updateDoc(docs[0].ref, {
        profile: file.name,
      });

      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        // download URl is the public location  of the uploaded file

        // TODO:: save the downloadURl to the user doc

        cb(downloadURL);
      });
    }
  );
};

// to get another profile picture
const getAnotherProfilePic = (uid) =>
  new Promise(async (resolve, reject) => {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const { docs } = await getDocs(q);

    const profileFileId = docs[0].data().profile;
    if (!profileFileId) {
      return resolve(null);
    }

    const storageRef = ref(storage, `/images/${profileFileId}`);

    getDownloadURL(storageRef)
      .then((downloadUrl) => {
        resolve(downloadUrl);
      })
      .catch((e) => reject(e));
  });

// to get profile picture
const getProfilePic = () =>
  new Promise(async (resolve, reject) => {
    const { currentUser } = getAuth();
    return getAnotherProfilePic(currentUser.uid).then(resolve).catch(reject);
  });

export {
  db,
  auth,
  logout,
  loginWithEmailAndPassword,
  loginWithGoogle,
  signUpWithEmailAndPassword,
  useAuthState,
  AuthContext,
  AuthContextProvider,
  uploadToFireBase,
  getAnotherProfilePic,
  getProfilePic,
  updateUsername,
  getCurrentUser,
  getUser,
};
