from flask import request, jsonify
from config import app, db
from models import Contact


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
    
if __name__ == "__main__":
    print("Hello")
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