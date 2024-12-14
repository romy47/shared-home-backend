import admin from "firebase-admin";
let firebaseApp: admin.app.App;

// Singleton FirebaseAdmin
export const initializeFirebaseAdmin = (): admin.app.App => {
  if (!firebaseApp) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(
        require("./../../firebase-admin-sdk.json")
      ),
    });
  }

  return firebaseApp;
};

export const firebaseAuth = () => initializeFirebaseAdmin().auth();
