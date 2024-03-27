export const openConnectionWindow = (company) => {
    const newWindow = window.open('', '_blank', 'width=400,height=300,left=200,top=200');
    newWindow.document.title = `${company.Name}'s Connections`;
    newWindow.document.body.innerHTML = `
      <h1>${company.Name}'s Connections</h1>
      <p>Website: ${company.Website || 'N/A'}</p>
      <p>Contact: ${company["Contact Full Name 1"] || 'N/A'}</p>
      <button onclick="window.close()">Close</button>
    `;
  };

  export default openConnectionWindow