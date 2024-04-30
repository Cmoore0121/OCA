/*import * as XLSX from 'xlsx';


export const readExcel = (file, onSuccess, onError) => {
 
  const reader = new FileReader();
  reader.onload = (e) => {
    const workbook = XLSX.read(e.target.result, { type: 'binary' });
    const worksheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[worksheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const headers = data[0];
    const rows = data.slice(1);

    const companiesData = rows.map((row) => {
      const company = headers.reduce((acc, header, index) => {
        acc[header] = row[index] || '';
        return acc;
      }, {});
      return company;
    });

    onSuccess(companiesData);
  };
  reader.onerror = onError;
  reader.readAsBinaryString(file);
}; */

import * as XLSX from 'xlsx';
import { unparse } from 'papaparse';

export const readExcel = (file, onSuccess, onError) => {
  const stateAbbreviations = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
  }; 
  const reader = new FileReader();
  reader.onload = (e) => {
    const workbook = XLSX.read(e.target.result, { type: 'binary' });
    const worksheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[worksheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const headers = data[0];
    const rows = data.slice(1);

    const companiesData = rows.map((row) => {
      const company = headers.reduce((acc, header, index) => {
        // Convert full state names to abbreviations if the header is 'Region'
        if (header === 'Region') {
          acc[header] = stateAbbreviations[row[index]] || row[index]; // Use the original if no abbreviation is found
        } else {
          acc[header] = row[index] || '';
        }
        return acc;
      }, {});
      return company;
    });

    onSuccess(companiesData);
  };
  reader.onerror = onError;
  reader.readAsBinaryString(file);
};

export default readExcel;


export const exportToCsv = (data, filename) => {
  const csvData = unparse(data);
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

