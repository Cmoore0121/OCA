
export const parseConnectionsCSV = (file, ocaConnect, onSuccess, onError) => {
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const csvContent = event.target.result;
      // Split by new line to get an array of rows
      const allRows = csvContent.split('\n');
  
      // Determine the correct headers row index by ignoring empty rows or specific note rows
      // We're assuming here the headers are on the 4th non-empty row.
      const headersRow = allRows.find(row => row.includes("First Name"));
  
      // Now find the index of the headers row in the allRows array
      const headerRowIndex = allRows.indexOf(headersRow);
  
      // The headers array is based on the actual headers row
      const headers = headersRow.split(',').map(header => header.trim());
  
      // Assuming the first column is "First Name", we find its index
      const firstNameIndex = headers.indexOf("First Name");
      const lastNameIndex = headers.indexOf("Last Name");
      const urlIndex = headers.indexOf("URL");
      const emailIndex = headers.indexOf("Email Address");
      const companyIndex = headers.indexOf("Company");
      const positionIndex = headers.indexOf("Position");

      const connections = allRows.slice(headerRowIndex + 1).map(row => {
        const columns = row.split(',').map(column => column.trim());
        return {
          firstName: columns[firstNameIndex] || '',
          lastName: columns[lastNameIndex] || '',
          linkedInUrl: columns[urlIndex] || '',
          email: columns[emailIndex] || '',
          company: columns[companyIndex] || '',
          position: columns[positionIndex] || '',
          ocaConnect: ocaConnect // Adding the ocaConnect value
        };
      }).filter(connection => connection.firstName || connection.lastName); // Filter out any empty connections
  
      onSuccess(connections);
    };
  
    reader.onerror = () => {
      onError("Failed to read the file");
    };
  
    // Read the file content
    reader.readAsText(file);
  };
  
  export default parseConnectionsCSV