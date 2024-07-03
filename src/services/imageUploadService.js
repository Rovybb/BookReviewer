import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, "gs://" + process.env.FIREBASE_STORAGE_BUCKET);

const uploadImage = async (data_url, folder) => {
    const uploadedImageRef = ref(storage, folder + "/" + Date.now());
    await uploadString(uploadedImageRef, data_url, "data_url");
    return `https://firebasestorage.googleapis.com/v0/b/bookreviewer-be71e.appspot.com/o/${folder}%2F${uploadedImageRef.name}?alt=media&token=2c92dcb8-60b2-4d23-8810-84da335cae95`;
};

export default uploadImage;
