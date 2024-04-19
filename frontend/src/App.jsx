import React, { useState, useRef, useEffect } from 'react';
import { readExcel } from './utils/ReadExcel';
//import openConnectionWindow from './utils/OpenConnectWindow';
//import parseConnectionsCSV from './utils/ParseConnections';
//import { addConnectionToDatabase } from './utils/addConnectionDatabase';
//import openAllConnectionWindow from './utils/ManageConnectionsWindow';
import {queryDocumentsByField, queryDocumentsByZipAndNaicsRange, queryDocumentsByFlexibleCriteria} from './utils/firebaseSet';






function App() {
  const [companies, setCompanies] = useState([]);
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [resultsSearchPPP, setResultsSearchPPP] = useState([]);
  const [messageSearchPPP, setMessageSearchPPP] = useState('');
  const [zipCodeSearch, setZipCodeSearch] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState({});
  const [naicsCode, setNaicsCode] = useState('');
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
        setResultsSearchPPP(documents);
      } else {
        console.log('No documents found.');
        setMessageSearchPPP('No results found.');  // Set message for no results
        setResultsSearchPPP([]);
      }
    } catch (error) {
      console.error('Error performing the search:', error);
      setMessageSearchPPP('Failed to perform search.');  // Set message for error
      setResultsSearchPPP([]);
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

  /*const handleZipCodeSearchSubmit = async () => {
    // Convert zipCodeSearch to a number if it's not empty and is a valid number
    const zipCode = zipCodeSearch.trim() ? Number(zipCodeSearch.trim()) : null;
    if (!zipCode) {
      setMessageSearchPPP('Please enter a valid zip code.');
      setResultsSearchPPP([]);
      return;
    }
    try {
      const documents = await queryDocumentsByField('zip', zipCode); // Assuming the field is 'zip'
      if (documents.length > 0) {
        setMessageSearchPPP('');
        setResultsSearchPPP(documents);
      } else {
        setMessageSearchPPP('No results found for the given zip code.'); 
        setResultsSearchPPP([]);
      }
    } catch (error) {
      console.error('Error performing the zip code search:', error);
      setMessageSearchPPP('Failed to perform zip code search.'); 
      setResultsSearchPPP([]);
    }
  };*/

  const sortCompaniesByLoanAmount = () => {
    const sortedCompanies = [...companies].sort((a, b) => {
      const loanA = additionalInfo[a.Name]?.loanAmount === 'N/A' ? -1 : parseInt(additionalInfo[a.Name]?.loanAmount);
      const loanB = additionalInfo[b.Name]?.loanAmount === 'N/A' ? -1 : parseInt(additionalInfo[b.Name]?.loanAmount);
      return loanB - loanA; // For descending order
    });
    setCompanies(sortedCompanies);
  };

  const handleZipCodeChange = (event) => {
    setZipCodeSearch(event.target.value);
  };

  const handleNaicsCodeChange = (event) => {
    setNaicsCode(event.target.value);
  };
  

  /*const handleCombinedSearchSubmit = async () => {
    event.preventDefault();
    const zipCodeNumber = Number(zipCodeSearch.trim());
    const naicsNumber = naicsCode.trim();
    if (isNaN(zipCodeNumber) || naicsNumber == "") {
      setMessageSearchPPP('Please enter valid numerical values for zip code and NAICS code range.');
      setResultsSearchPPP([]);
      return;
    }

    try {
      const documents = await queryDocumentsByZipAndNaicsRange('zip', zipCodeNumber, 'naics_code', naicsNumber);
      if (documents.length > 0) { 
        setMessageSearchPPP('');
        setResultsSearchPPP(documents);
      } else {
        setMessageSearchPPP('No results found for the given zip code.'); 
        setResultsSearchPPP([]);
      }
      // ... handle results
    } catch (error) {
      // ... handle errors
      console.error('Error performing the zipnaics code search:', error);
      setMessageSearchPPP('Failed to perform zipnaics code search.'); 
      setResultsSearchPPP([]);
    }
  };*/
  const handleCombinedSearchSubmit = async (event) => {
    event.preventDefault();
    console.log(naicsCode, zipCodeSearch, searchTerm);
    if (zipCodeSearch == "" && isNaN(naicsCode) == "" && searchTerm == "") {
        setMessageSearchPPP('Input Something or else it explodes'); 
        setResultsSearchPPP([]);
        return
    }
  
    try {
      const documents = await queryDocumentsByFlexibleCriteria(
        searchTerm, 
        zipCodeSearch, 
        naicsCode
      );
  
      if (documents.length > 0) { 
        setMessageSearchPPP('');
        setResultsSearchPPP(documents);
      } else {
        setMessageSearchPPP('No results found.'); 
        setResultsSearchPPP([]);
      }
    } catch (error) {
      console.error('Error performing the search:', error);
      setMessageSearchPPP('Failed to perform search.'); 
      setResultsSearchPPP([]);
    }
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
        {companies.length > 0 && (
        <button onClick={sortCompaniesByLoanAmount}>Sort by Loan Amount</button>
        )}
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
      {/*<div>
        <input
          type="text"
          value={zipCodeSearch}
          onChange={handleZipCodeChange}
          placeholder="Enter zip code"
        />
        <button onClick={handleZipCodeSearchSubmit}>Search by Zip Code</button>
        {messageSearchPPP && <p>{messageSearchPPP}</p>}
        {resultsSearchPPP.map(doc => (
          <div key={doc.id}>
            <p>Name: {doc.business_name || 'N/A'}, Lender: {doc.lender || 'N/A'}, Amount: {doc.loan_amount || 'N/A'}, NAICS Code: {doc.naics_code || "N/A"}</p>
            {/* Render other document fields as needed 
          </div>
        ))}
      </div> 
      */}
      {/*<form onSubmit={handleSearchSubmit}>
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
          {/* Render other document fields as needed 
        </div>
      ))}
    </div>
    <form onSubmit={handleCombinedSearchSubmit}>
        <input type="text" value={zipCodeSearch} onChange={handleZipCodeChange} placeholder="Zip Code" />
        <input type="text" value={naicsCode} onChange={handleNaicsCodeChange} placeholder="NAICS Code" />
        <button type="submit">Search</button>
      </form>
      {messageSearchPPP && <p>{messageSearchPPP}</p>}
      {resultsSearchPPP.map(doc => (
        <div key={doc.id}>
          <p>Name: {doc.business_name}, Zip: {doc.zip}, NAICS: {doc.naics_code}, Amount: {doc.loan_amount}</p>
        </div>
      ))}
    */}
    <form onSubmit={handleCombinedSearchSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchInputChange}
        placeholder="Enter business name"
      />
      <input
        type="text"
        value={zipCodeSearch}
        onChange={handleZipCodeChange}
        placeholder="Zip Code"
      />
      <input
        type="text"
        value={naicsCode}
        onChange={handleNaicsCodeChange}
        placeholder="NAICS Code"
      />
      <button type="submit">Search</button>
    </form>
    {messageSearchPPP && <p>{messageSearchPPP}</p>}
      <div>
        {resultsSearchPPP.map(doc => (
          <div key={doc.id}>
            <p>Name: {doc.business_name || 'N/A'}, Zip: {doc.zip || 'N/A'}, NAICS: {doc.naics_code || 'N/A'}, Amount: {doc.loan_amount || 'N/A'}, Lender: {doc.lender || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


export default App;
