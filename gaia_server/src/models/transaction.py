from marshmallow import Schema, fields


class TransactionSchema(Schema):
    sender_user_id = fields.String(required=True, load_only=True)  # ID del usuario que envía; solo carga, no se devuelve en la serialización
    receiver_user_id = fields.String(required=True, load_only=True)  # ID del usuario receptor; solo carga, no se devuelve en la serialización
    vara_amount = fields.Float(required=True)  # La cantidad de varas/tokens transferidos
    transaction_type = fields.String(required=True, validate=lambda x: x in ['P2P', 'Membership', 'Withdrawal'])  # Solo se aceptan valores válidos
    status = fields.String(required=True, validate=lambda x: x in ['Pending', 'Completed', 'Cancelled'])  # Estado de la transacción
    date = fields.DateTime(required=True)  # Fecha y hora de la transacción

