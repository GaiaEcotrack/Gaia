from marshmallow import Schema, fields
from datetime import datetime
from src.models.user import UserSchema

class TransactionSchema(Schema):
    transaction_date = fields.DateTime(required=True, default=datetime.utcnow)
    amount_usdt = fields.Float(required=True)
    amount_vara = fields.Float(required=True)
    was_successful = fields.Boolean(required=True)

    # Relación con el usuario 
    user = fields.Nested(UserSchema, required=True)


transaction_schema = TransactionSchema()
transactions_schema = TransactionSchema(many=True)
