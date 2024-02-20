import pytest
from unittest.mock import patch, MagicMock
from application import application
from src.routes.devices import devices_routes

@pytest.fixture
def client():
    application.config['TESTING'] = True
    with application.test_client() as client:
        yield client

# Simulación de la función autorizar para devolver un token falso
def mock_autorizar():
    response_flask = MagicMock()
    response_flask.get_json.return_value = {'token': 'fake_token'}
    return (response_flask, 200)

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
# plasnt devices test
