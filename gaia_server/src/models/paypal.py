from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
if client:
    print('Db connected')

db = client['gaia']
transactions_collection = db['transactions']

from marshmallow import Schema, fields

class PayPalTransactionSchema(Schema):
    orderId = fields.Str(required=True)
    payerId = fields.Str(required=True)
    paymentId = fields.Str(required=True)
    totalValue = fields.Float(required=True)
    invoice = fields.Str(required=True)