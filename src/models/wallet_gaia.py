from marshmallow import Schema, fields, EXCLUDE
from src.models.transaction import TransactionSchema


class WalletGaiaSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    vara_balance = fields.Float(required=False)
    gaia_token_balance = fields.Float(required=True)
    willing_to_sell_excess = fields.Boolean(required=True) # vender excedente
    transactions = fields.List(fields.Nested(TransactionSchema), allow_none=True)# Referencia a las transacciones asociadas a esta wallet


