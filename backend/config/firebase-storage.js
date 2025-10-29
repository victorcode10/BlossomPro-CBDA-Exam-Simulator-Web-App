const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let storage = null;
let bucket = null;
let isInitialized = false;

const initializeFirebaseStorage = () => {
  try {
    if (isInitialized) {
      console.log('⚠️  Firebase Storage already initialized');
      return { storage, bucket };
    }

    // Try to use service account JSON file
    const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
    
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: `${serviceAccount.project_id}.appspot.com`
        });
      }
      
      storage = admin.storage();
      bucket = storage.bucket();
      isInitialized = true;
      
      console.log('✅ Firebase Storage initialized successfully');
      return { storage, bucket };
    } 
    // Fallback to environment variables
    else if (process.env.FIREBASE_PROJECT_ID) {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
          }),
          storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
        });
      }
      
      storage = admin.storage();
      bucket = storage.bucket();
      isInitialized = true;
      
      console.log('✅ Firebase Storage initialized with environment variables');
      return { storage, bucket };
    }

    console.log('⚠️  Firebase Storage not configured');
    return { storage: null, bucket: null };
  } catch (error) {
    console.error('❌ Firebase Storage initialization error:', error.message);
    return { storage: null, bucket: null };
  }
};

// Upload CSV to Firebase Storage
const uploadCSVToFirebase = async (csvContent, filename) => {
  try {
    const { bucket } = initializeFirebaseStorage();
    if (!bucket) {
      return { success: false, error: 'Firebase Storage not initialized' };
    }

    const file = bucket.file(`exports/${filename}`);
    
    await file.save(csvContent, {
      metadata: {
        contentType: 'text/csv',
        metadata: {
          uploadedAt: new Date().toISOString()
        }
      }
    });

    // Make file publicly accessible (or keep private for admin only)
    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/exports/${filename}`;

    console.log(`✅ CSV uploaded to Firebase Storage: ${filename}`);
    return { 
      success: true, 
      url: publicUrl,
      filename,
      message: 'CSV uploaded to cloud storage'
    };
  } catch (error) {
    console.error('❌ Error uploading to Firebase Storage:', error);
    return { success: false, error: error.message };
  }
};

// List all uploaded CSVs
const listCSVFiles = async () => {
  try {
    const { bucket } = initializeFirebaseStorage();
    if (!bucket) {
      return { success: false, error: 'Firebase Storage not initialized' };
    }

    const [files] = await bucket.getFiles({ prefix: 'exports/' });
    
    const csvFiles = await Promise.all(
      files.map(async (file) => {
        const [metadata] = await file.getMetadata();
        return {
          name: file.name,
          size: metadata.size,
          created: metadata.timeCreated,
          url: `https://storage.googleapis.com/${bucket.name}/${file.name}`
        };
      })
    );

    return { success: true, files: csvFiles };
  } catch (error) {
    console.error('❌ Error listing CSV files:', error);
    return { success: false, error: error.message };
  }
};

// Delete CSV file
const deleteCSVFile = async (filename) => {
  try {
    const { bucket } = initializeFirebaseStorage();
    if (!bucket) {
      return { success: false, error: 'Firebase Storage not initialized' };
    }

    await bucket.file(`exports/${filename}`).delete();

    console.log(`✅ CSV deleted from Firebase Storage: ${filename}`);
    return { success: true, message: 'File deleted successfully' };
  } catch (error) {
    console.error('❌ Error deleting CSV file:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  initializeFirebaseStorage,
  uploadCSVToFirebase,
  listCSVFiles,
  deleteCSVFile
};