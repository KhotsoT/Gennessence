import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCTH3ay7eLmX0TTNOzEK1AXyXfgZqJb-CY",
  authDomain: "gennessence-water.firebaseapp.com",
  projectId: "gennessence-water",
  storageBucket: "gennessence-water.firebasestorage.app",
  messagingSenderId: "1089500554617",
  appId: "1:1089500554617:web:e0347b6d46ea78707e3ba8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app; 