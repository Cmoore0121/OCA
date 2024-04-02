export const openAllConnectionWindow = (allConnections) => {
  const newWindow = window.open('', '_blank', 'width=400,height=300,left=200,top=200');
  newWindow.document.title = "All Connections";
  let htmlContent = `<h2>All Connections</h2><ul>`;

  // Add each connection as a list item
  allConnections.forEach(connection => {
    htmlContent += `<li>${connection.firstName} ${connection.lastName} - ${connection.company}</li>`;
  });

  // Close the list
  htmlContent += `</ul>`;

  // Optionally, add a button or link to close the window
  htmlContent += `<button onclick="window.close()">Close Window</button>`;

  // Set the generated HTML as the body's innerHTML
  newWindow.document.body.innerHTML = htmlContent;

  // You might need to add some basic styling
  newWindow.document.body.style.padding = "20px";
  newWindow.document.body.style.fontFamily = "Arial, sans-serif";
  
  // Ensure the window gets focus
  newWindow.focus();
};
export default openAllConnectionWindow
