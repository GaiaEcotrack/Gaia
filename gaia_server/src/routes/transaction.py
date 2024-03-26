from flask import Blueprint, request, jsonify
from src.models.transaction import TransactionSchema
import os
from pymongo import MongoClient
from bson import ObjectId
from marshmallow import ValidationError

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
        transactions_data = request.json['transactions']

        transaction_schema = TransactionSchema()
        transactions_objects = [transaction_schema.load(trans) for trans in transactions_data]
        
        sender_user_id = transactions_data[0]['sender_user_id']
        receiver_user_id = transactions_data[0]['receiver_user_id']
        
        user_collection = collection
        sender_user = user_collection.find_one({'_id': ObjectId(sender_user_id)})
        receiver_user = user_collection.find_one({'_id': ObjectId(receiver_user_id)})

        if sender_user and receiver_user and 'wallet' in sender_user and 'wallet' in receiver_user:
            inserted_transactions = transaction_collection.insert_many(transactions_objects)
            
            transaction_type = transactions_data[0].get('transaction_type')            
            sender_transactions_info = [
                {'id': str(trans_id), **trans, 'transaction_type': 
                    'Membership' if transaction_type == 'Membership' else 
                    'Withdrawal' if transaction_type == 'Withdrawal' else 'Buy'
                } 
                for trans_id, trans in zip(inserted_transactions.inserted_ids, transactions_data)
                if trans['sender_user_id'] == sender_user_id
            ]
            
            receiver_transactions_info = [
                {'id': str(trans_id), **trans, 'transaction_type': 
                    'Membership' if transaction_type == 'Membership' else 
                    'Withdrawal' if transaction_type == 'Withdrawal' else 'Sell'
                } 
                for trans_id, trans in zip(inserted_transactions.inserted_ids, transactions_data)
                if trans['receiver_user_id'] == receiver_user_id
            ]
            
            sender_wallet = sender_user['wallet']
            receiver_wallet = receiver_user['wallet']
            
            # Validate vara_balance in sender's wallet
            if 'vara_balance' not in sender_wallet or not isinstance(sender_wallet['vara_balance'], (int, float)):
                raise ValidationError('Sender wallet vara_balance is not valid.')

            # Validate vara_balance in receiver's wallet
            if 'vara_balance' not in receiver_wallet or not isinstance(receiver_wallet['vara_balance'], (int, float)):
                raise ValidationError('Receiver wallet vara_balance is not valid.')
            
            user_collection.update_one(
                {'_id': ObjectId(sender_user_id)},
                {'$inc': {'wallet.vara_balance': -transactions_data[0]['vara_amount']},
                 '$push': {'wallet.transactions': {'$each': sender_transactions_info}}}
            )
            
            user_collection.update_one(
                {'_id': ObjectId(receiver_user_id)},
                {'$inc': {'wallet.vara_balance': transactions_data[0]['vara_amount']},
                 '$push': {'wallet.transactions': {'$each': receiver_transactions_info}}}
            )
          
            return jsonify({'message': 'Transactions added successfully',
                            'sender_transactions': sender_transactions_info,
                            'receiver_transactions': receiver_transactions_info})
        else:
            return jsonify({'message': 'User not found or wallet not initialized'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ejemplo de documento JSON para realizar la transaccion

# {
#   "transactions": [
#     {
#       "sender_user_id": "<id usuario que compra>",
#       "receiver_user_id": "<id usuario que vende>",
#       "vara_amount": 200.0,
#       "transaction_type": "",  // Valores permitidos: "Membership", "Withdrawal" "P2P" (cuando es P2P el codigo asigna valores 'Buy' o 'Sell'), 
#       "status": "Completed",  // Vallores permitidos: "Pending", "Completed", "Cancelled"
#       "date": "2024-03-21T10:57:39Z"  // validar el formato de fecha en react
#     }
#   ]
# }


# Trae todas las transacciones realizadas de todos los usuarios
@transaction_route.route('/', methods=['GET'])
def get_all_transactions():
    try:
        transactions = list(transaction_collection.find())
        formatted_transactions = []
        for trans in transactions:
            trans['_id'] = str(trans['_id'])  # Convertir ObjectId a str
            formatted_transactions.append(trans)
        return jsonify({'transactions': formatted_transactions})
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