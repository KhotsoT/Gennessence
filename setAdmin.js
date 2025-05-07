import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Read the service account key
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setAdmin() {
  const userId = 'kcL2EKPyBba9136nX7MJXbKfj473'; // <-- Replace with your Firebase Auth UID
  await db.collection('users').doc(userId).set({
    email: 'khotso.thebehali@gmail.com',        // <-- Replace with your email
    name: 'Khotso',                    // <-- Replace with your name
    role: 'admin'
  }, { merge: true });
  console.log('Admin user set!');
}

setAdmin().then(() => process.exit());