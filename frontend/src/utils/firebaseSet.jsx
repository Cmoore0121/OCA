import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"; 


const firebaseConfig = {
    apiKey: "AIzaSyCf8iDTkKmyen5vmq8b9bo8zEU5hXjGfqc",
    authDomain: "oca-sourcing.firebaseapp.com",
    projectId: "oca-sourcing",
    storageBucket: "oca-sourcing.appspot.com",
    messagingSenderId: "884281157514",
    appId: "1:884281157514:web:d93d3b87d6b4a5cfa90a73",
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("looking at db", db);

/*async function getCountOfPpp() {
  try {
    console.log("Attempting to fetch the count of documents from ppp collection...");
    const pppCollectionRef = collection(db, 'ppp');
    const pppSnapshot = await getDocs(pppCollectionRef);
    
    // This will return the count of documents in the ppp collection
    console.log(`Count of documents in ppp collection: ${pppSnapshot.size}`);
    return pppSnapshot.size;
  } catch (error) {
    console.error("Error getting ppp count:", error);
    throw new Error('Could not fetch the ppp collection.');
  }
}*/

async function queryDocumentsByField(fieldName, fieldValue) {
  try {
    const q = query(collection(db, 'ppp'), where(fieldName, '==', fieldValue));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`Found ${documents.length} documents with ${fieldName}="${fieldValue}":`, documents);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      console.log(`No documents found with ${fieldName}="${fieldValue}".`);
      return [];
    }
  } catch (error) {
    console.error(`Error querying documents by ${fieldName}:`, error);
  }
}


export {db,  queryDocumentsByField};