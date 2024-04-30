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
    
class PPPLoan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    loan_amount = db.Column(db.Float, nullable=False)
    business_name = db.Column(db.String(180), nullable=False)
    address = db.Column(db.String(180), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    zip = db.Column(db.Integer, nullable=False)
    naics_code = db.Column(db.Integer, nullable=True)
    business_type = db.Column(db.String(100), nullable=False)
    race_ethnicity = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(50), nullable=False)
    date_approved = db.Column(db.String(50), nullable=False)
    lender = db.Column(db.String(180), nullable=False)
    cd = db.Column(db.String(10), nullable=False)
    year_approved = db.Column(db.Integer, nullable=False)
    address_clean = db.Column(db.String(180), nullable=False)
    state_clean = db.Column(db.String(2), nullable=False)
    city_clean = db.Column(db.String(100), nullable=False)

    # Convert to JSON, adhering to camelCase for the keys
    def to_json(self):
        return {
            "id": self.id,
            "loanAmount": self.loan_amount,
            "businessName": self.business_name,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "zip": self.zip,
            "naicsCode": self.naics_code,
            "businessType": self.business_type,
            "raceEthnicity": self.race_ethnicity,
            "gender": self.gender,
            "dateApproved": self.date_approved.isoformat(),
            "lender": self.lender,
            "cd": self.cd,
            "yearApproved": self.year_approved,
            "addressClean": self.address_clean,
            "stateClean": self.state_clean,
            "cityClean": self.city_clean
        }