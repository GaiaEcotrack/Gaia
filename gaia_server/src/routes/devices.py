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
        'grant_type': 'client_credentials',  # Tipo de concesión (puede variar según la API)
        'client_id': 'andromeda_api',
        'client_secret': '5It2L4REBvWO2Hn09BUHVISmoVGrqxKi'
    }

    # Realizar la solicitud utilizando el método POST y configurando el encabezado
    response = requests.post(url, data=payload, headers={'Content-Type': 'application/x-www-form-urlencoded'})

    # Verificar el estado de la respuesta
    if response.status_code == 200:
        # La solicitud fue exitosa, puedes acceder al token de acceso
        access_token = response.json().get('access_token')
        global stored_token
        stored_token = access_token
        return jsonify({'token': access_token}), 200
        
    else:
        # La solicitud falló, devolver el código de estado y el mensaje de error
        return jsonify({'error': f'Error {response.status_code}: {response.text}'}), response.status_code



    
#nueva funcion
@devices_routes.route('/authorize-with-token', methods=['GET'])
def autorizar_con_token():
    global stored_token
    if stored_token:
        # Si ya hay un token almacenado, devolverlo
        return jsonify({'token': stored_token}), 200
    else:
        # Si no hay token almacenado, intentar obtener uno nuevo
        return autorizar()
    
# llevado a archivo plants.py
# @devices_routes.route('/plants', methods=['GET'])
# def get_plant_data():
#     # URL de la API
#     url = 'https://sandbox.smaapis.de/monitoring/v1/plants'

    
#     token_response = autorizar()
    
    
#     response_flask, status_code = token_response
    
#     if status_code != 200:
#         return jsonify({'error': 'No se pudo obtener el token de acceso'}), token_response[1]

    
#     access_token = response_flask.get_json()['token']
    

    
#     headers = {'Authorization': f'Bearer {access_token}'}
   

    
#     response = requests.get(url, headers=headers)

#     if response.status_code == 200:
        
#         data = response.json()
#         return jsonify(data), 200
#     else:
#         # La solicitud falló, devolver el código de estado y el mensaje de error
#         return jsonify({'error': f'Error {response.status_code}: {response.text}'}), response.status_code   
        

#! url ejemplo: http://127.0.0.1:5000/devices/device-data?deviceId=19
@devices_routes.route('/device-data', methods=['GET'])
def get_device_data():
    # Obtén el parámetro deviceId de la solicitud
    device_id = request.args.get('deviceId')

    # Verifica que el parámetro deviceId esté presente
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
        # La solicitud fue exitosa, devolver los datos obtenidos
        data = response.json()
        return jsonify(data), 200
    else:
        # La solicitud falló, devolver el código de estado y el mensaje de error
        return jsonify({'error': f'Error {response.status_code}: {response.text}'}), response.status_code

@devices_routes.route('/plant-devices', methods=['GET'])
def get_plant_devices():
    # Obtén el parámetro plantId de la solicitud
    plant_id = request.args.get('plantId')

    # Verifica que el parámetro plantId esté presente
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
@require_firebase_auth
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

@devices_routes.route('/db', methods=['GET'])
def get_devices_from_db():
    try:
        # Consulta todos los dispositivos almacenados en la base de datos
        devices_data = list(devices.find())

        # Convertir los ObjectId a strings para la respuesta JSON
        devices_list = []
        for device in devices_data:
            device_data = {
                '_id': str(device['_id']),
                'plant': device['plant'],
                'device': device['device'],
                'sets': device['sets']
            }
            devices_list.append(device_data)
            print(f'Datos de la DB de MONGO')
        
        return jsonify(devices_list)
    except Exception as e:
        return jsonify({'message': 'Error interno del servidor', 'error': str(e)})
    
    
    # Get device by ID de la DB MONGO
    
@devices_routes.route('/<string:device_id>', methods=['GET'])
def get_device_by_id(device_id):
    try:
        # Consulta el dispositivo por su ID en la base de datos
        device = devices.find_one({'_id': ObjectId(device_id)})
        
        if device:
            # Convierte el ObjectId a string para la respuesta JSON
            device_data = {
                '_id': str(device['_id']),
                'plant': device['plant'],
                'device': device['device'],
                'sets': device['sets']
            }
            return jsonify(device_data)
        else:
            return jsonify({'message': 'Dispositivo no encontrado'}), 404
    except Exception as e:
        return jsonify({'message': 'Error interno del servidor', 'error': str(e)})
    
    #PENSAR EN METODO PARA TRAER POR EL ID DE LOS DISPOSITIVOS DE LA API Y NO DE MONGO DB
    
    
    
    
    # POST para agregar nuevo dispositivo a la DB 
@devices_routes.route('/', methods=['POST'])
def add_device():
    data = request.json

    device_schema = DeviceSchema()
    errors = device_schema.validate(data)

    if errors:
        return jsonify({'message': 'Validation errors', 'errors': errors}), 400
    
    user_id = data.get('user_id')
    
    user_collection = collection
    
    user = user_collection.find_one({'_id': ObjectId(user_id)})
    if not user:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    device_collection = devices
    
    plant_data = data.get('plant')
    device_data = data.get('device')
    sets = data.get('sets')
    user_id = data.get('user_id')

    new_device = {
    'user_id': user_id,
    'plant': {
        'plantId': plant_data.get('plantId'),
        'name': plant_data.get('name'),
        'description': plant_data.get('description'),
        'timezone': plant_data.get('timezone')
    },
    'device': {
        'deviceId': device_data.get('deviceId'),
        'name': device_data.get('name'),
        'timezone': device_data.get('timezone'),
        'serial': device_data.get('serial'),
        'image': device_data.get('image')
    },
    'sets': sets,
}
    result = device_collection.insert_one(new_device)
    inserted_id = result.inserted_id
    
    user_id = user['_id']
    user_collection.update_one({'_id': ObjectId(user_id)}, {'$push': {'devices': str(inserted_id)}})

    return jsonify({'message': 'Dispositivo agregado con éxito', 'device_id': str(inserted_id)})


    # Eliminar dispositivos de la DB  
@devices_routes.route('/<user_id>/<device_id>', methods=['DELETE'])
def delete_device(user_id, device_id):
    try:
        user_id = ObjectId(user_id)
        device_id = ObjectId(device_id)
    except:
        return jsonify({'message': 'ID de usuario o dispositivo no válido'}), 400

    user_collection = collection
    device_collection = devices
    result = device_collection.delete_one({'_id': device_id})
    
    if result.deleted_count == 0:
        return jsonify({'message': 'Dispositivo no encontrado'}), 404

    user_collection.update_one({'_id': user_id}, {'$pull': {'devices': str(device_id)}})

    return jsonify({'message': 'Dispositivo eliminado con éxito'})



