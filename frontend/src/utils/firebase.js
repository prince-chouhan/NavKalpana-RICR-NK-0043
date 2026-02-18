// import { initializeApp } from 'firebase/app';
// import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID
// };

// // Debug: Log config to check if env variables are loaded
// console.log('🔥 Firebase Config Check:');
// console.log('API Key:', firebaseConfig.apiKey ? `✅ ${firebaseConfig.apiKey.substring(0, 20)}...` : '❌ MISSING');
// console.log('Auth Domain:', firebaseConfig.authDomain || '❌ MISSING');
// console.log('Project ID:', firebaseConfig.projectId || '❌ MISSING');
// console.log('Storage Bucket:', firebaseConfig.storageBucket || '❌ MISSING');
// console.log('Messaging Sender ID:', firebaseConfig.messagingSenderId || '❌ MISSING');
// console.log('App ID:', firebaseConfig.appId ? `✅ ${firebaseConfig.appId.substring(0, 20)}...` : '❌ MISSING');

// if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('your_')) {
//   console.error('❌ FIREBASE ERROR: API key is missing or using placeholder value!');
//   console.error('📝 Fix: Update frontend/.env with your actual Firebase credentials');
//   console.error('🔄 Then restart the dev server: npm run dev');
// }

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();

// // Configure Google provider
// googleProvider.setCustomParameters({
//   prompt: 'select_account'
// });

// // Sign in with Google popup
// export const signInWithGoogle = async () => {
//   try {
//     const result = await signInWithPopup(auth, googleProvider);
//     const user = result.user;
    
//     // Get the ID token
//     const idToken = await user.getIdToken();
    
//     return {
//       idToken,
//       user: {
//         uid: user.uid,
//         email: user.email,
//         displayName: user.displayName,
//         photoURL: user.photoURL
//       }
//     };
//   } catch (error) {
//     console.error('Google sign-in error:', error);
//     throw error;
//   }
// };

// export default app;
