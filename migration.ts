// src/scripts/migrateToFirebase.ts
import { createClient } from '@supabase/supabase-js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Firebase setup
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateCollection(tableName: string, collectionName: string) {
    console.log(`Migrating ${tableName} to ${collectionName}...`);

    // Fetch data from Supabase
    const { data, error } = await supabase
        .from(tableName)
        .select('*');

    if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        return;
    }

    if (!data || data.length === 0) {
        console.log(`No data found in ${tableName}`);
        return;
    }

    console.log(`Found ${data.length} records in ${tableName}`);

    // Add to Firebase
    const collectionRef = collection(db, collectionName);

    for (const item of data) {
        try {
            // Convert timestamps
            const itemData = { ...item };
            delete itemData.id; // Remove Supabase ID

            if (itemData.created_at) {
                itemData.created_at = Timestamp.fromDate(new Date(itemData.created_at));
            }

            if (itemData.updated_at) {
                itemData.updated_at = Timestamp.fromDate(new Date(itemData.updated_at));
            }

            if (itemData.reset_password_expires) {
                itemData.reset_password_expires = Timestamp.fromDate(new Date(itemData.reset_password_expires));
            }

            await addDoc(collectionRef, itemData);
        } catch (err) {
            console.error(`Error adding document from ${tableName}:`, err);
        }
    }

    console.log(`Migration of ${tableName} completed`);
}

async function migrateData() {
    try {
        await migrateCollection('users', 'users');
        await migrateCollection('fonts', 'fonts');
        await migrateCollection('images', 'images');
        await migrateCollection('screens', 'screens');

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit();
    }
}

migrateData();
