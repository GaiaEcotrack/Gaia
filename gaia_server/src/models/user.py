from marshmallow import Schema, fields, validate



class UserSchema(Schema):
    username = fields.String(required=True, validate=validate.Length(min=1))
    password = fields.String(required=True, validate=validate.Length(min=6))
    full_name = fields.String(required=True)
    identification_number = fields.String(required=True)  
    address = fields.String(required=True) 
    phone = fields.String(required=True)  
    email = fields.Email(required=True)  

    identity_document = fields.String(required=True)

    bank_account_status = fields.String(allow_none=True)  
    tax_declarations = fields.String(allow_none=True)
    other_financial_documents = fields.String(allow_none=True)  
    
    credentials = fields.String(required=True)
    secret_key = fields.String(required=True)
    devices = fields.List(fields.String(), allow_none=True)  
