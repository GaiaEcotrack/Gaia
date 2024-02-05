

# subir con POST

import boto3
from flask import Flask, request, jsonify, Blueprint
from dotenv import load_dotenv
import os

load_dotenv()



application = Flask(__name__)

bucket_route = Blueprint('bucket_route', __name__)

@bucket_route.route('/upload_image', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    try:
        s3_client = boto3.resource(
            's3',
            aws_access_key_id=os.environ.get('ENV_AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.environ.get('ENV_AWS_SECRET_ACCESS_KEY'),
            region_name=os.environ.get('ENV_AWS_REGION_NAME')
        )
        # Leer el contenido binario del archivo
        file_content = file.read()
        s3_client.Bucket(os.environ.get('ENV_AWS_S3_BUCKET_NAME')).put_object(
            Key=file.filename, Body=file_content
        )
        return jsonify({'message': 'done successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    #######################################################################################################################################
    
    # subir directamente
    # with open('engineer1.png', 'rb') as f:
#     image_data = f.read()
    
# try:
#     s3_client = boto3.resource(
#             's3',
#             aws_access_key_id = os.environ.get('ENV_AWS_ACCESS_KEY_ID'),
#             aws_secret_access_key = os.environ.get('ENV_AWS_SECRET_ACCESS_KEY'),
#             region_name = os.environ.get('ENV_AWS_REGION_NAME')
#     )
#     s3_client.Bucket(os.environ.get('ENV_AWS_S3_BUCKET_NAME')).put_object(
#             Key='engineer1.png', Body=image_data
#     )
#     print('done')
# except Exception as e:
#     print(e) 
    

# import boto3
# import base64
# import json
# from flask import Flask, request, jsonify, Blueprint
# from dotenv import load_dotenv
# import os

# load_dotenv()

# application = Flask(__name__)
# bucket_route = Blueprint('bucket_route', __name__)
# # application.register_blueprint(bucket_route)

# @bucket_route.route('/upload_image', methods=['POST'])
# def upload_image():
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file part'}), 400
#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400
#     try:
#         # Convertir el archivo a base64
#         file_content_base64 = base64.b64encode(file.read()).decode('utf-8')
        
#         # Preparar los datos para la función Lambda
#         payload = {
#             'bucket': os.environ.get('ENV_AWS_S3_BUCKET_NAME'),
#             'filename': file.filename,
#             'content': file_content_base64
#         }
        
#         # Crear un cliente para invocar Lambda
#         lambda_client = boto3.client('lambda', region_name=os.environ.get('ENV_AWS_REGION_NAME'))
        
#         # Invocar la función Lambda
#         response = lambda_client.invoke(
#             FunctionName='lambda_handler',  # Asegúrate de reemplazar esto con el nombre real de tu función Lambda
#             InvocationType='RequestResponse',
#             Payload=json.dumps(payload)
#         )
        
#         # Leer y devolver la respuesta de Lambda
#         response_payload = json.loads(response['Payload'].read())
#         return jsonify(response_payload), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == "__main__":
#     application.run(debug=True)
