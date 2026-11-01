import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import * as FS from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import * as AU from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {firebaseConfig} from './firebase-config.js';
export const ready=!!firebaseConfig.apiKey&&!firebaseConfig.apiKey.startsWith('ВСТАВЬ');
const app=ready?initializeApp(firebaseConfig):null;
export const db=ready?FS.getFirestore(app):null;
export const auth=ready?AU.getAuth(app):null;
export {FS,AU};
