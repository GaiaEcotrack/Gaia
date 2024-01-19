# from flask import Flask, request, jsonify
# from pymongo import MongoClient
# from flask_swagger_ui import get_swaggerui_blueprint
# from routes.users import user_routes
# from models.user import UserSchema


# app = Flask(__name__)

# # Configuración de Swagger
# SWAGGER_URL = "/docs"
# API_URL = "/static/swagger.json"
# SWAGGER_BLUEPRINT = get_swaggerui_blueprint(
#     SWAGGER_URL,
#     API_URL,
#     config={
#         "app_name": "Gaia API"
#     }
# )

# app.register_blueprint(SWAGGER_BLUEPRINT, url_prefix=SWAGGER_URL)

# mongo_uri = 'mongodb+srv://gaiamongodb:84AmBlbGBNRr5CBJ@cluster0.wio4vv2.mongodb.net/?retryWrites=true&w=majority'
# client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
# if client:
#     print('Db connected')

# db = client['gaia']
# collection = db['users']

# # Ruta principal para traer usuarios
# @app.route('/users', methods=['GET'])
# def get_users():
#     users = list(collection.find())
#     for user in users:
#         user['_id'] = str(user['_id'])
#     return jsonify({'message': 'Hello, Flask and MongoDB Atlas!', 'users': users})

# @app.route('/users', methods=['POST'])
# def add_user():
#     data = request.json

#     user_schema = UserSchema()
#     errors = user_schema.validate(data)


#     if errors:
#         return jsonify({'message': 'Errores de validación', 'errors': errors}), 400

#     username = data.get('username')
#     email = data.get('email')
#     password = data.get('password')

#     # Obtener los nuevos campos
#     nombre_apellidos = data.get('nombre_apellidos')
#     numero_identificacion = data.get('numero_identificacion')
#     direccion = data.get('direccion')
#     telefono = data.get('telefono')
#     correo_electronico = data.get('correo_electronico')

#     documento_identidad = data.get('documento_identidad')
#     certificado_nacimiento = data.get('certificado_nacimiento')
#     certificado_matrimonio = data.get('certificado_matrimonio')

#     estado_cuenta_bancario = data.get('estado_cuenta_bancario')
#     declaraciones_impuestos = data.get('declaraciones_impuestos')
#     otros_documentos_financieros = data.get('otros_documentos_financieros')

#     # Insertar el nuevo usuario en la colección
#     new_user = {
#         'username': username,
#         'email': email,
#         'password': password,
#         'nombre_apellidos': nombre_apellidos,
#         'numero_identificacion': numero_identificacion,
#         'direccion': direccion,
#         'telefono': telefono,
#         'correo_electronico': correo_electronico,
#         'documento_identidad': documento_identidad,
#         'certificado_nacimiento': certificado_nacimiento,
#         'certificado_matrimonio': certificado_matrimonio,
#         'estado_cuenta_bancario': estado_cuenta_bancario,
#         'declaraciones_impuestos': declaraciones_impuestos,
#         'otros_documentos_financieros': otros_documentos_financieros
#     }

#     result = collection.insert_one(new_user)
#     inserted_id = result.inserted_id

#     return jsonify({'message': 'Usuario agregado con éxito', 'user_id': str(inserted_id)})

# # Cierra la conexión al finalizar
# @app.teardown_appcontext
# def close_connection(exception=None):
#     pass  # No hagas nada en esta función, evita cerrar la conexión aquí

# if __name__ == '__main__':
#     try:
#         app.run(debug=True)
#     finally:
#         client.close()
