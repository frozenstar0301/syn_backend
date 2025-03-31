// config/firebase.ts
import { initializeApp as initializeClientApp } from 'firebase/app';
import { getFirestore as getClientFirestore } from 'firebase/firestore';
import { getStorage as getClientStorage } from 'firebase/storage';

// Import Firebase Admin SDK
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';


var serviceAccount = {
  "type": "service_account",
  "project_id": "screw-your-neighbor-0820",
  "private_key_id": "9b72bdedcb33d964721f862bb0a1d6fca8bd6a6e",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC89Mph/lVWoX9E\nZf5zcXzcbcKP4sB3QaWZPMHzXmvpkCIftMz4u+R7kUJ3IUvizEmk7ceIIWJcxzfi\nP79IDI9q2PyiQjvL3hLt0jh/Qzdw7YK+7SMr7pcvZlGqviS0SPF6mROQvaQ3kbv7\n5agYp0RrTK4ISYfZDEFmIWSAS6DCWAEYzpz7gy19g0rPJeR0rE77zYz7Tl8puGmQ\nNg3+46DAltQB6UP8wQOv/Lip1b+DbYJ5Mg1GkZILj+t8x+9XqMG2BeAw6Q4LlMrf\n6tw0etjW7attXABofRWfnQSIxgzZh57W829ZgST3XfROh8i6j9R9tg1MY3AE0bP5\nI2c9p7RFAgMBAAECggEAB+g8gd5JRu9KKpwUClOw9G55alkEUdlC60cyHJOSc3sv\nGmGQBEakmJErFV4k1VBUMp0qsOUovxYtHgAp6oNwCvoalFWuN+lKpH4cFCNFcinW\nQ1QcGS4KUJb5CuqbEZpN1KIMQg3VjefA1Jk3MBTr1Yunarxc/XW4VORH1uCTUR6Y\nLeab8VRfcGTfhdpiTXJERQ7rMRBWz5jIqJ64JcE+D/InwBN0zwxIv+Gv1+FJl6yq\nMdDq/uBHXX1bGgg8NMg0JteYD0dRMsb87uwdI3EbXXG46HupXDnjD6uF/3y3nknW\n1N5GS8KxTAcm8Mhe1eICV67udGuOjsYJp/A7WBg44QKBgQDwixvXXDFsWWo2eNHd\n/S7XIznluQXksJu8FF/6DJoJYiEvU5DS9DpQoKKTbpMd/7D8j6NnkmSW+4Q2UzCA\nxCixpuvvwGfpr+h0e3fY0DIsLMhRV/tjHBmYVQJdjkZeaqjCUlRnpyR18v2IQnNY\n7ZAJlccf4klRcwVKp1cvRMYScQKBgQDJGRU4KbikjWjB8E9v0q6kG6yxe1xrW2tY\nFOM29BJBJZeCZtLUBpqZ11nMOGaqMwPl348JyhYWqvqGCI/9HPW7HD13YdxXvGiM\nioejDdK0LJaMDQQ3j/Kbn5ZXuinjFFRTU9aaGxjE+rhbQEcQzFBINE+e1NdtFsKd\n4BEUzBHBFQKBgQCUPdbhqWKYGJ7ZhSopefAVDBORXK6iGqlPhusDSiLgJ4a2CPUW\n3QbXS7gFzj6CXWLws4ELwm+VkNoRNMGOidVebrW24sfnf85tgu4AQ4a4LL0jTGqT\n0OyBMdqsV5NMesUYRO7Zlmtk+WSARhuaMYX0MkcugiGXPaCEOo8DhYngMQKBgQCE\nHaaDL2XPNdgNEgQeQxvZVRUvxQwCvBzZ0V81S0Ry6G+RjFwWUABh8cldEfDhAIMf\nErC2jb3VRp8wT4/Jiq0mMHdxZymLuow1SQ2zYfF7zY9ak3KhzkBlXYM4P2YlecWs\nuPfUZtjvEIjt6lzF/HUB+twUTWD6mmlhr0OJlkhTwQKBgQC/7mxFmcNVazutRUSO\nJbA1yjeptishCuzyCkaafDKkn/zP+R5FoINokPu1HyDPc8i4cfIG/ynHuecmRCz4\ntGytBC0CSMeN2uN49UjFazWe4FptsgF3f+COxFOhPv0Yva8LUvieSVhqhwXD79ge\nGxd2X5qqdxZ0eszZl4nR1ZzaKA==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@screw-your-neighbor-0820.iam.gserviceaccount.com",
  "client_id": "101111083130249718985",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40screw-your-neighbor-0820.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Client SDK configuration (if you need it for some client-side operations)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABSE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase client SDK (if needed)
const clientApp = initializeClientApp(firebaseConfig);
const clientDb = getClientFirestore(clientApp);
const clientStorage = getClientStorage(clientApp);

// Initialize Firebase Admin SDK with service account
// Import service account JSON file
const storageBucketName = process.env.FIREBASE_STORAGE_BUCKET;

if (!storageBucketName) {
  console.error('ERROR: FIREBASE_STORAGE_BUCKET environment variable is not defined!');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

// Get Admin SDK instances
const adminDb = getFirestore();
const adminStorage = getStorage();

// Export both client and admin instances
export { 
  // Client SDK exports (if needed)
  clientDb as db, 
  clientStorage as storage,
  
  // Admin SDK exports (use these for server-side operations)
  adminDb, 
  adminStorage 
};
