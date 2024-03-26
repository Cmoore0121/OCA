import { useState, useEffect, useRef } from "react";
import ContactList from "./ContactList";
import "./App.css";
import ContactForm from "./ContactForm";
import * as XLSX from 'xlsx';

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
function App() {
  const [companyNames, setCompanyNames] = useState([]);
  const fileInputRef = useRef(null);

  const readExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      const names = data.map((row) => row.Name); 
      setCompanyNames(names);
    };
    reader.onerror = (error) => console.log(error);
    reader.readAsBinaryString(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="App">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
        style={{ display: 'none' }} // Hide the input element
      />
      <button onClick={handleUploadClick}>Upload Excel File</button>
      <div>
        {companyNames.map((name, index) => (
          <p key={index}>{name}</p>
        ))}
      </div>
    </div>
  );
}


export default App;