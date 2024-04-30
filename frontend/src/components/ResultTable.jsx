// components/ResultTable.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import {Modal, LinkedInButton} from './Modal';

const ResultTable = ({ results }) => {
    // Initialize state to track favorites
    const [favorites, setFavorites] = useState(new Array(results.length).fill(false));
    


    const toggleFavorite = (index) => {
        const newFavorites = [...favorites];
        newFavorites[index] = !newFavorites[index];
        setFavorites(newFavorites);
    };

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Favorite</th>
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
                {results.map((doc, index) => (
                    <tr key={index}>
                         <td>
                          <span className='icon-border'>
                            <FontAwesomeIcon 
                                icon={favorites[index] ? fasStar : farStar} 
                                onClick={() => toggleFavorite(index)} 
                                size='lg'
                                style={{ color: favorites[index] ? 'green' : 'gray', cursor: 'pointer' }}
                            />
                            </span>
                        </td>
                        <td>{doc.business_name ? doc.business_name.toUpperCase() : 'N/A'}</td>
                        <td>{doc.state}</td>
                        <td>{doc.zip}</td>
                        <td>{doc.naics_code}</td>
                        <td>${doc.loan_amount.toLocaleString()}</td>
                        <td>{doc.lender}</td>
                        <td>{doc.date_approved}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};




const StateDropdown = ( { state, handler }) => (
    <select className='select grey-select' name="state" value={state} onChange={handler}>
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
)


const StateToDistrict = ({ state, selectedDistrict, handleDistrictChange, districts }) => (
    state && (
        <select className='select grey-select' name="district" value={selectedDistrict} onChange={handleDistrictChange}>
            <option value="">Congressional District</option>
            {districts.map(district => (
                <option key={district} value={district}>{district}</option>
            ))}
        </select>
    )
);



const ResultInven = ({ companies, additionalInfo, favorites, toggleFavorite }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);




  const openModal = (company) => {
      setCurrentCompany(company);
      setIsModalOpen(true);
  };

  return (
      <>
          <table className="table">
              <thead>
                  <tr>
                      <th>Favorite</th>
                      <th>Name</th>
                      <th>Website</th>
                      <th>Region</th>
                      <th>Industry</th>
                      <th>PPP Company Found</th>
                      <th>Loan Amount</th>
                      <th>NAICS Code</th>
                      <th>Lender</th>
                      <th>More Information</th>
                  </tr>
              </thead>
              <tbody>
                  {companies.map((company, index) => (
                      <tr key={index}>
                          <td>
                                  <FontAwesomeIcon 
                                    icon={favorites.includes(company) ? fasStar : farStar} 
                                    onClick={() => toggleFavorite(company)} 
                                    size='lg'
                                    style={{ color: favorites.includes(company) ? 'green' : 'gray', cursor: 'pointer' }}
                                  />
                          </td>
                      <td className="table-cell">{company.Name || 'N/A'}</td>
                      <td className="table-cell">{<LinkedInButton url={"https://" + company.Website} text={company.Website} />}</td>
                      <td className="table-cell">{company.Region || 'N/A'}</td>
                      <td className="table-cell">{company.Industry || 'N/A'}</td>
                      {/*<td className="table-cell scrollable-cell"> {company.Description || 'N/A'}</td>*/}
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
                          {/* Additional cells for dynamic information */}
                          <td>
                              <button className= "button green-button" onClick={() => openModal(company)}>Click Here</button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
          {currentCompany && (
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                  <h3>{currentCompany.Name}</h3>
                  <p><span style={{ fontSize: "larger" }} > Description</span> </p>
                  <p><span style={{ fontSize: "larger" }} >{currentCompany.Description}</span></p>
                <table className="table">
                <thead>
                    <tr>
                      <th>Employee Count (LinkedIn)</th>
                      <th>Ownership Type</th>
                      <th>Linked In Page</th>

                    </tr>
                </thead>
                    <tbody>
                        <td className="table-cell">{currentCompany["Employees Count (LinkedIn)"]}</td>
                        <td className="table-cell">{currentCompany["Ownership Type"]}</td>
                        <td><LinkedInButton url={currentCompany["Linkedin Url"]} text={"Go to LinkedInPage"}/></td>
                        {/* Include more fields as necessary */}
                    </tbody>
                </table>
                <div>
                    <p>
                    <span style={{ fontSize: "larger" }}>
                        Contact: {currentCompany["Contact Full Name 1"] ? currentCompany["Contact Full Name 1"] + '\t' : "N/A"}
                    </span>                 
                        <LinkedInButton url={currentCompany["Contact LinkedIn 1"]} text={"See LinkedIn Profile"} />
                    </p>
                    <p>Primary Email Addr: {currentCompany["Primary E-mail address 1"] ? currentCompany["Primary E-mail address 1"] + '\t' : "N/A"}</p>
                </div>
                </Modal>
          )}
      </>
  );
};
export  {ResultTable, StateDropdown, StateToDistrict, ResultInven};
