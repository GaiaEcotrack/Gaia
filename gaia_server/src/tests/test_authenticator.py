import pytest
from application import application
from bson import ObjectId

@pytest.fixture
def client():
    application.config['TESTING'] = True
    with application.test_client() as client:
        yield client

def test_generate_key_and_qr_route(client):
    # atento cuando borramos un user en la db, cambiar el test
    user_id = '660b1cf3d9ec6a06f44d3edc'
    response = client.post('/auth/generate_key', json={'id': user_id})

    # Verifico que el código de estado de la respuesta sea 200
    assert response.status_code == 200, "El código de estado esperado era 200"

    # verifico que la respuesta contenga las claves esperadas
    data = response.get_json()
    assert 'message' in data, "La respuesta debe contener un mensaje"
    assert 'user' in data, "La respuesta debe contener información del usuario"
    assert 'qr_image' in data['user'], "La información del usuario debe incluir el código QR"

    # Verifica que la clave 'key_auth' exista y no esté vacía
    assert data['user']['key_auth'], "La clave 'key_auth' no debe estar vacía"



