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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("looking at db", db);


async function queryDocumentsByFlexibleCriteria( zipCode, naicsStart, naicsEnd, state, selectedDistrict, minLoanAmount, maxLoanAmount) {
    try {
      let conditions = [];
      let queryRef = collection(db, 'ppp');
  
      if (zipCode) {
        const zipCodeNumber = Number(zipCode.trim());
        if (!isNaN(zipCodeNumber)) {
            conditions.push(where('zip', '==', zipCodeNumber));
        }
      }
      if (naicsStart && naicsEnd) {
        conditions.push(where('naics_code', '>=', naicsStart.trim()));
        conditions.push(where('naics_code', '<=', naicsEnd.trim()));
      }
      if (state) {
        conditions.push(where('state', '==', state.trim()));
      }
      if (selectedDistrict != "All Districts" && selectedDistrict != "" ) {
        conditions.push(where('cd', '==', selectedDistrict.trim()));
      }

      if (minLoanAmount) {
        const minLoanNumber = Number(minLoanAmount.trim());
        if (!isNaN(minLoanNumber)) {
            conditions.push(where('loan_amount', '>=', minLoanNumber));
        }
      }

      if (maxLoanAmount) {
        const maxLoanNumber = Number(maxLoanAmount.trim());
        if (!isNaN(maxLoanNumber)) {
            conditions.push(where('loan_amount', '<=', maxLoanNumber));
        }
      }
  
      if (conditions.length === 0) {
        console.log('No search criteria provided');
        return [];
      }
      // Start with the collection reference and apply each condition
      const combinedQuery = query(queryRef, ...conditions);
      console.log(conditions);
      const querySnapshot = await getDocs(combinedQuery);
  
      if (!querySnapshot.empty) {
        const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`Found ${documents.length} documents`, documents);
        return documents;
      } else {
        console.log('No documents found.');
        return [];
      }
    } catch (error) {
      console.error('Error performing the search:', error);
      return [];
    }
  }

  function cleanAndSplit(input) {
    // Convert the string to lowercase
    const lowerCaseStr = input.toLowerCase();
  
    // Split the string into words
    const words = lowerCaseStr.split(/\s+/); // Split on whitespace
  
    // Remove punctuation from each word and replace "&" with an empty string
    const cleanedWords = words.map((word) => {
      // Remove punctuation by replacing non-alphanumeric characters with an empty string
      const cleanedWord = word.replace(/[^\w\s]/g, "");
      
      // If the word is "&", set it to an empty string
      return cleanedWord === "&" ? "" : cleanedWord;
    });
  
    return cleanedWords;
  }
  
  // Example usage
  const inputString = "Hello, world! This is a test & check if it's working.";
  const result = cleanAndSplit(inputString);
  
  console.log(result); // ["hello", "world", "this", "is", "a", "test", "", "check", "if", "its", "working"]

  async function findBusinessByName(businessName, state) {
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
        // To DO
        // COMMMAS 
        // Coleman & Associates 
        // "coleman" "" "associates"
        // Prado, renteria, peis
        // "prado" "reenteria" "peis"


        const words = cleanAndSplit(businessName);
        console.log(words.length);
        let currentQuery = pppCollection;
        let lastSuccessfulDocs = []; 
        currentQuery = query(currentQuery, where("state", "==", state));

        for (let i = 0; i < words.length; i++) {
            // Add each word condition to the existing query
            currentQuery = query(currentQuery, where(`business_name_word_${i}`, '==', words[i]));

            // Execute the query
            const querySnapshot = await getDocs(currentQuery);

            // Check the results of the query
            if (!querySnapshot.empty) {
                // Update last successful query and results
                lastSuccessfulDocs = [];
                querySnapshot.forEach(doc => lastSuccessfulDocs.push({ id: doc.id, ...doc.data() }));
            } else {
                // If no documents are found with the additional word, break the loop
                break;
            }
        }

        // Return the last successful results if the final query found no results
        if (lastSuccessfulDocs.length > 10) {
            console.log("Found a lot of matches to one of the key words - not specific enough");
            return [0];
        } else if (lastSuccessfulDocs.length > 0) {
            console.log("matches foo");
            return lastSuccessfulDocs; // or handle the case as needed
        } else {
          console.log("no matches foo");
            return []; // or handle the case as needed
        }
    } catch (error) {
        console.error("Error searching for business:", error);
    }
  
    return results.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
export {db, queryDocumentsByFlexibleCriteria, findBusinessByName};