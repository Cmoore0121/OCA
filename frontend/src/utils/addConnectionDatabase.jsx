export const addConnectionToDatabase = async (connection) => {
    const { firstName, lastName, linkedInUrl, email, company, position, ocaConnect } = connection;
    const data = {
        firstName,
        lastName,
        linkedInUrl,
        email,
        company,
        position,
        ocaConnect
    };
    const url = "http://127.0.0.1:5000/create_connection";
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    const response = await fetch(url, options)
    if (response.status !== 201 && response.status !== 200) {
        const data = await response.json()
        alert(data.message)
    }
};
