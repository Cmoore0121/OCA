import datetime
from flask import request, jsonify
from config import app, db
from models import Contact, Connection, PPPLoan


@app.route("/contacts", methods=["GET"])
def get_contacts():
    #how we want to handle get request to contacts
    contacts = Contact.query.all()
    #these contacs are in python - need to convert them to json
    json_contacts = list(map(lambda x : x.to_json(), contacts))
    return jsonify({"contacts": json_contacts})

@app.route("/create_contact", methods=["POST"])
def create_contact():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")

    if not first_name or not last_name or not email:
        return (jsonify({"message": "Include first name , last name email"}), 400,)
    new_contact = Contact(first_name=first_name, last_name=last_name, email=email)
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    return jsonify({"message": "User created"}), 201

@app.route("/update_contact/<int:user_id>", methods=["PATCH"])
#"/update_contact/9"
def update_contact(user_id):
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "User not found"}), 404
    
    data = request.json
    contact.first_name = data.get("firstName", contact.first_name)
    contact.last_name = data.get("lastName", contact.last_name)
    contact.email = data.get("email", contact.email)

    db.session.commit()
    return jsonify({"message": "User updated"}), 201

@app.route("/delete_contact/<int:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "User not found"}), 404
    db.session.delete(contact)
    db.session.commit()


@app.route("/connections", methods=["GET"])
def get_connections():
    connections = Connection.query.all()
    json_connections = [connection.to_json() for connection in connections]
    return jsonify({"connections": json_connections})

@app.route("/create_connection", methods=["POST"])
def create_connection():
    data = request.json
    new_connection = Connection(
        first_name=data.get("firstName"),
        last_name=data.get("lastName"),
        linked_in_url=data.get("linkedInUrl"),
        email=data.get("email"),
        company=data.get("company"),
        position=data.get("position"),
        oca_connect=data.get("ocaConnect")
    )
    try:
        db.session.add(new_connection)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400
    return jsonify({"message": "Connection created"}), 201

@app.route("/update_connection/<int:id>", methods=["PATCH"])
def update_connection(id):
    connection = Connection.query.get(id)
    if not connection:
        return jsonify({"message": "Connection not found"}), 404

    data = request.json
    connection.first_name = data.get("firstName", connection.first_name)
    connection.last_name = data.get("lastName", connection.last_name)
    connection.linked_in_url = data.get("linkedInUrl", connection.linked_in_url)
    connection.company = data.get("company", connection.company)
    connection.position = data.get("position", connection.position)
    connection.oca_connect = data.get("ocaConnect", connection.oca_connect)

    try:
        db.session.commit()
        return jsonify({"message": "Connection updated", "connection": connection.to_json()}), 200
    except Exception as e:
        db.session.rollback()  # Rollback the transaction to keep the data consistent
        return jsonify({"message": "Error updating connection", "error": str(e)}), 400

@app.route("/delete_connection/<int:id>", methods=["DELETE"])
def delete_connection(id):
    connection = Connection.query.get(id)
    if not connection:
        return jsonify({"message": "Connection not found"}), 404
    db.session.delete(connection)
    db.session.commit()
    return jsonify({"message": "Connection deleted"}), 200


@app.route("/create_ppp_loan", methods=["POST"])
def create_ppp_loan():
    data = request.json


    new_loan = PPPLoan(
        loan_amount=data.get("loanAmount"),
        business_name=data.get("businessName"),
        address=data.get("address"),
        city=data.get("city"),
        state=data.get("state"),
        zip=data.get("zip"),
        naics_code=data.get("naicsCode"),
        business_type=data.get("businessType"),
        race_ethnicity=data.get("raceEthnicity"),
        gender=data.get("gender"),
        date_approved=data.get("date_approved"),
        lender=data.get("lender"),
        cd=data.get("cd"),
        year_approved=data.get("yearApproved"),
        address_clean=data.get("addressClean"),
        state_clean=data.get("stateClean"),
        city_clean=data.get("cityClean")
    )

    try:
        db.session.add(new_loan)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400
    return jsonify({"message": "PPP Loan created successfully"}), 201

    
if __name__ == "__main__":
    print("Running OCA Backend")
    with app.app_context():
        # spin up db if it doesnt exist
        db.create_all()
    app.run(debug=True)
#main routes and endpoints
#operations within our app

#localhost:5000/create_contact -- endpoint ex

#create
# - first name, last name, email
#Request - GET, POST, PUT/PATCH, DELETE

"""
Request
type: GET
json: {

}
"""
"""
Response
status: 404 or 400 etc
json {

}
"""