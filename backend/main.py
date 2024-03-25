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

if __name__ == "__main__":
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