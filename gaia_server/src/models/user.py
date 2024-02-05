from marshmallow import Schema, fields, validate
from src.models.devices import DeviceSchema


class UserSchema(Schema):
    full_name = fields.String(required=False)
    identification_number = fields.String(required=False)  
    address = fields.String(required=False) 
    phone = fields.String(required=False)  
    email = fields.Email(required=False)  

    identity_document = fields.String(required=False)

    bank_account_status = fields.String(allow_none=False)  
    tax_declarations = fields.String(allow_none=False)
    other_financial_documents = fields.String(allow_none=False)  
    
    credentials = fields.String(required=False)
    secret_key = fields.String(required=False)
    devices = fields.List(fields.String(), allow_none=False)  
    
    devices = fields.List(fields.Nested(DeviceSchema), allow_none=False)
    