import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyBvhloah0UqJ9I_M-GvfN9Z15m8hTFHuQ0",
  authDomain: "swiggy-knowledge-sharing-quiz.firebaseapp.com",
  databaseURL: "https://swiggy-knowledge-sharing-quiz-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "swiggy-knowledge-sharing-quiz",
  storageBucket: "swiggy-knowledge-sharing-quiz.firebasestorage.app",
  messagingSenderId: "362782502357",
  appId: "1:362782502357:web:b1c73115fd4030912ea15c",
  measurementId: "G-SZ6TJ79P82"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
