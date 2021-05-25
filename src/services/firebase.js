import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from "@/assets/firebase-config.json";
import {v4 as uuidv4} from 'uuid';
import {EventBus} from "@/services/common/eventBus";
import {SHOW_ALERT_EVENT} from "@/services/common/events";
import {Response} from "@/services/common/response";
import {err} from "@/services/common/errors";

export class FirebaseImageUploader {
    constructor() {
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }
    }

    async Upload(path, img) {
        let picture;
        await new Promise((resolve, reject) => {
            console.log(uuidv4() + img.name);
            const storageRef = firebase.storage().ref(`${path}/${uuidv4() + img.name}`).put(img);

            storageRef.on(`state_changed`, snapshot => {
                    console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                }, error => {
                    err(error);
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