from flask import Flask, Blueprint, jsonify, request
from bson import ObjectId
from src.models.payments_users import PaymentsUsersSchema
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

application = Flask(__name__)

payments_users_route = Blueprint('payments', __name__)

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
if client:
    print('Db connected')


db = client['gaia']
payment_users_collection = db['payment_users']

# Instantiate the schema
payments_users_schema = PaymentsUsersSchema()

@payments_users_route.route('/', methods=['POST'])
def create_payment_user():
    try:
        # Get JSON data from the request
        data = request.get_json()

        # Validate and deserialize the data
        payment_user = payments_users_schema.load(data)

        # Generate a unique ID for the payment user and add it to the document
        payment_user['_id'] = str(ObjectId())

        # Insert the payment user into the collection
        payment_users_collection.insert_one(payment_user)

        # Return the inserted user's ID along with the rest of the document
        return jsonify({'message': 'Payment user created', 'user': payment_user})

    except Exception as e:
        return jsonify({'error': str(e)})

@payments_users_route.route('/', methods=['GET'])
def get_payment_users():
    try:
        # Retrieve all payment users from the collection
        payment_users = list(payment_users_collection.find())

        # Serialize the data
        payment_users_data = payments_users_schema.dump(payment_users, many=True)

        return jsonify({'message': 'Payment users retrieved', 'payment_users': payment_users_data})

    except Exception as e:
        return jsonify({'error': str(e)})