
import boto3
from flask import Flask, request, jsonify, Blueprint
from dotenv import load_dotenv
import os
import mimetypes

load_dotenv()



application = Flask(__name__)

bucket_route = Blueprint('bucket_route', __name__)

@bucket_route.route('', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    try:
        # Determinar el Content-Type basado en la extensión del archivo
        content_type = mimetypes.guess_type(file.filename)[0] or 'application/octet-stream'

        s3_client = boto3.client(
            's3',
            aws_access_key_id=os.environ.get('ENV_AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.environ.get('ENV_AWS_SECRET_ACCESS_KEY'),
            region_name=os.environ.get('ENV_AWS_REGION_NAME')
        )
        bucket_name = os.environ.get('ENV_AWS_S3_BUCKET_NAME')
        file_key = file.filename

       # Leer el contenido binario del archivo y subirlo
        s3_client.upload_fileobj(file, bucket_name, file_key, ExtraArgs={'ContentType': content_type})

        # Generar URL presignada
        file_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': file_key},
            ExpiresIn=3600  # Tiempo de expiración de la URL en segundos
        )

        return jsonify({'message': 'file uploaded successfully', 'url': file_url}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    