import React, { useState, useRef, useEffect } from 'react';
import { readExcel } from './utils/ReadExcel';
//import openConnectionWindow from './utils/OpenConnectWindow';
//import parseConnectionsCSV from './utils/ParseConnections';
//import { addConnectionToDatabase } from './utils/addConnectionDatabase';
//import openAllConnectionWindow from './utils/ManageConnectionsWindow';
import {queryDocumentsByField} from './utils/firebaseSet';






function App() {
  const [companies, setCompanies] = useState([]);
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [resultsSearchPPP, setResultsSearchPP] = useState([]);
  const [messageSearchPPP, setMessageSearchPPP] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState({});
  //const connectionsFileInputRef = useRef(null);
  //const [isCSVFileParsed, setIsCSVFileParsed] = useState(false);
  //const [allConnections, setAllConnections] = useState([]);
  //const [connections, setConnections] = useState([]);



  useEffect(() => {
    
  }, []);

  /*const fetchPppCount = async () => {
    const querySnapshot = await getDocs(collection(db, 'ppp'));
    setPppCount(querySnapshot.size); // Set the count in state
  }; */

  /*const fetchConnections = async () => {
    const response = await fetch("http://127.0.0.1:5000/connections");
    const data = await response.json();
    setAllConnections(data.connections);
  };*/

  // Function to handle the search input change
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    if (searchTerm.trim() === '') {
      console.log('Please enter a search term.');
      return;
    }
    try {
      const documents = await queryDocumentsByField('business_name', searchTerm);
      if (documents.length > 0) {
        console.log('Documents found:', documents);
        setMessageSearchPPP('');
        setResultsSearchPP(documents);
      } else {
        console.log('No documents found.');
        setMessageSearchPPP('No results found.');  // Set message for no results
        setResultsSearchPP([]);
      }
    } catch (error) {
      console.error('Error performing the search:', error);
      setMessageSearchPPP('Failed to perform search.');  // Set message for error
      setResultsSearchPP([]);
    }
  };


  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    readExcel(file,
      (companiesData) => {
        setCompanies(companiesData);
        fetchAdditionalInfo(companiesData);
      },
      (error) => {
        console.error("Error reading the Excel file: ", error);
      }
    );
  };

  const fetchAdditionalInfo = async (companiesData) => {
    const info = {};
    for (const company of companiesData) {
      const documents = await queryDocumentsByField('business_name', company.Name);
      if (documents.length > 0) {
        const firstDoc = documents[0];
        info[company.Name] = {
          loanAmount: firstDoc.loan_amount || 'N/A',
          naicsCode: firstDoc.naics_code || 'N/A',
          lender: firstDoc.lender || 'N/A'
        };
      } else {
        info[company.Name] = {
          loanAmount: 'N/A',
          naicsCode: 'N/A',
          lender: 'N/A'
        };
      }
    }
    setAdditionalInfo(info);
  };

 /* const handleConnectionsFileChange = (e) => {
    const file = e.target.files[0];
    const ocaConnect = prompt("Please enter who at OCA these connections belong to");
    if (ocaConnect && file) {
      parseConnectionsCSV(file, ocaConnect, 
        (parsedConnections) => {
          // Update state with the parsed connections
          setConnections(parsedConnections);
          setIsCSVFileParsed(true)
 
        }, 
        (error) => {
          // Handle any errors during parsing
          console.log(error);
        }
      );
    } else {
      // Handle the case where the user did not input their ocaConnect
      console.log("ocaConnect is required to parse the CSV.");
    }
  };

  const addManyConnections = () => {
    // Iterate over the connections array and make a POST request for each connection
    connections.forEach(connection => {
      // Assuming addConnectionToDatabase is a function that makes a POST request to your API
      addConnectionToDatabase(connection);
    }); 

    // Optionally, reset state after adding connections
    setConnections([]);
    setIsCSVFileParsed(false);
  };*/



  return (
      <div className="App">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept='.xlsx'
        /> 
        <button onClick={() => fileInputRef.current.click()}>Upload Inven.ai Excel File + </button>
        <div>
        {companies.map((company, index) => (
          <div key={index}>
            <p>
            Name: {company.Name || 'N/A'}, 
              Website: {company.Website || 'N/A'},  
              Contact: {company["Contact Full Name 1"] || 'N/A'}, 
              Loan Amount: {additionalInfo[company.Name] ? additionalInfo[company.Name].loanAmount : 'Fetching...'}, 
              NAICS Code: {additionalInfo[company.Name] ? additionalInfo[company.Name].naicsCode : 'Fetching...'}, 
              Lender: {additionalInfo[company.Name] ? additionalInfo[company.Name].lender : 'Fetching...'}
              {/*<button onClick={() => openConnectionWindow(company)}>Connections</button> */}
            </p>
          </div>
        ))}
      </div>
      <div>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchInputChange}
          placeholder="Enter business name"
        />
        <button type="submit">Search</button>
      </form>
      {messageSearchPPP && <p>{messageSearchPPP}</p>}
      {resultsSearchPPP.map(doc => (
        <div key={doc.id}>
          <p>Name: {doc.business_name || 'N/A'}, lender: {doc.lender || 'N/A'}, Amount: {doc.loan_amount|| 'N/A'}, NAICS_CODE: {doc.naics_code || "N/A"}</p>
          {/* Render other document fields as needed */}
        </div>
      ))}
    </div>

    </div>
  );
}


export default App;
