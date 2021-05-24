import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from "@/assets/firebase-config.json";
import { v4 as uuidv4 } from 'uuid';
import {EventBus} from "@/services/common/eventBus";
import {SHOW_ALERT_EVENT} from "@/services/common/events";
import {Response} from "@/services/common/response";

export class FirebaseImageUploader {
    constructor() {
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }
    }

    async Upload(img) {
        let picture;
        await new Promise((resolve, reject) => {
            console.log(uuidv4() + img.name);
            const storageRef = firebase.storage().ref(`raw/${uuidv4() + img.name}`).put(img);

            storageRef.on(`state_changed`, snapshot => {
                    console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                }, error => {
                    console.log(error.message);
                    EventBus.$emit(SHOW_ALERT_EVENT, new Response(null, error, error.message));
                    reject(error);
                },
                () => {
                    console.log('Upload complete');
                    storageRef.snapshot.ref.getDownloadURL().then((url) => {
                        picture = url;
                        resolve();
                    });
                }
            );
        });

        return picture;
    }
}