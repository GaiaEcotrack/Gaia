from marshmallow import Schema, fields, validate

class PlantSchema(Schema):
    plantId = fields.String(required=False)
    name = fields.String(required=False)
    description = fields.String(required=False)
    timezone = fields.String(required=False)

class DeviceDataSchema(Schema):
    deviceId = fields.String(required=False)
    name = fields.String(required=False)
    timezone = fields.String(required=False)

class DeviceSchema(Schema):
    user_id = fields.String(required=False, data_key="user_id")
    plant = fields.Nested(PlantSchema, data_key="plant", required=False)
    device = fields.Nested(DeviceDataSchema, data_key="device", required=False)
    sets = fields.List(fields.String(), required=False)



# Considerar de utiilzar Schema con subSchemas.

# from marshmallow import Schema, fields

# class PlantSchema(Schema):
#     plantId = fields.String(required=False)
#     name = fields.String(required=False)
#     description = fields.String(required=False)
#     timezone = fields.String(required=False)

# class DeviceSchema(Schema):
#     deviceId = fields.String(required=False)
#     name = fields.String(required=False)
#     timezone = fields.String(required=False)

# class DeviceSetSchema(Schema):
#     sets = fields.List(fields.String(), required=False)

# class DevicesSchema(Schema):
#     plant = fields.Nested(PlantSchema, required=False)
#     device = fields.Nested(DeviceSchema, required=False)
#     sets = fields.Nested(DeviceSetSchema, required=False)
