import pytest
from unittest.mock import patch, MagicMock
from application import application
from bson import ObjectId
import json
from src.routes.devices import devices_routes

@pytest.fixture
def client():
    application.config['TESTING'] = True
    with application.test_client() as client:
        yield client

    ##! para los metodo POST y PUT 
def mock_update_one_success(*args, **kwargs):
    return MagicMock(modified_count=1)

def mock_insert_one_success(*args, **kwargs):
    return MagicMock(inserted_id=ObjectId()) 

# Simulación de la función autorizar para devolver un token falso
def mock_autorizar():
    response_flask = MagicMock()
    response_flask.get_json.return_value = {'token': 'fake_token'}
    return (response_flask, 200)

##! TESTS GETs
# Test para la ruta GET /devices/device-data con un deviceId válido y autorización exitosa
@patch('src.routes.devices.autorizar', side_effect=mock_autorizar)
@patch('requests.get')
def test_get_device_data_success(requests_get_mock, autorizar_mock, client):
    # Configura el mock de requests.get para simular una respuesta exitosa de la API externa
    fake_device_data = {'deviceId': '123', 'data': 'device_info'}
    requests_get_mock.return_value = MagicMock(status_code=200, json=lambda: fake_device_data)

    # Realiza la solicitud GET con un deviceId, incluyendo el prefijo /devices
    response = client.get('/devices/device-data?deviceId=123')

    # Verifica que la respuesta sea exitosa y los datos devueltos sean correctos
    assert response.status_code == 200
    assert response.get_json() == fake_device_data

    # Verifica que autorizar y requests.get fueron llamados correctamente
    autorizar_mock.assert_called_once()
    requests_get_mock.assert_called_once_with('https://sandbox.smaapis.de/monitoring/v1/devices/123', headers={'Authorization': 'Bearer fake_token'})

# Test para la ruta GET /devices/device-data sin proporcionar deviceId
def test_get_device_data_no_device_id(client):
    # Incluye el prefijo /devices en la URL
    response = client.get('/devices/device-data')
    assert response.status_code == 400
    assert response.get_json() == {'error': 'Falta el parámetro necesario (deviceId)'}

# Test para la ruta GET /devices/device-data cuando la autorización falla
@patch('src.routes.devices.autorizar', return_value=(MagicMock(), 401))
def test_get_device_data_auth_failure(autorizar_mock, client):
    # Incluye el prefijo /devices en la URL
    response = client.get('/devices/device-data?deviceId=123')
    assert response.status_code == 401
    assert 'No se pudo obtener el token de acceso' in response.get_json()['error']

########################################################################################################
# Test para la ruta GET /devices/battery con parámetros válidos y autorización exitosa
@patch('src.routes.devices.autorizar', side_effect=mock_autorizar)
@patch('requests.get')
def test_get_device_measurements_battery_success(requests_get_mock, autorizar_mock, client):
    # Configura el mock de requests.get para simular una respuesta exitosa de la API externa
    fake_battery_data = {'measurement': 'battery_info'}
    requests_get_mock.return_value = MagicMock(status_code=200, json=lambda: fake_battery_data)

    # Realiza la solicitud GET con parámetros válidos
    response = client.get('/devices/battery?deviceId=device123&setType=type123&period=Day&Date=2021-01-01')

    # Verifica que la respuesta sea exitosa y los datos devueltos sean correctos
    assert response.status_code == 200
    assert response.get_json() == fake_battery_data

    # Verifica que autorizar y requests.get fueron llamados correctamente
    autorizar_mock.assert_called_once()
    requests_get_mock.assert_called_once_with('https://sandbox.smaapis.de/monitoring/v1/devices/device123/measurements/sets/type123/Day?Date=2021-01-01', headers={'Authorization': 'Bearer fake_token'})

# Test para la ruta GET /devices/battery cuando faltan parámetros
def test_get_device_measurements_battery_missing_params(client):

    response = client.get('/devices/battery')

    # Verificar que la respuesta indique que faltan parámetros
    assert response.status_code == 400
    assert 'Faltan parámetros necesarios' in response.get_json()['error']

# Test para la ruta GET /devices/battery cuando la autorización falla
@patch('src.routes.devices.autorizar', return_value=(MagicMock(), 401))
def test_get_device_measurements_battery_auth_failure(autorizar_mock, client):
    # Realiza la solicitud GET con parámetros válidos pero la autorización falla
    response = client.get('/devices/battery?deviceId=device123&setType=type123&period=Day&Date=2021-01-01')

    # Verificar que la respuesta sea un error de autorización
    assert response.status_code == 401
    assert 'No se pudo obtener el token de acceso' in response.get_json()['error']

# Test para la ruta GET /devices/pv con parámetros válidos y autorización exitosa
@patch('src.routes.devices.autorizar', side_effect=mock_autorizar)
@patch('requests.get')
def test_get_device_measurements_pv_success(requests_get_mock, autorizar_mock, client):
    # Configura el mock de requests.get para simular una respuesta exitosa de la API externa
    fake_pv_data = {'measurement': 'pv_info'}
    requests_get_mock.return_value = MagicMock(status_code=200, json=lambda: fake_pv_data)

    # Realiza la solicitud GET con parámetros válidos
    response = client.get('/devices/pv?deviceId=device123&setType=type123&period=Day&Date=2021-01-01')

    # Verifica que la respuesta sea exitosa y los datos devueltos sean correctos
    assert response.status_code == 200
    assert response.get_json() == fake_pv_data

    # Verifica que autorizar y requests.get fueron llamados correctamente
    autorizar_mock.assert_called_once()
    requests_get_mock.assert_called_once_with('https://sandbox.smaapis.de/monitoring/v1/devices/device123/measurements/sets/type123/Day?Date=2021-01-01', headers={'Authorization': 'Bearer fake_token'})

# Test para la ruta GET /devices/pv cuando faltan parámetros
def test_get_device_measurements_pv_missing_params(client):
    # Realiza la solicitud GET sin los parámetros necesarios
    response = client.get('/devices/pv')

    # Verifica que la respuesta indique que faltan parámetros
    assert response.status_code == 400
    assert 'Faltan parámetros necesarios' in response.get_json()['error']

# Test para la ruta GET /devices/pv cuando la autorización falla
@patch('src.routes.devices.autorizar', return_value=(MagicMock(), 401))
def test_get_device_measurements_pv_auth_failure(autorizar_mock, client):
    # Realiza la solicitud GET con parámetros válidos pero la autorización falla
    response = client.get('/devices/pv?deviceId=device123&setType=type123&period=Day&Date=2021-01-01')

    # Verifica que la respuesta sea un error de autorización
    assert response.status_code == 401
    assert 'No se pudo obtener el token de acceso' in response.get_json()['error']
    
##! Test para POST devices
  
@patch('src.routes.devices.collection.update_one', side_effect=mock_update_one_success)
@patch('src.routes.devices.devices.insert_one', side_effect=mock_insert_one_success)
def test_add_device_to_user_success(mock_insert_one, mock_update_one, client):
    # Datos de prueba para enviar en la petición POST
    payload = {
        'user_id': str(ObjectId()),  # Genera un ObjectId para simular un user_id
        'device': {
            'deviceId': 'device123',
            'deviceName': 'Sensor de Temperatura',
            'deviceTimezone': 'GMT-5',
            'serial': 'SN123456789',
            'image': 'http://example.com/device123.jpg'
        },
        'plant': {
            'plantId': 'plant456',
            'plantName': 'Rosa',
            'plantTimezone': 'GMT-5',
            'description': 'Rosa roja, requiere cuidados moderados y mucha luz solar.'
        },
        'sets': {
            'wateringSchedule': '08:00, 20:00',
            'lightExposure': 'high',
            'humidityLevel': 'medium'
        }
    }

    # Realiza la petición POST a la ruta
    response = client.post('/devices/', json=payload)  # Asegúrate de que la ruta coincida con la definición de tu Flask app

    # Verifica la respuesta
    assert response.status_code == 200
    assert response.get_json()['message'] == 'Dispositivo creado y agregado correctamente'

    # Verifica que los mocks fueron llamados correctamente
    mock_update_one.assert_called_once()
    mock_insert_one.assert_called_once()