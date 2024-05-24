from flask import Blueprint, jsonify
import requests
from flask import request
import json
import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

plants_routes = Blueprint('plants_routes', __name__)

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
print('Db connected')

db = client['gaia']
plants = db['plants']


stored_token = None

@plants_routes.route('/token', methods=['GET'])
def autorizar():
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
        access_token = response.json().get('access_token')
        global stored_token
        stored_token = access_token
        return access_token  # Devolver solo el token
    else:
        return None  # Devolver None en caso de error

@plants_routes.route('/authorize-with-token', methods=['GET'])
def autorizar_con_token():
    global stored_token
    if stored_token:
        return stored_token
    else:
        return autorizar()
    
# la ruta esta /plants en el navegador
@plants_routes.route('/', methods=['GET'])
def get_plant_data():
    # URL de la API
    url = 'https://sandbox.smaapis.de/monitoring/v1/plants'
    
    token_response = autorizar()
    
    if token_response is None:
        return jsonify({'error': 'No se pudo obtener el token de acceso'}), 401

    access_token = token_response

    headers = {'Authorization': f'Bearer {access_token}'}
    
    response = requests.get(url, headers=headers)


    if response.status_code == 200:
        
        data = response.json()
        return jsonify(data), 200
    else:
        # La solicitud falló, devolver el código de estado y el mensaje de error
        return jsonify({'error': f'Error {response.status_code}: {response.text}'}), response.status_code     
 
 
## Ruta para mediciones de las plantas    
# @plants_routes.route('/measurements/<plantId>/<setType>/<periodo>', methods=['GET'])
# def get_plant_measurements(plantId, setType, periodo):
#     # Primero, asegúrate de tener un token de acceso válido
#     token_response = autorizar_con_token()
    
#     if token_response is None:
#         return jsonify({'error': 'No se pudo obtener el token de acceso'}), 401

#     access_token = token_response

#     # Construye la URL específica para obtener los datos de mediciones
#     url = f'https://sandbox.smaapis.de/monitoring/v2/plants/{plantId}/measurements/sets/{setType}/Month?Date={periodo}'


#     # Configura los encabezados de la solicitud con el token de acceso
#     headers = {'Authorization': f'Bearer {access_token}'}
    
#     # Realiza la solicitud GET a la API
#     response = requests.get(url, headers=headers)

#     # Verifica el estado de la respuesta y devuelve los datos o un mensaje de error
#     if response.status_code == 200:
#         data = response.json()
#         return jsonify(data), 200
#     else:
#         return jsonify({'error': f'Error {response.status_code}: {response.text}'}), response.status_code