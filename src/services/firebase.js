import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from "@/assets/firebase-config.json";
import {v4 as uuidv4} from 'uuid';
import {err} from "@/services/common/errors";
import config from "@/assets/config.json";

export class FirebaseImageUploader {
    constructor() {
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
            firebase.storage().setMaxUploadRetryTime(config.firebase_max_upload_retry_time);
        }
    }

    upload(path, img) {
        return new Promise((resolve, reject) => {
            const storageRef = firebase.storage().ref(`${path}/${uuidv4() + img.name}`).put(img);
            storageRef.then((snapshot => {
                snapshot.ref.getDownloadURL().then((url) => {
                    resolve(url);
                });
            }), error => reject(err(error)));
        });
    }
}