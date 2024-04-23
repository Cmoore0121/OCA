import React, { useState, useRef, useEffect } from 'react';
import { readExcel } from './utils/ReadExcel';
//import openConnectionWindow from './utils/OpenConnectWindow';
//import parseConnectionsCSV from './utils/ParseConnections';
//import { addConnectionToDatabase } from './utils/addConnectionDatabase';
//import openAllConnectionWindow from './utils/ManageConnectionsWindow';
import {queryDocumentsByField, findBusinessByName, queryDocumentsByFlexibleCriteria} from './utils/firebaseSet';
import './assets/styles.css'





function App() {
  const [companies, setCompanies] = useState([]);
  const fileInputRef = useRef(null);
  const [resultsSearchPPP, setResultsSearchPPP] = useState([]);
  const [messageSearchPPP, setMessageSearchPPP] = useState('');
  const [zipCodeSearch, setZipCodeSearch] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState({});
  const [naicsEnd, setNaicsEnd] = useState('');
  const [naicsStart, setNaicsStart] = useState('');
  const [state, setState] = useState('');
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [minLoanAmount, setMinLoanAmount] = useState('');
  const [maxLoanAmount, setMaxLoanAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [resultsNamePPP, setResultsNamePPP] = useState([]);
  const [messageNamePPP, setMessageNamePPP] = useState('');


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
  
  /*const handleSearchSubmit = async (event) => {
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
  };*/


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
      const adjustedName = company.Name.toLowerCase();
      const documents = await findBusinessByName(adjustedName, company.Region);
      if (documents.length > 0) {
        info[company.Name] = documents.map(doc => ({
          loanAmount: doc.loan_amount || 'N/A',
          naicsCode: doc.naics_code || 'N/A',
          lender: doc.lender || 'N/A',
          dateApproved: doc.date_approved || 'N/A',
          businessName: doc.business_name || 'N/A'  // assuming 'business_name' is the field name
        }));
      } else {
        info[company.Name] = [{
          loanAmount:  'N/A',
          naicsCode: 'N/A',
          lender: 'N/A',
          dateApproved:  'N/A',
          businessName:  'N/A'  // assuming 'business_name' is the field name
        }];
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
      // Check if the company has additional info and at least one loan entry; otherwise, use -1 as a fallback
      const loanA = additionalInfo[a.Name] && additionalInfo[a.Name][0] && additionalInfo[a.Name][0].loanAmount !== 'N/A'
        ? parseInt(additionalInfo[a.Name][0].loanAmount)
        : -1;
      const loanB = additionalInfo[b.Name] && additionalInfo[b.Name][0] && additionalInfo[b.Name][0].loanAmount !== 'N/A'
        ? parseInt(additionalInfo[b.Name][0].loanAmount)
        : -1;
  
      return loanB - loanA; // For descending order
    });
    setCompanies(sortedCompanies);
  };

  const sortCompaniesByNaics = () => {
    const sortedCompanies = [...companies].sort((a, b) => {
      // Check if the company has additional info and at least one NAICS code entry; otherwise, use -1 as a fallback
      const naicsA = additionalInfo[a.Name] && additionalInfo[a.Name][0] && additionalInfo[a.Name][0].naicsCode !== 'N/A'
        ? parseInt(additionalInfo[a.Name][0].naicsCode)
        : -1;
      const naicsB = additionalInfo[b.Name] && additionalInfo[b.Name][0] && additionalInfo[b.Name][0].naicsCode !== 'N/A'
        ? parseInt(additionalInfo[b.Name][0].naicsCode)
        : -1;
  
      return naicsB - naicsA; // For descending order by NAICS code
    });
    setCompanies(sortedCompanies);
  };

  const sortSearchResultsByLoanAmount = () => {
    const sortedResults = [...resultsSearchPPP].sort((a, b) => {
        // Convert loan amounts to integers for comparison; handle missing or non-numeric values as 0
        const loanA = parseInt(a.loan_amount) || 0;
        const loanB = parseInt(b.loan_amount) || 0;
        return loanB - loanA; // Descending order
    });
    setResultsSearchPPP(sortedResults);
};
const sortSearchResultsByNaics = () => {
  const sortedResults = [...resultsSearchPPP].sort((a, b) => {
      // Convert loan amounts to integers for comparison; handle missing or non-numeric values as 0
      const naicsA = parseInt(a.naics_code) || 0;
      const naicsB = parseInt(b.naics_code) || 0;
      return naicsB - naicsA; // Descending order
  });
  setResultsSearchPPP(sortedResults);
};

const sortSearchResultsByLoanAmountOther = () => {
  const sortedResults = [...resultsSearchPPP].sort((a, b) => {
      // Convert loan amounts to integers for comparison; handle missing or non-numeric values as 0
      const loanA = parseInt(a.loan_amount) || 0;
      const loanB = parseInt(b.loan_amount) || 0;
      return loanA - loanB; // Descending order
  });
  setResultsSearchPPP(sortedResults);
};
const sortSearchResultsByNaicsOther = () => {
const sortedResults = [...resultsSearchPPP].sort((a, b) => {
    // Convert loan amounts to integers for comparison; handle missing or non-numeric values as 0
    const naicsA = parseInt(a.naics_code) || 0;
    const naicsB = parseInt(b.naics_code) || 0;
    return naicsA - naicsB; // Descending order
});
setResultsSearchPPP(sortedResults);
};


  const handleZipCodeChange = (event) => {
    setZipCodeSearch(event.target.value);
  };

  const handleNaicsStartCodeChange = (event) => {
    setNaicsStart(event.target.value);
  };

  const handleNaicsEndCodeChange = (event) => {
    setNaicsEnd(event.target.value);
  };
  
  const handlSetInvenBack = (event) => {
    setCompanies([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSetSearchBack = (event) => {
    setResultsSearchPPP([]);
  };

  const handleStateChange = (event) => {
      const newState = event.target.value;
      setState(newState);
      fetchDistricts(newState);
  };
  const handleStateChangeSearch = (event) => {
    const stateSearchNew = event.target.value;
    setStateSearch(stateSearchNew);
};

  const handleDistrictChange = (event) => {
      setSelectedDistrict(event.target.value);
  };

  const fetchDistricts = (stateCode) => {
    // This should be replaced with actual data fetching logic
    const exampleDistrictData = {
      AL: ['AL-01', 'AL-02', 'AL-03', 'AL-04', 'AL-05', 'AL-06', 'AL-07'],
      AK: ['AK-AL'],
      AZ: ['AZ-01', 'AZ-02', 'AZ-03', 'AZ-04', 'AZ-05', 'AZ-06', 'AZ-07', 'AZ-08', 'AZ-09'],
      AR: ['AR-01', 'AR-02', 'AR-03', 'AR-04'],
      CA: ['CA-01', 'CA-02', 'CA-03', 'CA-04', 'CA-05', 'CA-06', 'CA-07', 'CA-08', 'CA-09', 'CA-10', 'CA-11', 'CA-12', 'CA-13', 'CA-14', 'CA-15', 'CA-16', 'CA-17', 'CA-18', 'CA-19', 'CA-20', 'CA-21', 'CA-22', 'CA-23', 'CA-24', 'CA-25', 'CA-26', 'CA-27', 'CA-28', 'CA-29', 'CA-30', 'CA-31', 'CA-32', 'CA-33', 'CA-34', 'CA-35', 'CA-36', 'CA-37', 'CA-38', 'CA-39', 'CA-40', 'CA-41', 'CA-42', 'CA-43', 'CA-44', 'CA-45', 'CA-46', 'CA-47', 'CA-48', 'CA-49', 'CA-50', 'CA-51', 'CA-52', 'CA-53'],
      CO: ['CO-01', 'CO-02', 'CO-03', 'CO-04', 'CO-05', 'CO-06', 'CO-07', 'CO-08'],
      CT: ['CT-01', 'CT-02', 'CT-03', 'CT-04', 'CT-05'],
      DE: ['DE-AL'],
      FL: ['FL-01', 'FL-02', 'FL-03', 'FL-04', 'FL-05', 'FL-06', 'FL-07', 'FL-08', 'FL-09', 'FL-10', 'FL-11', 'FL-12', 'FL-13', 'FL-14', 'FL-15', 'FL-16', 'FL-17', 'FL-18', 'FL-19', 'FL-20', 'FL-21', 'FL-22', 'FL-23', 'FL-24', 'FL-25', 'FL-26', 'FL-27'],
      GA: ['GA-01', 'GA-02', 'GA-03', 'GA-04', 'GA-05', 'GA-06', 'GA-07', 'GA-08', 'GA-09', 'GA-10', 'GA-11', 'GA-12', 'GA-13', 'GA-14'],
      HI: ['HI-01', 'HI-02'],
      ID: ['ID-01', 'ID-02'],
      IL: ['IL-01', 'IL-02', 'IL-03', 'IL-04', 'IL-05', 'IL-06', 'IL-07', 'IL-08', 'IL-09', 'IL-10', 'IL-11', 'IL-12', 'IL-13', 'IL-14', 'IL-15', 'IL-16', 'IL-17', 'IL-18'],
      IN: ['IN-01', 'IN-02', 'IN-03', 'IN-04', 'IN-05', 'IN-06', 'IN-07', 'IN-08', 'IN-09'],
      IA: ['IA-01', 'IA-02', 'IA-03', 'IA-04'],
      KS: ['KS-01', 'KS-02', 'KS-03', 'KS-04'],
      KY: ['KY-01', 'KY-02', 'KY-03', 'KY-04', 'KY-05', 'KY-06'],
      LA: ['LA-01', 'LA-02', 'LA-03', 'LA-04', 'LA-05', 'LA-06'],
      ME: ['ME-01', 'ME-02'],
      MD: ['MD-01', 'MD-02', 'MD-03', 'MD-04', 'MD-05', 'MD-06', 'MD-07', 'MD-08'],
      MA: ['MA-01', 'MA-02', 'MA-03', 'MA-04', 'MA-05', 'MA-06', 'MA-07', 'MA-08', 'MA-09'],
      MI: ['MI-01', 'MI-02', 'MI-03', 'MI-04', 'MI-05', 'MI-06', 'MI-07', 'MI-08', 'MI-09', 'MI-10', 'MI-11', 'MI-12', 'MI-13', 'MI-14'],
      MN: ['MN-01', 'MN-02', 'MN-03', 'MN-04', 'MN-05', 'MN-06', 'MN-07', 'MN-08'],
      MS: ['MS-01', 'MS-02', 'MS-03', 'MS-04'],
      MO: ['MO-01', 'MO-02', 'MO-03', 'MO-04', 'MO-05', 'MO-06', 'MO-07', 'MO-08'],
      MT: ['MT-AL'],
      NE: ['NE-01', 'NE-02', 'NE-03'],
      NV: ['NV-01', 'NV-02', 'NV-03', 'NV-04'],
      NH: ['NH-01', 'NH-02'],
      NJ: ['NJ-01', 'NJ-02', 'NJ-03', 'NJ-04', 'NJ-05', 'NJ-06', 'NJ-07', 'NJ-08', 'NJ-09', 'NJ-10', 'NJ-11', 'NJ-12'],
      NM: ['NM-01', 'NM-02', 'NM-03'],
      NY: ['NY-01', 'NY-02', 'NY-03', 'NY-04', 'NY-05', 'NY-06', 'NY-07', 'NY-08', 'NY-09', 'NY-10', 'NY-11', 'NY-12', 'NY-13', 'NY-14', 'NY-15', 'NY-16', 'NY-17', 'NY-18', 'NY-19', 'NY-20', 'NY-21', 'NY-22', 'NY-23', 'NY-24', 'NY-25', 'NY-26', 'NY-27'],
      NC: ['NC-01', 'NC-02', 'NC-03', 'NC-04', 'NC-05', 'NC-06', 'NC-07', 'NC-08', 'NC-09', 'NC-10', 'NC-11', 'NC-12', 'NC-13', 'NC-14'],
      ND: ['ND-AL'],
      OH: ['OH-01', 'OH-02', 'OH-03', 'OH-04', 'OH-05', 'OH-06', 'OH-07', 'OH-08', 'OH-09', 'OH-10', 'OH-11', 'OH-12', 'OH-13', 'OH-14', 'OH-15', 'OH-16'],
      OK: ['OK-01', 'OK-02', 'OK-03', 'OK-04', 'OK-05'],
      OR: ['OR-01', 'OR-02', 'OR-03', 'OR-04', 'OR-05', 'OR-06'],
      PA: ['PA-01', 'PA-02', 'PA-03', 'PA-04', 'PA-05', 'PA-06', 'PA-07', 'PA-08', 'PA-09', 'PA-10', 'PA-11', 'PA-12', 'PA-13', 'PA-14', 'PA-15', 'PA-16', 'PA-17', 'PA-18'],
      RI: ['RI-01', 'RI-02'],
      SC: ['SC-01', 'SC-02', 'SC-03', 'SC-04', 'SC-05', 'SC-06', 'SC-07'],
      SD: ['SD-AL'],
      TN: ['TN-01', 'TN-02', 'TN-03', 'TN-04', 'TN-05', 'TN-06', 'TN-07', 'TN-08', 'TN-09'],
      TX: ['TX-01', 'TX-02', 'TX-03', 'TX-04', 'TX-05', 'TX-06', 'TX-07', 'TX-08', 'TX-09', 'TX-10', 'TX-11', 'TX-12', 'TX-13', 'TX-14', 'TX-15', 'TX-16', 'TX-17', 'TX-18', 'TX-19', 'TX-20', 'TX-21', 'TX-22', 'TX-23', 'TX-24', 'TX-25', 'TX-26', 'TX-27', 'TX-28', 'TX-29', 'TX-30', 'TX-31', 'TX-32', 'TX-33', 'TX-34', 'TX-35', 'TX-36'],
      UT: ['UT-01', 'UT-02', 'UT-03', 'UT-04'],
      VT: ['VT-AL'],
      VA: ['VA-01', 'VA-02', 'VA-03', 'VA-04', 'VA-05', 'VA-06', 'VA-07', 'VA-08', 'VA-09', 'VA-10', 'VA-11'],
      WA: ['WA-01', 'WA-02', 'WA-03', 'WA-04', 'WA-05', 'WA-06', 'WA-07', 'WA-08', 'WA-09', 'WA-10'],
      WV: ['WV-01', 'WV-02', 'WV-03'],
      WI: ['WI-01', 'WI-02', 'WI-03', 'WI-04', 'WI-05', 'WI-06', 'WI-07', 'WI-08'],
      WY: ['WY-AL']
  
        // Add other states similarly
    };

    // Update the districts based on the state selected
    setDistricts(stateCode ? ['All Districts', ...exampleDistrictData[stateCode] || []] : []);
  };

  const handleMinLoanAmountChange = (event) => {
    setMinLoanAmount(event.target.value);
  };

  const handleMaxLoanAmountChange = (event) => {
    setMaxLoanAmount(event.target.value);
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
    // Clear previous search results and any messages before starting a new search
    setResultsSearchPPP([]);
    setMessageSearchPPP('');
    if (zipCodeSearch == "" && (naicsStart == "" || naicsEnd == "")  && state == "") {
      if (maxLoanAmount != "" || maxLoanAmount != "" ){
        setMessageSearchPPP('This Search Yields Too Many Results - Please use an additional Feature'); 
      } else {
        setMessageSearchPPP('Please Input at Least 1 Search Requirement');
      }
      setResultsSearchPPP([]);
      return
    }
    if (zipCodeSearch === "" && naicsStart === "" && naicsEnd === "" && state !== "" && (maxLoanAmount == "" || minLoanAmount == "")) {
        setMessageSearchPPP('This Search Yields Too Many Results - Please use an additional Feature');
        setResultsSearchPPP([]);
        return;
    }
    if ((naicsStart == "" && naicsEnd != "") || (naicsStart != "" && naicsEnd == "") ) {
      setMessageSearchPPP('Please Enter A Valid Naics Code Range'); 
      setResultsSearchPPP([]);
      return
    }
  
    try {
      const documents = await queryDocumentsByFlexibleCriteria(
        zipCodeSearch, 
        naicsStart,
        naicsEnd,
        state,
        selectedDistrict,
        minLoanAmount,
        maxLoanAmount
      );
  
      if (documents.length > 0) { 
        setMessageSearchPPP('');
        setResultsSearchPPP(documents);
      } else {
        setMessageSearchPPP('No results found for these qualifications.'); 
        setResultsSearchPPP([]);
      }
    } catch (error) {
      console.error('Error performing the search:', error);
      setMessageSearchPPP('There was an error while performing the search.'); 
      setResultsSearchPPP([]);
    }
  };

  const handleSearchSubmit = async () => {
    if (searchTerm.trim() === '' || stateSearch == "") {
      setResultsNamePPP([]);
      setMessageNamePPP('Please input a business name and the State it is in');
      return;
    }
    const lcSearch = searchTerm.toLowerCase()
    try {
      const documents = await findBusinessByName(lcSearch, stateSearch);
      if (documents.length > 0) {
        console.log('Documents found:', documents);
        setResultsNamePPP(documents);
        setMessageNamePPP('');
      } else {
        console.log('No documents found.');
        setMessageNamePPP('No results found.');
        setResultsNamePPP([]);
      }
    } catch (error) {
      console.error('Error performing the search:', error);
      setMessageNamePPP('Failed to perform search.');
      setResultsNamePPP([]);
    }
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
        {companies.length > 0 && (
        <button onClick={sortCompaniesByLoanAmount}>Sort by Loan Amount</button>
        )}
         {companies.length > 0 && (
        <button onClick={sortCompaniesByNaics}>Sort by NAICS Code</button>
        )}
         {companies.length > 0 && (
        <button onClick={handlSetInvenBack}>Reset Companies</button>
        )}
        <div>
          {companies.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th className="table-cell">Name</th>
                  <th className="table-cell">Website</th>
                  <th className="table-cell">Region</th>
                  <th className="table-cell">Company Found</th>
                  <th className="table-cell">Loan Amount</th>
                  <th className="table-cell">NAICS Code</th>
                  <th className="table-cell">Lender</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell">{company.Name || 'N/A'}</td>
                    <td className="table-cell">{company.Website || 'N/A'}</td>
                    <td className="table-cell">{company.Region || 'N/A'}</td>
                    <td className="table-cell">
                      {additionalInfo[company.Name]
                        ? additionalInfo[company.Name].length > 0
                          ? additionalInfo[company.Name].map((doc, idx) => <div key={idx} className="data-item">{doc.businessName.toUpperCase()}</div>)
                          : 'N/A'
                        : 'Fetching...'}
                    </td>
                    <td className="table-cell">
                      {additionalInfo[company.Name]
                        ? additionalInfo[company.Name].length > 0
                          ? additionalInfo[company.Name].map((doc, idx) => <div key={idx} className="data-item">${doc.loanAmount.toLocaleString()}</div>)
                          : 'N/A'
                        : 'Fetching...'}
                    </td>
                    <td className="table-cell">
                      {additionalInfo[company.Name]
                        ? additionalInfo[company.Name].length > 0
                          ? additionalInfo[company.Name].map((doc, idx) => <div key={idx} className="data-item">{doc.naicsCode}</div>)
                          : 'N/A'
                        : 'Fetching...'}
                    </td>
                    <td className="table-cell">
                      {additionalInfo[company.Name]
                        ? additionalInfo[company.Name].length > 0
                          ? additionalInfo[company.Name].map((doc, idx) => <div key={idx} className="data-item">{doc.lender}</div>)
                          : 'N/A'
                        : 'Fetching...'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>

      <h2>Search For a Business</h2>

    <div className="search-container">
  <input
    type="text"
    placeholder="Enter business name..."
    value={searchTerm}
    onChange={handleSearchInputChange}
  />
  <select name="state" value={stateSearch} onChange={handleStateChangeSearch}>
        <option value="">Select State</option>
        <option value="AL">AL</option>
        <option value="AK">AK</option>
        <option value="AZ">AZ</option>
        <option value="AR">AR</option>
        <option value="CA">CA</option>
        <option value="CO">CO</option>
        <option value="CT">CT</option>
        <option value="DE">DE</option>
        <option value="FL">FL</option>
        <option value="GA">GA</option>
        <option value="HI">HI</option>
        <option value="ID">ID</option>
        <option value="IL">IL</option>
        <option value="IN">IN</option>
        <option value="IA">IA</option>
        <option value="KS">KS</option>
        <option value="KY">KY</option>
        <option value="LA">LA</option>
        <option value="ME">ME</option>
        <option value="MD">MD</option>
        <option value="MA">MA</option>
        <option value="MI">MI</option>
        <option value="MN">MN</option>
        <option value="MS">MS</option>
        <option value="MO">MO</option>
        <option value="MT">MT</option>
        <option value="NE">NE</option>
        <option value="NV">NV</option>
        <option value="NH">NH</option>
        <option value="NJ">NJ</option>
        <option value="NM">NM</option>
        <option value="NY">NY</option>
        <option value="NC">NC</option>
        <option value="ND">ND</option>
        <option value="OH">OH</option>
        <option value="OK">OK</option>
        <option value="OR">OR</option>
        <option value="PA">PA</option>
        <option value="RI">RI</option>
        <option value="SC">SC</option>
        <option value="SD">SD</option>
        <option value="TN">TN</option>
        <option value="TX">TX</option>
        <option value="UT">UT</option>
        <option value="VT">VT</option>
        <option value="VA">VA</option>
        <option value="WA">WA</option>
        <option value="WV">WV</option>
        <option value="WI">WI</option>
        <option value="WY">WY</option>
      </select>
  <button onClick={handleSearchSubmit}>Search</button>
{messageNamePPP && <p>{messageNamePPP}</p>}
          {resultsNamePPP.length > 0 && (
            <div>
              <h2>{resultsNamePPP.length} Results</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>State</th>
                    <th>Zip Code</th>
                    <th>NAICS Code</th>
                    <th>Amount Loaned</th>
                    <th>Lender</th>
                    <th>Date Approved</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {resultsNamePPP.map((doc, index) => (
                    <tr key={doc.id || index} className="table-row">
                      <td>{doc.business_name.toUpperCase() || 'N/A'}</td>
                      <td>{doc.state || 'N/A'}</td>
                      <td>{doc.zip || 'N/A'}</td>
                      <td>{doc.naics_code || 'N/A'}</td>
                      <td>${doc.loan_amount ? doc.loan_amount.toLocaleString() : 'N/A'}</td>
                      <td>{doc.lender || 'N/A'}</td>
                      <td>{doc.date_approved || 'N/A'}</td>
          
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
<h2>Browse PPP Data</h2>
    <form onSubmit={handleCombinedSearchSubmit}>
      <input
        type="text"
        value={zipCodeSearch}
        onChange={handleZipCodeChange}
        placeholder="Zip Code"
      />
      <input
        type="text"
        value={naicsStart}
        onChange={handleNaicsStartCodeChange}
        placeholder="NAICS Code Range Start"
      />
      <input
          type="text"
          value={naicsEnd}
          onChange={handleNaicsEndCodeChange}
          placeholder="NAICS Code Range End"
      />
      <select name="state" value={state} onChange={handleStateChange}>
        <option value="">Select State</option>
        <option value="AL">AL</option>
        <option value="AK">AK</option>
        <option value="AZ">AZ</option>
        <option value="AR">AR</option>
        <option value="CA">CA</option>
        <option value="CO">CO</option>
        <option value="CT">CT</option>
        <option value="DE">DE</option>
        <option value="FL">FL</option>
        <option value="GA">GA</option>
        <option value="HI">HI</option>
        <option value="ID">ID</option>
        <option value="IL">IL</option>
        <option value="IN">IN</option>
        <option value="IA">IA</option>
        <option value="KS">KS</option>
        <option value="KY">KY</option>
        <option value="LA">LA</option>
        <option value="ME">ME</option>
        <option value="MD">MD</option>
        <option value="MA">MA</option>
        <option value="MI">MI</option>
        <option value="MN">MN</option>
        <option value="MS">MS</option>
        <option value="MO">MO</option>
        <option value="MT">MT</option>
        <option value="NE">NE</option>
        <option value="NV">NV</option>
        <option value="NH">NH</option>
        <option value="NJ">NJ</option>
        <option value="NM">NM</option>
        <option value="NY">NY</option>
        <option value="NC">NC</option>
        <option value="ND">ND</option>
        <option value="OH">OH</option>
        <option value="OK">OK</option>
        <option value="OR">OR</option>
        <option value="PA">PA</option>
        <option value="RI">RI</option>
        <option value="SC">SC</option>
        <option value="SD">SD</option>
        <option value="TN">TN</option>
        <option value="TX">TX</option>
        <option value="UT">UT</option>
        <option value="VT">VT</option>
        <option value="VA">VA</option>
        <option value="WA">WA</option>
        <option value="WV">WV</option>
        <option value="WI">WI</option>
        <option value="WY">WY</option>
      </select>
      {state && (
                <select name="district" value={selectedDistrict} onChange={handleDistrictChange}>
                    <option value="">Select Congressional District</option>
                    {districts.map(district => (
                        <option key={district} value={district}>{district}</option>
                    ))}
                </select>
            )}
      <input
        type="text"
        value={minLoanAmount}
        onChange={handleMinLoanAmountChange}
        placeholder="Minimum Loan Amount"
      />
      <input
        type="text"
        value={maxLoanAmount}
        onChange={handleMaxLoanAmountChange}
        placeholder="Maximum Loan Amount"
      />
      <button type="submit">Search</button>
    </form>
    {messageSearchPPP && <p>{messageSearchPPP}</p>}
        {resultsSearchPPP.length > 0 && (
            <button onClick={sortSearchResultsByLoanAmount}>Sort by Loan Amount - Descending</button>
        )}
         {resultsSearchPPP.length > 0 && (
            <button onClick={sortSearchResultsByLoanAmountOther}>Sort by Loan Amount - Ascending</button>
        )}
        {resultsSearchPPP.length > 0 && (
            <button onClick={sortSearchResultsByNaics}>Sort by Naics Code - Descending</button>
        )}
         {resultsSearchPPP.length > 0 && (
            <button onClick={sortSearchResultsByNaicsOther}>Sort by Naics Code - Ascending</button>
        )}
        {resultsSearchPPP.length > 0 && (
        <button onClick={handleSetSearchBack}>Reset Search</button>
        )}
        <div>
          {resultsSearchPPP.length > 0 && (
            <div>
              <h2>{resultsSearchPPP.length} Results</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>State</th>
                    <th>Zip Code</th>
                    <th>NAICS Code</th>
                    <th>Amount Loaned</th>
                    <th>Lender</th>
                    <th>Date Approved</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {resultsSearchPPP.map((doc, index) => (
                    <tr key={doc.id || index} className="table-row">
                      <td>{doc.business_name.toUpperCase() || 'N/A'}</td>
                      <td>{doc.state || 'N/A'}</td>
                      <td>{doc.zip || 'N/A'}</td>
                      <td>{doc.naics_code || 'N/A'}</td>
                      <td>${doc.loan_amount ? doc.loan_amount.toLocaleString() : 'N/A'}</td>
                      <td>{doc.lender || 'N/A'}</td>
                      <td>{doc.date_approved || 'N/A'}</td>
          
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
    </div>
  );
}


export default App;
