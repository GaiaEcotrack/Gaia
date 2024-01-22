from marshmallow import Schema, fields

class DeviceSchema(Schema):
    plantId = fields.String(data_key="plant.plantId", required=True)
    plantName = fields.String(data_key="plant.name", required=True)
    plantDescription = fields.String(data_key="plant.description", required=True)
    plantTimezone = fields.String(data_key="plant.timezone", required=True)

    deviceId = fields.String(data_key="device.deviceId", required=True)
    deviceName = fields.String(data_key="device.name", required=True)
    deviceTimezone = fields.String(data_key="device.timezone", required=True)

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
