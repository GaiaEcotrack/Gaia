# import pytest
# import pyotp
# import os
# import qrcode
# import base64
# import io
# from unittest.mock import patch, MagicMock
# from marshmallow import ValidationError
# from bson import ObjectId
# from src.routes.devices import devices_routes
# from src.models.user import UserSchema

# @pytest.fixture
# def client():
#     devices_routes.application.config['TESTING'] = True
#     with devices_routes.application.test_client() as client:
#         yield client
        
# @patch('src.routes.devices.pyotp.random_base32', return_value='fake_key')
# @patch('src.routes.devices.qrcode.make', return_value=qrcode.image.pil.PilImage.new('QRCODE', box_size=10, border=5))
# @patch('src.routes.devices.base64.b64encode', return_value=b'fake_qr_image_base64')
# @patch('src.routes.devices.collection.find_one', return_value={'_id': ObjectId('fake_user_id'), 'email': 'test@example.com'})
# @patch('src.routes.devices.UserSchema', return_value=UserSchema())
# def test_generate_key_and_qr(mock_userschema, mock_find_one, mock_base64, mock_qrcode, mock_random_base32, client):
#     # Set up mock UserSchema
#     mock_userschema.load.return_value = {'_id': ObjectId('fake_user_id'), 'email': 'test@example.com'}

#     # Set up test data
#     test_data = {'id': 'fake_user_id'}

#     # Call the route
#     response = client.post('/devices/generate_key', json=test_data)

#     # Check the response status code
#     assert response.status_code == 200

#     # Check the response JSON
#     expected_json = {
#         'message': 'Key and QR code generated successfully',
#         'user': {
#             '_id': 'fake_user_id',
#             'key_auth': 'fake_key',
#             'qr_image': 'fake_qr_image_base64'
#         }
#     }
#     assert response.get_json() == expected_json

#     # Check that the mocked functions were called with the correct arguments
#     mock_random_base32.assert_called_once()
#     mock_find_one.assert_called_once_with({'_id': ObjectId('fake_user_id')})
#     mock_userschema.load.assert_called_once_with({'_id': 'fake_user_id'})
#     mock_base64.assert_called_once_with(mock_qrcode.return_value.getvalue()).return_value.decode.assert_called_once()