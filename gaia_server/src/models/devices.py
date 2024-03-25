from marshmallow import Schema, fields, validate

class DeviceDataSchema(Schema):
    deviceId = fields.String(required=False)
    deviceName = fields.String(required=False)
    deviceTimezone = fields.String(required=False)
    serial = fields.String(required=False)
    image = fields.String(allow_none=False)

class DeviceSchema(Schema):
    device = fields.Nested(DeviceDataSchema, required=False)



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
