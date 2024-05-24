from marshmallow import Schema, fields

class PaymentsUsersSchema(Schema):
        
    user_id = fields.String(required=False, data_key="user_id")
    name = fields.String(required=False)
    email = fields.Email(required=False)     
    payment_type = fields.String(required=False)
    address = fields.String(required=False)
    status = fields.String(required=False) 
    
    