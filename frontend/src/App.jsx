import React, { useState, useRef, useEffect } from 'react';
import { readExcel } from './utils/ReadExcel';
//import openConnectionWindow from './utils/OpenConnectWindow';
//import parseConnectionsCSV from './utils/ParseConnections';
//import { addConnectionToDatabase } from './utils/addConnectionDatabase';
//import openAllConnectionWindow from './utils/ManageConnectionsWindow';
import {queryDocumentsByField} from './utils/firebaseSet';






function App() {
  const [companies, setCompanies] = useState([]);
  const [pppCount, setPppCount] = useState(0); // State to store the count of 'ppp' documents
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
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
      setResults(documents);
      if (documents.length > 0) {
        console.log('Documents found:', documents);
      } else {
        console.log('No documents found.');
      }
    } catch (error) {
      console.error('Error performing the search:', error);
    }
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    readExcel(file, setCompanies, (error) => console.log(error));
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
              Name: {company.Name || 'N/A'}, Website: {company.Website || 'N/A'}, Contact: {company["Contact Full Name 1"] || 'N/A'}
              
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
      {/* Display search results */}
      {results.map(doc => (
        <div key={doc.id}>
          <p>{doc.business_name}</p>
          {/* Render other document fields as needed */}
        </div>
      ))}
    </div>

    </div>
  );
}


export default App;
  

  /*<div className="App">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept='.xlsx'
      /> 
      <button onClick={() => fileInputRef.current.click()}>Upload Inven.ai Excel File + </button>
      {/*<input
        type="file"
        ref={connectionsFileInputRef}
        onChange={handleConnectionsFileChange}
        style={{ display: 'none' }}
        accept=".csv"
      />
      <button onClick={() => openAllConnectionWindow(allConnections)}>Manage Connections</button>
      <button onClick={() => connectionsFileInputRef.current.click()}>Upload Connections -Entire CSV</button>
      {isCSVFileParsed && (
        <button onClick={addManyConnections}>
          Are you sure you want to add {connections.length} connections?
        </button>
      )} 
      <div>
        {companies.map((company, index) => (
          <div key={index}>
            <p>
              Name: {company.Name || 'N/A'}, Website: {company.Website || 'N/A'}, Contact: {company["Contact Full Name 1"] || 'N/A'}
              <button onClick={() => openConnectionWindow(company)}>Connections</button>
            </p>
          </div>
        ))}
      </div>
      <div>
        <p>Count of PPP records: {pppCount}</p>
      </div>
    </div>
  ); */