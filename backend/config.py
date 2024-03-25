#api in flask
# allows us to send request to backend from different URl
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
# disables error so we can send cross server requests
CORS(app)
#storing file that is SQlite dayabse to interact with in flask
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# Create db instance so we can create, modify, delete, - we can modify db with normal python code
db = SQLAlchemy(app)
