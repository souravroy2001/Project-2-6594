import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updatePassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

async function registerUser(email, password) {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  }
}

async function loginUser(email, password) {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }
}

async function registerWithGoogleUser() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    window.location.href = "/";
    return result;
  } catch (error) {
    console.error("Error with Google sign-in:", error.message);
    throw error;
  }
}

function doSignout() {
  return signOut(auth)
    .then(() => {
      // Sign-out successful
      window.location.href = "/";
    })
    .catch((error) => {
      console.error("Error signing out:", error.message);
    });
}

function doPasswordReset(email) {
  try {
    return sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    throw error;
  }
}

function doPasswordChange(password) {
  if (!auth.currentUser) {
    throw new Error("No user is currently logged in.");
  }
  try {
    return updatePassword(auth.currentUser, password);
  } catch (error) {
    console.error("Error updating password:", error.message);
    throw error;
  }
}

function doSendEmailVerification() {
  if (!auth.currentUser) {
    throw new Error("No user is currently logged in.");
  }
  try {
    return sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/home`,
    });
  } catch (error) {
    console.error("Error sending email verification:", error.message);
    throw error;
  }
}

export {
  registerUser,
  loginUser,
  registerWithGoogleUser,
  doSignout,
  doPasswordReset,
  doPasswordChange,
  doSendEmailVerification,
};
