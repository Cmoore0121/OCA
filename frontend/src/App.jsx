import React, { useState, useRef, useEffect } from 'react';
import { readExcel, exportToCsv } from './utils/ReadExcel';
//import openConnectionWindow from './utils/OpenConnectWindow';
//import parseConnectionsCSV from './utils/ParseConnections';
//import { addConnectionToDatabase } from './utils/addConnectionDatabase';
//import openAllConnectionWindow from './utils/ManageConnectionsWindow';
import {findBusinessByName, queryDocumentsByFlexibleCriteria} from './utils/firebaseSet';
import './assets/styles.css'
import {ResultTable, StateDropdown, StateToDistrict, ResultInven} from './components/ResultTable';

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
  const [activeTab, setActiveTab] = useState('upload'); 
  const [activeSubTabFavs, setActiveSubTabFavs] = useState('seeNew'); 
  const [favoritesInven, setFavoritesInven] = useState([]);
  const [favoritesSearch, setFavoritesSearch] = useState([]);
  const [filename, setFilename] = useState('');
  const [showInput, setShowInput] = useState(false);


  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
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
      setAdditionalInfo(prevState => ({
        ...prevState,
        [company.Name]: info[company.Name]
      }));
    }
    
  };


  const sortCompaniesByLoanAmount = () => {
    const sortedCompanies = [...companies].sort((a, b) => {
      const loanA = additionalInfo[a.Name] && additionalInfo[a.Name][0] && additionalInfo[a.Name][0].loanAmount !== 'N/A'
        ? parseInt(additionalInfo[a.Name][0].loanAmount)
        : -1;
      const loanB = additionalInfo[b.Name] && additionalInfo[b.Name][0] && additionalInfo[b.Name][0].loanAmount !== 'N/A'
        ? parseInt(additionalInfo[b.Name][0].loanAmount)
        : -1;
      return loanB - loanA; 
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
    console.log(additionalInfo);
    
  };
  const handleSetBusinessSearchBack = (event) => {
    setResultsNamePPP([]);
  };

  const handleSetSearchBack = (event) => {
    setResultsSearchPPP([]);
    setNaicsEnd("");
    setNaicsStart("");
    setZipCodeSearch("");
    setMaxLoanAmount("");
    setMinLoanAmount("");
    setStateSearch("");
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

  const handleCombinedSearchSubmit = async (event) => {
    event.preventDefault();
    // Clear previous search results and any messages before starting a new search
    setResultsSearchPPP([]);
    setMessageSearchPPP('');
    if (zipCodeSearch == "" && (naicsStart == "" || naicsEnd == "")  && state == "") {
      if (maxLoanAmount != "" || maxLoanAmount != "" ){
        setMessageSearchPPP('This Search Yields Too Many Results - Please use an additional Feature'); 
      } else {
        setMessageSearchPPP('Please Input at Least 2 Search Requirements');
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

  const handleCSVDownload = (event) => {
    if (!filename.trim()) { // Check if the filename is not just empty spaces
      alert('Please enter a valid filename.');
      return;
  }
    const mergedData = companies.map(company => {
      const additional = additionalInfo[company.Name] || [];
      // Create a merged object with the desired order of fields
      const baseFields = {
          Website: company.Website,
          Name: company.Name,
          Country: company.Country,
          Region: company.Region,
          City: company.City,
      };

      const additionalFields = additional.length > 0 ? {
          LoanAmount: additional[0].loanAmount || 'N/A',
          NaicsCode: additional[0].naicsCode || 'N/A',
          Lender: additional[0].lender || 'N/A',
          DateApproved: additional[0].dateApproved || 'N/A',
      
      } : {
          LoanAmount: 'N/A',
          NaicsCode: 'N/A',
          Lender: 'N/A',
          DateApproved: 'N/A',
      };

      // Append remaining company data if there are more columns after the first 5
      const remainingFields = Object.keys(company).reduce((acc, key) => {
          // Exclude keys that are already included in the base or additional fields
          if (!['Website', 'Name', 'Country', 'Region', 'City'].includes(key)) {
              acc[key] = company[key];
          }
          return acc;
      }, {});
      const mergedObject = {...baseFields, ...additionalFields, ...remainingFields};

      return mergedObject;
  });

  // Export the merged data to CSV
  exportToCsv(mergedData, filename + ".csv");
  };

  const handleInitialClick = () => {
    setShowInput(true); // Show the input field when the button is clicked
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
      if (documents[0] == 0) {
        setMessageNamePPP('The search found a lot of companies with the first word matching your input. \n Try being more specific and ensure you have the correct spelling of the subsequenct words');
        setResultsNamePPP([]);
      } else if (documents.length > 0) {
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


  const addToFavoritesInven = (company) => {
    setFavoritesInven(prevFavorites => [...prevFavorites, company]);
  };

  const removeFromFavoritesInven = (company) => {
      setFavoritesInven(prevFavorites => prevFavorites.filter(item => item !== company));
  };
  
  const toggleFavoriteInven = (company) => {

    console.log(company);
 
    if (favoritesInven.includes(company)) {
        removeFromFavoritesInven(company);
    } else {
        addToFavoritesInven(company);
    }
  };

  const addToFavoritesSearch = (company) => {
    setFavoritesSearch(prevFavorites => [...prevFavorites, company]);
  };

  const removeFromFavoritesSearch = (company) => {
      setFavoritesSearch(prevFavorites => prevFavorites.filter(item => item !== company));
  };
  
  const toggleFavoriteSearch = (company) => {

    console.log(company);
 
    if (favoritesSearch.includes(company)) {
        removeFromFavoritesSearch(company);
    } else {
        addToFavoritesSearch(company);
    }
  };


  return (
          <div className="App">
               <header className="App-header">
            <h1>OCA Ventures</h1>  
          </header>
            <div className="tabs">
              <div className={`tab ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>Search and Upload</div>
              <div className={`tab ${activeTab === 'pppDataSearch' ? 'active' : ''}`} onClick={() => setActiveTab('pppDataSearch')}>Browse PPP Data</div>
              <div className={`tab ${activeTab === 'seeFavs' ? 'active' : ''}`} onClick={() => setActiveTab('seeFavs')}>See Favorites</div>
            </div>
            {activeTab === 'upload' && (
                <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept='.xlsx'
                      /> 
                      <button className="button green-button" onClick={() => fileInputRef.current.click()}>Upload Inven.ai Excel File + </button>
                      <p></p>
                      {companies.length > 0 && (
                      <button className='button grey-button' onClick={sortCompaniesByLoanAmount}>Sort by Loan Amount</button>
                      )}
                      {companies.length > 0 && (
                      <button className='button grey-button'  onClick={sortCompaniesByNaics}>Sort by NAICS Code</button>
                      )}
                      {companies.length > 0 && (
                      <button className='button grey-button'  onClick={handlSetInvenBack}>Reset Companies</button>
                      )}
                      {companies.length > 0 && (
                            <>
                            {!showInput ? (
                                <button className='button grey-button' onClick={handleInitialClick}>
                                    Download As CSV
                                </button>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        value={filename}
                                        onChange={(e) => setFilename(e.target.value)}
                                        placeholder="Enter file name"
                                    />
                                    <button className='button grey-button' onClick={handleCSVDownload}>
                                        Download Results as CSV
                                    </button>
                                </>
                            )}
                        </>
                      )}
                      <div>
                        {companies.length > 0 && (
                          <ResultInven companies={companies}  
                          additionalInfo={additionalInfo} 
                          addToFavorites={addToFavoritesInven} // Pass addToFavoritesInven function as prop
                          removeFromFavorites={removeFromFavoritesInven} // Pass removeFromFavoritesInven function as prop
                          favorites={favoritesInven} // Pass favoritesInven array as prop
                          toggleFavorite={toggleFavoriteInven}
                          />
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
                    <StateDropdown state={stateSearch} handler={handleStateChangeSearch} />
                    <button className='button grey-button' onClick={handleSearchSubmit}>Search</button>
                    {resultsNamePPP.length > 0 && (
                      <button className='button grey-button'  onClick={handleSetBusinessSearchBack}>Reset Companies</button>
                      )}

                    {messageNamePPP && <p>{messageNamePPP}</p>}
                        {resultsNamePPP.length > 0 && (
                          <div>
                            <h3>{resultsNamePPP.length} Results</h3>
                            <ResultTable results={resultsNamePPP}
                              favorites={favoritesSearch}
                              toggleFavorite={toggleFavoriteSearch} />
                          </div>
                        )}
                    </div>
                </div>
            )}
            {activeTab === 'pppDataSearch' && (
                <div>
                <h2>Browse PPP Data</h2>
                <p>Input Filters Below</p>
                <form onSubmit={handleCombinedSearchSubmit}>
                  <div className="form-container">
                      <div className="form-row">
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
                           <StateDropdown state={state} handler={handleStateChange} />
                           <StateToDistrict state={state} selectedDistrict={selectedDistrict} handleDistrictChange={handleDistrictChange} districts={districts}/>
                           <button className='button grey-button' type="submit">Search</button>
                      </div>
                  </div>
                 
          
                </form>
                {messageSearchPPP && <p>{messageSearchPPP}</p>}
                {resultsSearchPPP.length > 0 && (
                      <button className="button red-button" onClick={sortSearchResultsByLoanAmount}>Sort by Loan Amount - Descending</button>
                )}
                {resultsSearchPPP.length > 0 && (
                      <button className="button green-button" onClick={sortSearchResultsByLoanAmountOther}>Sort by Loan Amount - Ascending</button>
                )}
                {resultsSearchPPP.length > 0 && (
                      <button className="button red-button"onClick={sortSearchResultsByNaics}>Sort by Naics Code - Descending</button>
                )}
                {resultsSearchPPP.length > 0 && (
                      <button className="button green-button" onClick={sortSearchResultsByNaicsOther}>Sort by Naics Code - Ascending</button>
                )}
                {resultsSearchPPP.length > 0 && (
                <button className="button grey-button" onClick={handleSetSearchBack}>Reset Search</button>
                )}
                <div>
                  {resultsSearchPPP.length > 0 && (
                    <h3>{resultsSearchPPP.length} Results</h3>
                  )}
                  {resultsSearchPPP.length > 0 && (
                    <ResultTable results={resultsSearchPPP}
                        favorites={favoritesSearch}
                        toggleFavorite={toggleFavoriteSearch}
                     />
                  )}
                </div>
                </div>
            )}
            {activeTab == 'seeFavs' && (
                  <div>
                  <div className="sub-tabs">
                      <div className={`sub-tab ${activeSubTabFavs === 'seeNew' ? 'active' : ''}`} onClick={() => setActiveSubTabFavs('seeNew')}>See Inven Favorites</div>
                      <div className={`sub-tab ${activeSubTabFavs === 'seeOld' ? 'active' : ''}`} onClick={() => setActiveSubTabFavs('seeOld')}>See PPP Search Favorites</div>
                  </div>
                  
                  {activeSubTabFavs === 'seeNew' && (
                      <div>
                          <h3>Inven Favorites</h3>
                          {/* Render the component or elements specific to New Favorites */}
                          <ResultInven 
                            companies={favoritesInven}  // Assume isNew attribute to filter
                            additionalInfo={additionalInfo} 
                            favorites={favoritesInven}
                            toggleFavorite={toggleFavoriteInven}
                          />
                      </div>
                  )}
                  {activeSubTabFavs === 'seeOld' && (
                  <div>
                <h3>Search Favorites</h3>
                {/* Render the component or elements specific to Old Favorites */}
                <ResultTable 
                  results={favoritesSearch}  // Assume isNew attribute to filter
                  favorites={favoritesSearch}
                  toggleFavorite={toggleFavoriteSearch}
                />
            </div>
        )}
    </div>
            
            
            
            )}
    </div> 

  );
}


export default App;

