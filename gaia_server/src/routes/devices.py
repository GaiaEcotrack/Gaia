from flask import Blueprint, jsonify
import json
import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

devices_routes = Blueprint('devices_routes', __name__)

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
print('Db connected')

db = client['gaia']
devices = db['devices']

@devices_routes.route('/', methods=['GET'])
def get_devices():
    try:
        json_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'api_simulator.json')
        with open(json_file_path, 'r') as file:
            devices_data = json.load(file)
        
        # Lista para almacenar los IDs de los dispositivos insertados o actualizados
        device_ids = []

        # Insertar o actualizar los datos en la colección 'devices'
        for device in devices_data:
            # Crear un filtro para la búsqueda de un dispositivo existente
            device_filter = {'device.deviceId': device['device']['deviceId']}
            # Encontrar un dispositivo existente en la base de datos
            existing_device = devices.find_one(device_filter)
            if not existing_device:
                # Insertar el nuevo dispositivo y obtener el ID insertado
                result = devices.insert_one(device)
                device['_id'] = result.inserted_id
            else:
                # Usar el ID del dispositivo existente
                device['_id'] = existing_device['_id']

            # Agregar el ID del dispositivo a la lista
            device_ids.append(device['_id'])

        # Obtener todos los dispositivos insertados o actualizados para la respuesta
        inserted_updated_devices = list(devices.find({'_id': {'$in': device_ids}}))

        # Convertir los ObjectId a strings para la respuesta JSON
        devices_list = []
        for device in inserted_updated_devices:
            device_data = {
                '_id': str(device['_id']),
                'plant': device['plant'],
                'device': device['device'],
                'sets': device['sets']
            }
            devices_list.append(device_data)
            print(f'Datos de la api o JSON')
        
        return jsonify(devices_list)
    except FileNotFoundError:
        return jsonify({'message': 'Archivo JSON no encontrado'}), 404
    except json.JSONDecodeError:
        return jsonify({'message': 'Error al decodificar el archivo JSON'}), 500
    except Exception as e:
        return jsonify({'message': 'Error interno del servidor', 'error': str(e)})

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