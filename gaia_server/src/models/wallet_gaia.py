from marshmallow import Schema, fields, EXCLUDE

class WalletGaiaSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    vara_balance = fields.Float(required=False)
    gaia_token_balance = fields.Float(required=True)
    willing_to_sell_excess = fields.Boolean(required=True) # vender excedente
    transactions = fields.List(fields.Nested('TransactionSchema'), allow_none=True)# Referencia a las transacciones asociadas a esta wallet

class TransactionSchema(Schema):
    transaction_id = fields.String(required=True)  # Podría ser un UUID para asegurar unicidad
    sender_user_id = fields.String(required=True, load_only=True)  # ID del usuario que envía; solo carga, no se devuelve en la serialización
    receiver_user_id = fields.String(required=True, load_only=True)  # ID del usuario receptor; solo carga, no se devuelve en la serialización
    vara_amount = fields.Float(required=True)  # La cantidad de varas/tokens transferidos
    transaction_type = fields.String(required=True, validate=lambda x: x in ['buy', 'sell'])  # Solo se aceptan valores válidos
    status = fields.String(required=True, validate=lambda x: x in ['pending', 'completed', 'cancelled'])  # Estado de la transacción
    date = fields.DateTime(required=True)  # Fecha y hora de la transacción
