import { initializeApp } from 'firebase/app'
import {getFirestore, collection, getDocs, query, where} from 'firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCf8iDTkKmyen5vmq8b9bo8zEU5hXjGfqc",
    authDomain: "oca-sourcing.firebaseapp.com",
    projectId: "oca-sourcing",
    storageBucket: "oca-sourcing.appspot.com",
    messagingSenderId: "884281157514",
    appId: "1:884281157514:web:d93d3b87d6b4a5cfa90a73",
    measurementId: "G-MYNZ2CKXQ4"
  };


initializeApp(firebaseConfig);
const db = getFirestore()

async function findBusiness(businessName, state) {
  const pppCollection = collection(db, 'ppp');
  let initialQuery = query(pppCollection, where('business_name', '==', businessName), where("state", "==", state));
  let results = [];

  try {
      let querySnapshot = await getDocs(initialQuery);

      // Check initial full name query results
      if (!querySnapshot.empty) {
          querySnapshot.forEach(doc => results.push(doc));

          if (results.length === 1) {
              console.log(`Unique match found for full name: ${results[0].id}`, results[0].data());
              return results.map(doc => ({ id: doc.id, ...doc.data() }));
          } else {
              console.log("Multiple matches found for full name, returning all:");
              results.forEach(doc => {
                  console.log(`${doc.id}`, doc.data());
              });
              return results.map(doc => ({ id: doc.id, ...doc.data() }));
          }
      }

      // If no results for full name, proceed with word-by-word search
      console.log("No exact matches for full name, initiating word-by-word search...");
      results = [];
      let currentQuery = pppCollection;
      const words = businessName.split(' ');

      for (let i = 0; i < words.length; i++) {
          currentQuery = query(currentQuery, where(`business_name_word${i + 1}`, '==', words[i]), where("state", "==", state));
          querySnapshot = await getDocs(currentQuery);

          if (!querySnapshot.empty) {
              querySnapshot.forEach(doc => results.push(doc));
          }

          if (results.length === 1) {
              console.log(`Unique match found: ${results[0].id}`, results[0].data());
              return results.map(doc => ({ id: doc.id, ...doc.data() }));
          }

          // Reset results if no matches found in this iteration
          if (querySnapshot.empty) {
              results = [];
              break;
          }
      }

      if (results.length === 0) {
          console.log("No matches found after word-by-word search.");
      } else {
          console.log("Multiple matches found after word-by-word search, please refine your search:");
          results.forEach(doc => {
              console.log(`${doc.id}`, doc.data());
          });
      }
  } catch (error) {
      console.error("Error searching for business:", error);
  }

  return results.map(doc => ({ id: doc.id, ...doc.data() }));
}

