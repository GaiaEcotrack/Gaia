
import os
from dotenv import load_dotenv
load_dotenv()
#routes
# from src.routes.users import users_route
# from src.routes.devices import devices_routes
# from src.routes.plants import plants_routes
#dynamo
import boto3
from boto3.dynamodb.conditions import Attr, Key
from datetime import datetime
import resource
from flask import jsonify, Blueprint, request, json



users_routes_dynamo = Blueprint('users_routes_dynamo', __name__)



dynamodb = boto3.resource('dynamodb',
                          aws_access_key_id=os.getenv('ENV_AWS_ACCESS_KEY_ID'),
                          aws_secret_access_key=os.getenv('ENV_AWS_SECRET_ACCESS_KEY'),
                          region_name=os.getenv('ENV_AWS_REGION_NAME'))

demo_table = dynamodb.Table('probando')

def insert_user(user):
    print("Insertando usuario...")
    response = demo_table.put_item(Item=user)
    print("Usuario insertado:", response)
    
# dynamodb = boto3.resource('dynamodb',
#                           aws_access_key_id=os.getenv('ENV_AWS_ACCESS_KEY_ID'),
#                           aws_secret_access_key=os.getenv('ENV_AWS_SECRET_ACCESS_KEY'),
#                           region_name=os.getenv('ENV_AWS_REGION_NAME'))

# # Referencia a la tabla
# users_table = dynamodb.Table('probando')


    
# @users_routes_dynamo.route('/dynamoAdd', methods=['POST'])
# def create_user():
#     # Obtener los datos enviados en la petición POST
#     user_data = request.json

#     # Insertar usuario en la tabla DynamoDB
#     response = users_table.put_item(Item=user_data)
    
#     # Verificar si la inserción fue exitosa y responder en consecuencia
#     if response.get('ResponseMetadata', {}).get('HTTPStatusCode') == 200:
#         return jsonify({'message': 'User created successfully'}), 201
#     else:
#         return jsonify({'message': 'Error creating user'}), 500

# Prepara tu objeto user_item aquí
user = {
    "email": "11111PROBANDOuserNEW@example.com",
    "full_name": "Nombre Completo",
    "identification_number": "12345678",
    "address": "Dirección del Usuario",
    "phone": "555-1234",
    "identity_document": "Documento de Identidad",
    "bank_account_status": "Estado de la Cuenta Bancaria",
    "tax_declarations": "Declaraciones de Impuestos",
    "other_financial_documents": "Otros Documentos Financieros",
    "credentials": "Credenciales",
    "secret_key": "Clave Secreta",
    "identity_document_url": "URL del Documento de Identidad",
    "bank_account_status_url": "URL del Estado de la Cuenta Bancaria",
    "tax_declarations_url": "URL de las Declaraciones de Impuestos",
    "other_financial_documents_url": "URL de Otros Documentos Financieros",
    "devices": [
        {"device_id": "dispositivo1", "device_name": "Nombre del Dispositivo 1"},
        # Añade más dispositivos según sea necesario
    ]
}



# Llama a la función de inserción
# insert_user(user)


#Crud 
