// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, Timestamp } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxYyKhmG60UmhYVr0tg4zK1pDECCuSh74",
  authDomain: "masai-hackathon-2025.firebaseapp.com",
  projectId: "masai-hackathon-2025",
  storageBucket: "masai-hackathon-2025.firebasestorage.app",
  messagingSenderId: "238054021956",
  appId: "1:238054021956:web:839b94f701d576373f9511",
  databaseURL: "https://masai-hackathon-2025-default-rtdb.firebaseio.com/", // Add this line for Realtime Database
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const eventsCollectionRef = collection(db, "events");

// Function to get all events from Firestore
export const getEvents = async (setEvents) => {
  try {
    const querySnapshot = await getDocs(eventsCollectionRef);
    const events = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const start = new Date(data.start.seconds * 1000);  // Convert Firestore timestamp to Date
      const end = new Date(data.end.seconds * 1000);
      return {
        id: doc.id,
        title: data.task,
        description: data.description,
        priority: data.priority,
        creator: data.creator,
        start,
        end,
      };
    });
    setEvents(events);
  } catch (error) {
    console.error("Error fetching events: ", error);
  }
};

// Function to add a new event to Firestore
export const addEvent = async (newEvent) => {
  try {
    const docRef = await addDoc(eventsCollectionRef, {
      task: newEvent.task,
      description: newEvent.description || "",  // Ensure description is not undefined
      priority: newEvent.priority || "Medium", // Default to 'Medium' if no priority is provided
      creator: newEvent.creator || "Unknown",  // Default to 'Unknown' if no creator is provided
      start: Timestamp.fromDate(new Date(newEvent.start)), // Store the Date object as Firestore Timestamp
      end: Timestamp.fromDate(new Date(newEvent.end)),     // Store the Date object as Firestore Timestamp
    });
    console.log("Event added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding event: ", error);
  }
};

export { app, auth, db };
