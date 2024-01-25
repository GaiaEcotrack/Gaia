from flask import Blueprint, jsonify
import requests
from flask import request
import json
import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import requests

load_dotenv()

devices_routes = Blueprint('devices_routes', __name__)

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
print('Db connected')

db = client['gaia']
devices = db['devices']

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
    

@devices_routes.route('/plants', methods=['GET'])
def get_plant_data():
    # URL de la API
    url = 'https://sandbox.smaapis.de/monitoring/v1/plants'

    
    token_response = autorizar()
    
    
    response_flask, status_code = token_response
    
    if status_code != 200:
        return jsonify({'error': 'No se pudo obtener el token de acceso'}), token_response[1]

    
    access_token = response_flask.get_json()['token']
    

    
    headers = {'Authorization': f'Bearer {access_token}'}
   

    
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        
        data = response.json()
        return jsonify(data), 200
    else:
        # La solicitud falló, devolver el código de estado y el mensaje de error
        return jsonify({'error': f'Error {response.status_code}: {response.text}'}), response.status_code   
        

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
# ...

#PENSAR EN METODO PARA TRAER POR EL ID DE LOS DISPOSITIVOS DE LA API Y NO DE MONGO DB
