from flask import Flask, Blueprint, jsonify, request
from src.models.paypal import PayPalTransactionSchema
from pymongo import MongoClient
import os

application = Flask(__name__)
paypal_route = Blueprint('paypal', __name__)

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
if client:
    print('Db connected')

db = client['gaia']
transactions_collection = db['transactions']


@paypal_route.route('/transaction', methods=['POST'])
def save_paypal_transaction():
    data = request.json
    print('Datos de transacción recibidos:', data)

    # Verificar si 'payer' está presente en los datos
    if 'payerId' not in data or 'orderId' not in data or 'paymentId' not in data or 'totalValue' not in data or 'invoice' not in data:
        return jsonify({'error': 'Datos de transacción de PayPal incompletos'}), 400

    # Extraer los datos relevantes de la transacción
    orderId = data.get('orderId')
    payerId = data.get('payerId')
    paymentId = data.get('paymentId')
    totalValue = data.get('totalValue')
    invoice = data.get('invoice')

    # Guardar los datos en la colección de transacciones
    transaction_data = {
        'orderId': orderId,
        'payerId': payerId,
        'paymentId': paymentId,
        'totalValue': totalValue,
        'invoice': invoice
    }

    result = transactions_collection.insert_one(transaction_data)
    inserted_id = result.inserted_id

    return jsonify({'message': 'Transacción de PayPal guardada correctamente', 'transaction_id': str(inserted_id)})

@paypal_route.route('/transactions', methods=['GET'])
def get_paypal_transactions():
    transactions = transactions_collection.find({}, {'_id': False, 'orderId': True, 'payerId': True, 'paymentId': True, 'totalValue': True, 'invoice': True})
    # Convertir las transacciones a una lista para jsonify
    transactions_list = []
    for transaction in transactions:
        transactions_list.append(transaction)
    return jsonify({'transactions': transactions_list})
  
  
# Aquí puedes agregar más rutas relacionadas con PayPal si es necesario
