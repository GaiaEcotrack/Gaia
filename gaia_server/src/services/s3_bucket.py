
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
        s3_client.Bucket(os.environ.get('ENV_AWS_S3_BUCKET_NAME')).put_object(
            Key=file.filename, Body=file
        )
        return jsonify({'message': 'done'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
    #########################################################################################################
    
    # with open('sma_sunny_tripower_6000tl_20.png', 'rb') as f:
#     image_data = f.read()
#     try:
        
#         s3_client = boto3.resource(
#             's3',
#             aws_access_key_id = os.environ.get('ENV_AWS_ACCESS_KEY_ID'),
#             aws_secret_access_key = os.environ.get('ENV_AWS_SECRET_ACCESS_KEY'),
#             region_name = os.environ.get('ENV_AWS_REGION_NAME')
#         )
#         s3_client.Bucket(os.environ.get('ENV_AWS_S3_BUCKET_NAME')).put_object(
#             Key='sma_sunny_tripower_6000tl_20.png', Body=image_data
#         )
#         print('done')
#     except Exception as e:
#         print(e) 