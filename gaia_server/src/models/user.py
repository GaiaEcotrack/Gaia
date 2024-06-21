from marshmallow import Schema, fields, validates, ValidationError, EXCLUDE
from src.models.devices import DeviceSchema
from src.models.wallet_gaia import WalletGaiaSchema


class UserSchema(Schema):
    class Meta:
        unknown = EXCLUDE
        
    full_name = fields.String(required=False)
    identification_number = fields.String(required=False)  
    address = fields.String(required=False) 
    phone = fields.String(required=False)  
    email = fields.Email(required=False)
    role = fields.String(required=False, validate=lambda x: x in ['Administrator', 'Installer', 'Generator'])
    
    identity_document = fields.String(required=False)
    bank_account_status = fields.String(allow_none=False)  
    tax_declarations = fields.String(allow_none=False)
    other_financial_documents = fields.String(allow_none=False)

    device_brand = fields.String(required=False)
    username = fields.String(required=False)
    installation_company = fields.String(required=False)
    
    membership = fields.Boolean(required=False)
    key_auth = fields.String(required=False)
    verified_email = fields.Boolean(required=False)
    verified_sms = fields.Boolean(required=False)
    verified_2fa = fields.Boolean(required=False)
    status_documents = fields.String(required=False)
    photo_profile = fields.String(required=False)
    location = fields.String(required=False)
    
    identity_document_url = fields.String(required=False)
    bank_account_status_url = fields.String(required=False)
    tax_declarations_url = fields.String(required=False)
    other_financial_documents_url = fields.String(required=False)
    
    devices = fields.List(fields.Nested(DeviceSchema), allow_none=False)
    wallet = fields.Nested(WalletGaiaSchema, allow_none=False)
    
    api_key = fields.String(required=False)
    