from dotenv import load_dotenv
import boto3
import os

load_dotenv()

def upload_file(client):
    filename = 'src/services/burger.jpeg'
    bucket_name = 'agusprueba'
    key = 'media/burger.jpeg'
    client.upload_file(filename, bucket_name, key)
    print('File uploaded!')
    
if __name__ == "__main__":
    
    client = boto3.client("s3",
        aws_access_key_id=os.environ['ID_S3'],
        aws_secret_access_key=os.environ['KEY_S3'],
                          
    )
    upload_file(client)