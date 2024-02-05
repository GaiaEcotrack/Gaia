from marshmallow import Schema, fields, validate

class PlantSchema(Schema):
    plantId = fields.String(required=True)
    name = fields.String(required=True)
    description = fields.String(required=True)
    timezone = fields.String(required=True)

class DeviceDataSchema(Schema):
    deviceId = fields.String(required=True)
    name = fields.String(required=True)
    timezone = fields.String(required=True)

class DeviceSchema(Schema):
    user_id = fields.String(required=True, data_key="user_id")
    plant = fields.Nested(PlantSchema, data_key="plant", required=True)
    device = fields.Nested(DeviceDataSchema, data_key="device", required=True)
    sets = fields.List(fields.String(), required=True)



# Considerar de utiilzar Schema con subSchemas.

# from marshmallow import Schema, fields

# class PlantSchema(Schema):
#     plantId = fields.String(required=True)
#     name = fields.String(required=True)
#     description = fields.String(required=True)
#     timezone = fields.String(required=True)

# class DeviceSchema(Schema):
#     deviceId = fields.String(required=True)
#     name = fields.String(required=True)
#     timezone = fields.String(required=True)

# class DeviceSetSchema(Schema):
#     sets = fields.List(fields.String(), required=True)

# class DevicesSchema(Schema):
#     plant = fields.Nested(PlantSchema, required=True)
#     device = fields.Nested(DeviceSchema, required=True)
#     sets = fields.Nested(DeviceSetSchema, required=True)
