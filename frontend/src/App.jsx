import React, { useState, useRef, useEffect } from 'react';
import { readExcel } from './utils/ReadExcel';
import openConnectionWindow from './utils/OpenConnectWindow';
import parseConnectionsCSV from './utils/ParseConnections';
import { addConnectionToDatabase } from './utils/addConnectionDatabase';
import openAllConnectionWindow from './utils/ManageConnectionsWindow';



function App() {
  const [companies, setCompanies] = useState([]);
  const [connections, setConnections] = useState([]);
  const fileInputRef = useRef(null);
  const connectionsFileInputRef = useRef(null);
  const [isCSVFileParsed, setIsCSVFileParsed] = useState(false);
  const [allConnections, setAllConnections] = useState([]);


  // Fetch connections from the backend
  useEffect(() => {
    fetchConnections()
  }, []);

  const fetchConnections = async () => {
    const response = await fetch("http://127.0.0.1:5000/connections");
    const data = await response.json();
    setAllConnections(data.connections);
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    readExcel(file, setCompanies, (error) => console.log(error));
  };

  const handleConnectionsFileChange = (e) => {
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
  };



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
      <input
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
    </div>
  );
}

export default App;

/*function App() {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentContact, setCurrentContact] = useState({})

  useEffect(() => {
    fetchContacts()
  }, []);

  const fetchContacts = async () => {
    const response = await fetch("http://127.0.0.1:5000/contacts");
    const data = await response.json();
    setContacts(data.contacts);
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentContact({})
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (contact) => {
    if (isModalOpen) return
    setCurrentContact(contact)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchContacts()
  }

  return (
    <>
      <ContactList contacts={contacts} updateContact={openEditModal} updateCallback={onUpdate} />
      <button onClick={openCreateModal}>Create New Contact</button>
      {isModalOpen && <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <ContactForm existingContact={currentContact} updateCallback={onUpdate} />
        </div>
      </div>
      }
    </>
  );*/
  
