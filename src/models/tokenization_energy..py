from marshmallow import Schema, fields
from datetime import datetime
from src.models.user import UserSchema

class EnergyTokenizationSchema(Schema):
    energy_in_kilowatts = fields.Float(required=True)
    energy_tokenized_in_gaia_tokens = fields.Float(required=True)
    is_tokenized = fields.Boolean(required=True)
    tokenization_date = fields.DateTime(default=datetime.utcnow)

    # Relación con el usuario (modelo user)
    user = fields.Nested(UserSchema, required=True)


energy_tokenization_schema = EnergyTokenizationSchema()
energy_tokenizations_schema = EnergyTokenizationSchema(many=True)
