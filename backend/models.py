#database modeils w SQLAlchemy
from config import db

# db model represented as python class 
class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name =db.Column(db.String(80), unique=False, nullable=False)
    last_name =db.Column(db.String(80), unique=False, nullable=False)
    email =db.Column(db.String(80), unique=True, nullable=False)

    # take everything and convert to python dict to use for JSON
    # JSON should use camel case - Python should use Snake Case
    def to_json(self):
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "email":self.email
        }

class Connection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name =db.Column(db.String(80), unique=False, nullable=False)
    last_name =db.Column(db.String(80), unique=False, nullable=False)
    linked_in_url =db.Column(db.String(180), unique=True, nullable=True)
    email =db.Column(db.String(180), unique=False, nullable=True)
    company =db.Column(db.String(100), unique=False, nullable=True)
    position =db.Column(db.String(100), unique=False, nullable=True)
    oca_connect =db.Column(db.String(100), unique=False, nullable=False)

    # take everything and convert to python dict to use for JSON
    # JSON should use camel case - Python should use Snake Case
    def to_json(self):
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "linkedInUrl":self.linked_in_url,
            "email": self.email,
            "company": self.company,
            "position": self.position,
            "ocaConnect":self.oca_connect
        }