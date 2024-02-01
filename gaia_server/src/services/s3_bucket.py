import boto3
from dotenv import load_dotenv
import os

load_dotenv()

with open('sma_sunny_tripower_6000tl_20.png', 'rb') as f:
    image_data = f.read()
    try:
        
        s3_client = boto3.resource(
            's3',
            aws_access_key_id = os.environ.get('ENV_AWS_ACCESS_KEY_ID'),
            aws_secret_access_key = os.environ.get('ENV_AWS_SECRET_ACCESS_KEY'),
            region_name = os.environ.get('ENV_AWS_REGION_NAME')
        )
        s3_client.Bucket(os.environ.get('ENV_AWS_S3_BUCKET_NAME')).put_object(
            Key='sma_sunny_tripower_6000tl_20.png', Body=image_data
        )
        print('done')
    except Exception as e:
        print(e) 
