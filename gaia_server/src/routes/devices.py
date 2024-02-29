from flask import Blueprint, jsonify, request
import requests
import json
import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
from src.models.devices import DeviceSchema
from bson import ObjectId
## middleware apikey
from src.middlewares import require_firebase_auth
from src.services.firebase_admin.firebase_config import verify_firebase_token



load_dotenv()

devices_routes = Blueprint('devices_routes', __name__)

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
print('Db connected')

db = client['gaia']
devices = db['devices']

collection = db['users']
###################################################
#ROUTES
stored_token = None


@devices_routes.route('/token', methods=['GET'])
def autorizar():
    # Obtener los datos del formulario enviado por el cliente
    # URL de la API de autorización
    url = 'https://sandbox-auth.smaapis.de/oauth2/token'

    # Parámetros para la solicitud de autorización
    payload = {
        'grant_type': 'client_credentials',  
        'client_id': 'andromeda_api',
        'client_secret': '5It2L4REBvWO2Hn09BUHVISmoVGrqxKi'
    }

    # Realizar la solicitud utilizando el método POST y configurando el encabezado
    response = requests.post(url, data=payload, headers={'Content-Type': 'application/x-www-form-urlencoded'})

   
    if response.status_code == 200:
        # La solicitud fue exitosa, puedes acceder al token de acceso
        access_token = response.json().get('access_token')
        global stored_token
        stored_token = access_token
        return jsonify({'token': access_token}), 200
        
    else:
        
        return jsonify({'error': f'Error {response.status_code}: {response.text}'}), response.status_code



    
#nueva funcion
@devices_routes.route('/authorize-with-token', methods=['GET'])
def autorizar_con_token():
    global stored_token
    if stored_token:
        return jsonify({'token': stored_token}), 200
    else:
        return autorizar()
    
        
#! url ejemplo: http://127.0.0.1:5000/devices/device-data?deviceId=19
@devices_routes.route('/device-data', methods=['GET'])
def get_device_data():
    # Obtén el parámetro deviceId de la solicitud
    device_id = request.args.get('deviceId')

   
    if not device_id:
        return jsonify({'error': 'Falta el parámetro necesario (deviceId)'}), 400

   
    url = f'https://sandbox.smaapis.de/monitoring/v1/devices/{device_id}'

    
    token_response = autorizar()
    
    
    response_flask, status_code = token_response
    
    if status_code != 200:
        return jsonify({'error': 'No se pudo obtener el token de acceso'}), token_response[1]

    
    access_token = response_flask.get_json()['token']

    
    headers = {'Authorization': f'Bearer {access_token}'}

    # Realizar la solicitud GET a la API
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
       
        data = response.json()
        return jsonify(data), 200
    else:
        return jsonify({'error': f'Error {response.status_code}: {response.text}'}), response.status_code

@devices_routes.route('/plant-devices', methods=['GET', 'OPTIONS'])
# @require_firebase_auth
def get_plant_devices():
    # Obtén el parámetro plantId de la solicitud
    plant_id = request.args.get('plantId')

    if not plant_id:
        return jsonify({'error': 'Falta el parámetro necesario (plantId)'}), 400

    # URL de la API con el parámetro plantId sustituido
    url = f'https://sandbox.smaapis.de/monitoring/v1/plants/{plant_id}/devices'

    # Utiliza la función autorizar() para obtener el token de acceso
    token_response = autorizar()
    
    # token_response es una tupla (response_flask, status_code)
    response_flask, status_code = token_response
    
    if status_code != 200:
        return jsonify({'error': 'No se pudo obtener el token de acceso'}), token_response[1]

    # Extraer el token de acceso de la respuesta de la función autorizar
    access_token = response_flask.get_json()['token']

    # Configurar el encabezado de la solicitud con el token de acceso
    headers = {'Authorization': f'Bearer {access_token}'}

    # Realizar la solicitud GET a la API
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        # La solicitud fue exitosa, devolver los datos obtenidos
        data = response.json()
        return jsonify(data), 200
    else:
        # La solicitud falló, devolver el código de estado y el mensaje de error
        return jsonify({'error': f'Error {response.status_code}: {response.text}'}), response.status_code



#battery
#! ejemplo de query que me costo un huevo!: http://127.0.0.1:5000/devices/battery?deviceId=18&setType=EnergyAndPowerBattery&period=Week&Date=2022-08-08
@devices_routes.route('/battery', methods=['GET'])
# @require_firebase_auth
def get_device_measurements_battery():
    # Obtén los parámetros de la solicitud
    device_id = request.args.get('deviceId')
    set_type = request.args.get('setType')
    period = request.args.get('period')
    date = request.args.get('Date')
    print(period)

    # Verifica que los parámetros necesarios estén presentes
    if not device_id or not set_type or not period:
        return jsonify({'error': 'Faltan parámetros necesarios (deviceId, setType, period)'}), 400
    if period in ['Day', 'Week', 'Month', 'Year'] and not date:
        return jsonify({'error': 'Falta el parámetro necesario (Date) para el periodo seleccionado'}), 400

    # Construye la URL con los parámetros para la API de SMA
    url = f'https://sandbox.smaapis.de/monitoring/v1/devices/{device_id}/measurements/sets/{set_type}/{period}'
    if period in ['Day', 'Week', 'Month', 'Year']:
        url += f'?Date={date}'

    # Aquí asumo que la función autorizar() ya está implementada y funciona correctamente
    token_response = autorizar()
    response_flask, status_code = token_response

    if status_code != 200:
        return jsonify({'error': 'No se pudo obtener el token de acceso'}), status_code

    # Obtén el token de acceso del response
    access_token = response_flask.get_json()['token']

    # Configura los headers para la solicitud
    headers = {'Authorization': f'Bearer {access_token}'}

    # Realizar la solicitud GET a la API
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        # La solicitud fue exitosa, devolver los datos obtenidos
        data = response.json()
        return jsonify(data), 200
    else:
        # La solicitud falló, devolver el código de estado y el mensaje de error
        return jsonify({'error': f'Error {response.status_code}: {response.text}'}), response.status_code


#ruta de meciiones de Pv
#! ejemplo de query que me costo un huevo!: http://127.0.0.1:5000/devices/battery?deviceId=18&setType=EnergyAndPowerBattery&period=Week&Date=2022-08-08
@devices_routes.route('/pv', methods=['GET'])
# @require_firebase_auth
def get_device_measurements_pv():
    # Obtén los parámetros de la solicitud
    device_id = request.args.get('deviceId')
    set_type = request.args.get('setType')
    period = request.args.get('period')
    date = request.args.get('Date')
    print(period)

    # Verifica que los parámetros necesarios estén presentes
    if not device_id or not set_type or not period:
        return jsonify({'error': 'Faltan parámetros necesarios (deviceId, setType, period)'}), 400
    if period in ['Day', 'Week', 'Month', 'Year'] and not date:
        return jsonify({'error': 'Falta el parámetro necesario (Date) para el periodo seleccionado'}), 400

    # Construye la URL con los parámetros para la API de SMA
    url = f'https://sandbox.smaapis.de/monitoring/v1/devices/{device_id}/measurements/sets/{set_type}/{period}'
    if period in ['Day', 'Week', 'Month', 'Year']:
        url += f'?Date={date}'

    # Aquí asumo que la función autorizar() ya está implementada y funciona correctamente
    token_response = autorizar()
    response_flask, status_code = token_response

    if status_code != 200:
        return jsonify({'error': 'No se pudo obtener el token de acceso'}), status_code

    # Obtén el token de acceso del response
    access_token = response_flask.get_json()['token']

    # Configura los headers para la solicitud
    headers = {'Authorization': f'Bearer {access_token}'}

    # Realizar la solicitud GET a la API
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        # La solicitud fue exitosa, devolver los datos obtenidos
        data = response.json()
        return jsonify(data), 200
    else:
        # La solicitud falló, devolver el código de estado y el mensaje de error
        return jsonify({'error': f'Error {response.status_code}: {response.text}'}), response.status_code

# #! ejemplo de query que me costo un huevo!: http://127.0.0.1:5000/devices/sensor?deviceId=18&setType=Sensor&period=Week&Date=2022-08-08
# @devices_routes.route('/sensor', methods=['GET'])
# def get_device_measurements_sensor():
#     # Obtén los parámetros de la solicitud
#     device_id = request.args.get('deviceId')
#     set_type = request.args.get('setType')
#     period = request.args.get('period')
#     date = request.args.get('Date')
#     print(period)

#     # Verifica que los parámetros necesarios estén presentes
#     if not device_id or not set_type or not period:
#         return jsonify({'error': 'Faltan parámetros necesarios (deviceId, setType, period)'}), 400
#     if period in ['Day', 'Week', 'Month', 'Year'] and not date:
#         return jsonify({'error': 'Falta el parámetro necesario (Date) para el periodo seleccionado'}), 400

#     # Construye la URL con los parámetros para la API de SMA
#     url = f'https://sandbox.smaapis.de/monitoring/v1/devices/{device_id}/measurements/sets/{set_type}/{period}'
#     if period in ['Day', 'Week', 'Month', 'Year']:
#         url += f'?Date={date}'

#     # Aquí asumo que la función autorizar() ya está implementada y funciona correctamente
#     token_response = autorizar()
#     response_flask, status_code = token_response

#     if status_code != 200:
#         return jsonify({'error': 'No se pudo obtener el token de acceso'}), status_code

#     # Obtén el token de acceso del response
#     access_token = response_flask.get_json()['token']

#     # Configura los headers para la solicitud
#     headers = {'Authorization': f'Bearer {access_token}'}

#     # Realizar la solicitud GET a la API
#     response = requests.get(url, headers=headers)

#     if response.status_code == 200:
#         # La solicitud fue exitosa, devolver los datos obtenidos
#         data = response.json()
#         return jsonify(data), 200
#     else:
#         # La solicitud falló, devolver el código de estado y el mensaje de error
#         return jsonify({'error': f'Error {response.status_code}: {response.text}'}), response.status_code


#################################################################################

# obtener  devices solo de la db   

    # Consulta de todos los Dispositivos
@devices_routes.route('/', methods=['GET'])
def get_devices():
    try:
        devices_collection = devices  
        devices_list = list(devices_collection.find({}, {'_id': 1, 'user_id': 1, 'plant': 1, 'device': 1, 'sets': 1}))

        formatted_devices = []
        for device in devices_list:
            device['_id'] = str(device['_id'])
            formatted_devices.append(device)

        return jsonify({'devices': formatted_devices}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    

    # Consulta de Dispositivo por ID
@devices_routes.route('/<device_id>', methods=['GET'])
def get_device_by_id(device_id):
    try:
        devices_collection = devices 
        device_object_id = ObjectId(device_id)
        device = devices_collection.find_one({'_id': device_object_id}, {'_id': 1, 'user_id': 1, 'device': 1, 'plant': 1, 'sets': 1})

        if device:
            device['_id'] = str(device['_id'])
            device['user_id'] = str(device.get('user_id'))
            return jsonify(device), 200
        else:
            return jsonify({'message': 'Dispositivo no encontrado'}), 404

    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
    
    # Agregar nuevo Dispositivo a la DB (en el modelo devices y en la propiedad devices[] en el modelo users)
@devices_routes.route('/', methods=['POST'])
def add_device_to_user():
    try:
        user_id = request.json['user_id']
        device_data = request.json['device']
        plant_data = request.json['plant']        
        sets_data = request.json['sets']  
        
        device_id = ObjectId()
        
        device_object = {
            '_id': device_id,
            'user_id': user_id,
            'plant': {
                'plantId': plant_data.get('plantId'),
                'plantName': plant_data.get('plantName'),
                'plantTimezone': plant_data.get('plantTimezone'),
                'description': plant_data.get('description')
            },
            'device': {
                'deviceId': device_data.get('deviceId'),
                'deviceName': device_data.get('deviceName'),
                'deviceTimezone': device_data.get('deviceTimezone'),
                'serial': device_data.get('serial'),
                'image': device_data.get('image')
            },
            'sets': sets_data
        } 
        
        user_collection = collection
        result = user_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$push': {'devices': device_object}}
        )
        
        if result.modified_count == 1:
            devices_collection = devices
            device_result = devices_collection.insert_one(device_object)

            if device_result.inserted_id:
                return jsonify({'message': 'Dispositivo creado y agregado correctamente', 'device_id': str(device_id)}), 200
            else:
                return jsonify({'message': 'Error al crear el dispositivo en devices.'}), 500
        else:
            return jsonify({'message': 'Usuario no encontrado.'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500
      
    # {
    #   "user_id": " ID DEL USUARIO ",
    #   "plant": {
    #     "plantId": "plantId_value",
    #     "plantName": "plantName_value",
    #     "description": "plantDescription_value",
    #     "plantTimezone": "plantTimezone_value"
    #   },
    #   "device": {
    #     "deviceId": "deviceId_value",
    #     "deviceName": "deviceName_value",
    #     "deviceTimezone": "deviceTimezone_value",
    #     "serial": "deviceSerial_value",
    #     "image": "deviceImage_value"
    #   },
    #   "sets": ["set1_value", "set2_value"]
    # }
#----------------------------------------------------


    # Eliminar Dispositivo de la DB (en el modelo devices y en la propiedad devices[] en el modelo users)
@devices_routes.route('/<device_id>', methods=['DELETE'])
def delete_device(device_id):
    try:
        devices_collection = devices
        result = devices_collection.delete_one({'_id': ObjectId(device_id)})

        if result.deleted_count == 1:
            user_collection = collection
            user_result = user_collection.update_one(
                {'devices._id': ObjectId(device_id)},
                {'$pull': {'devices': {'_id': ObjectId(device_id)}}}
            )

            if user_result.modified_count == 1:
                return jsonify({'message': 'Dispositivo eliminado correctamente'}), 200
            else:
                return jsonify({'message': 'Dispositivo no encontrado en la propiedad devices del usuario'}), 404
        else:
            return jsonify({'message': 'Dispositivo no encontrado en la colección devices'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
    
    
    

# ------- Las siguiente rutas se usarian unicamente en casos especificos de lo contrario usar la ruta anterior --------

    #Eliminar dispositivo unicamente del modelo devices. 
@devices_routes.route('/delete/<device_id>', methods=['DELETE'])
def delete_device_from_devices_model(device_id):
    try:
        # Delete device from devices collection
        devices_collection = devices
        result = devices_collection.delete_one({'_id': ObjectId(device_id)})

        if result.deleted_count == 1:
            return jsonify({'message': 'Dispositivo eliminado correctamente del modelo devices'}), 200
        else:
            return jsonify({'message': 'Dispositivo no encontrado en la colección devices'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500    
    
    
    # Eliminar dispositivo unicamente de modelo user - propiedad devices
@devices_routes.route('/delete/<user_id>/<device_id>', methods=['DELETE'])
def delete_device_from_user_model(user_id, device_id):
    try:
        # Delete device from user's devices property
        user_collection = collection
        result = user_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$pull': {'devices': {'_id': ObjectId(device_id)}}}
        )

        if result.modified_count == 1:
            return jsonify({'message': 'Dispositivo eliminado correctamente de la propiedad devices del usuario'}), 200
        else:
            return jsonify({'message': 'Dispositivo no encontrado en la propiedad devices del usuario'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
    