import pytest
from application import application
from src.routes.users import users_route

# testear con mock, no db desarrollo
from unittest.mock import patch,MagicMock
import json
from bson import ObjectId

@pytest.fixture
def client():
    application.config['TESTING'] = True
    with application.test_client() as client:
        yield client

# test GET 
def test_get_users(client):
    response = client.get('/users/')
    assert response.status_code == 200
    assert 'users' in response.get_json()

# test GET by Id
def test_get_user_by_id(client):
    valid_id = '660b1cf3d9ec6a06f44d3edc'
    response = client.get(f'/users/{valid_id}')
    assert response.status_code == 200
    json_data = response.get_json()
    assert 'user' in json_data  # Verifica que el objeto 'user' esté en la respuesta
    assert 'email' in json_data['user']
    
# Función para mockear la inserción en la base de datos 
##! NO testear en la DB de desarrollo

# Mock insert_one ajustado para devolver un resultado simulado con inserted_id
def mock_insert_one(new_user):
    return MagicMock(inserted_id=ObjectId())

# Ajustar las pruebas para utilizar los mocks y verificar las operaciones de manera adecuada
@patch('src.routes.users.collection.find_one', return_value=None)
@patch('src.routes.users.collection.insert_one')
def test_add_user(mock_insert_one, mock_find_one, client):
    user_data = {
        "email": "PYTEST@example.com",
        "full_name": "PYTEST",
        "identification_number": "1234567890",
        "address": "PYTEST St.",
        "phone": "555-5555",
        "identity_document": "PYTESTDoc",
        "bank_account_status": "Active",
        "tax_declarations": "PYTESTDec",
        "other_financial_documents": "PYTESTDocs",
        "credentials": "PYTESTCreds",
        "secret_key": "PYTESTKey",
        "devices": [],
        "membresia": False,
        "key_auth": "falseerwerkey546"
    }

    
    response = client.post('/users/', json=user_data)

    # Diagnóstico: imprimir el cuerpo de la respuesta para entender el error
    print(response.data)  # Para respuestas binarias o de texto
    # O si esperas una respuesta JSON:
    try:
        response_json = response.get_json()
        print(json.dumps(response_json, indent=4))
    except Exception as e:
        print(f"Error al intentar imprimir la respuesta JSON: {e}")

    # Asegurarte de que mock_insert_one ha sido llamado (opcional)
    mock_insert_one.assert_called_once()

    # Verificación final: el código de estado de la respuesta debería ser 200
    assert response.status_code == 200, "El código de estado esperado era 200, pero se obtuvo: {}".format(response.status_code)
    
# DELETE test
# Función para mockear la eliminación en la base de datos
##! no DB desarrollo
def mock_delete_one(query):
    class DeleteResult:
        def __init__(self, deleted_count):
            self.deleted_count = deleted_count

    # Simula que el usuario fue encontrado y eliminado
    if query['_id'] == ObjectId('5f8d0d55b54764421b7156d3'):
        return DeleteResult(1)
    # Simula que el usuario no fue encontrado
    return DeleteResult(0)

# Test para la ruta DELETE /<id>
@patch('src.routes.users.collection.delete_one', side_effect=mock_delete_one)
def test_delete_user(mock_delete, client):
    # eliminar por id
    valid_id = '5f8d0d55b54764421b7156d3'
    response = client.delete(f'/users/{valid_id}')

    assert response.status_code == 200
    assert response.get_json()['message'] == 'Usuario eliminado con éxito'
    mock_delete.assert_called_once()

    # Prueba con un ID inválido
    invalid_id = 'invalid_id'
    response = client.delete(f'/users/{invalid_id}')

    assert response.status_code == 400
    assert response.get_json()['message'] == 'ID inválido'
    
# Test GET by email
# Función para mockear la búsqueda en la base de datos
def mock_find_one(query):
    # Simula que el usuario fue encontrado
    if query['email'] == "user@example.com":
        return {
            "_id": ObjectId("5f8d0d55b54764421b7156d3"),
            "email": "user@example.com",
            "name": "Test User"
        }
    # Simula que el usuario no fue encontrado
    return None

# Test para la ruta GET /search
@patch('src.routes.users.collection.find_one', side_effect=mock_find_one)
def test_get_user_by_email(mock_find, client):
    valid_email = 'user@example.com'
    response = client.get(f'/users/search?email={valid_email}')

    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['email'] == valid_email
    assert 'Test User' == json_data['name']
    mock_find.assert_called_once_with({'email': valid_email})

    # Prueba con un email no proporcionado
    response = client.get('/users/search')
    assert response.status_code == 400
    assert response.get_json()['message'] == 'Parámetro "email" no proporcionado'

    # Prueba con un email que no corresponde a ningún usuario
    invalid_email = 'notfound@example.com'
    response = client.get(f'/users/search?email={invalid_email}')
    assert response.status_code == 404
    assert response.get_json()['message'] == 'Usuario no encontrado'