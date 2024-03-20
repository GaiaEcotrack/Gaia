from flask import Blueprint, request, jsonify
from src.models.transaction import TransactionSchema
import os
from pymongo import MongoClient
from bson import ObjectId

transaction_route = Blueprint('transaction_route', __name__)

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
if client:
    print('Db connected')

db = client['gaia']
transaction_collection = db['transaction']
wallet_collection = db['wallet']
collection = db['users']


@transaction_route.route('/', methods=['POST'])
def add_transaction():
    try:
        user_id = request.json['user_id']
        transactions_data = request.json['transactions']

        transaction_schema = TransactionSchema()
        transactions_objects = [transaction_schema.load(trans) for trans in transactions_data]
        
        user_collection = collection
        user = user_collection.find_one({'_id': ObjectId(user_id)})

        if user and 'wallet' in user:
            inserted_transactions = transaction_collection.insert_many(transactions_objects)
            
            transactions_info = [{'id': str(trans_id), **trans} for trans_id, trans in zip(inserted_transactions.inserted_ids, transactions_data)]

            user_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$push': {'wallet.transactions': {'$each': transactions_info}}}
            )
          
            return jsonify({'message': 'Transactions added successfully', 'transaction_ids': transactions_info})
        else:
            return jsonify({'message': 'User not found or wallet not initialized'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Trae todas las transacciones realizadas de todos los usuarios
@transaction_route.route('/', methods=['GET'])
def get_all_transactions():
    try:
        transactions = list(transaction_collection.find({}, {'_id': 0}))
        return jsonify({'transactions': transactions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Trae todas las transacciones de un usuario en especifico
@transaction_route.route('/user/<user_id>', methods=['GET'])
def get_transactions(user_id):
    try:
        user_collection = collection
        user = user_collection.find_one({'_id': ObjectId(user_id)})
        
        if not user or 'wallet' not in user:
            return jsonify({'message': 'User not found or wallet not initialized'}), 404
        
        transactions = user['wallet'].get('transactions', [])  # Obtener las transacciones de la billetera
        
        return jsonify({'transactions': transactions}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Trae una transaccion en especifico
@transaction_route.route('/id/<transaction_id>', methods=['GET'])
def get_transaction_by_id(transaction_id):
    try:
        transaction = transaction_collection.find_one({'_id': ObjectId(transaction_id)}, {'_id': 0})
        if transaction:
            return jsonify({'transaction': transaction})
        else:
            return jsonify({'message': 'Transaction not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500