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