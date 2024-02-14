import pytest
from application import application
from src.routes.users import users_route

# testear con mock, no db desarrollo
from unittest.mock import patch
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

    valid_id = '65c64cd2e2f234746d155f7d'
    response = client.get(f'/users/{valid_id}')
    assert response.status_code == 200
    assert 'email' in response.get_json()
    
# Función para mockear la inserción en la base de datos 
##! NO testear en la DB de desarrollo

def mock_insert_one(new_user):
    class InsertOneResult:
        def __init__(self, inserted_id):
            self.inserted_id = inserted_id
   
    return InsertOneResult('abc123')

# Test para la ruta POST /
@patch('src.routes.users.collection.insert_one', side_effect=mock_insert_one)
def test_add_user(mock_insert, client):
    # Datos del usuario para agregar
    user_data = {
        "email": "PYTEST@example.com",
        "full_name": "PYTEST",
        "identification_number": "1234567890",
        "address": "PYTESTSt.",
        "phone": "555-5555",
        "identity_document": "PYTEST",
        "bank_account_status": "Active",
        "tax_declarations": "PYTEST",
        "other_financial_documents": "PYTEST",
        "credentials": "PYTEST",
        "secret_key": "PYTEST",
        "devices": []
    }
    
   
    response = client.post('/users/', data=json.dumps(user_data), content_type='application/json')
    

    assert response.status_code == 200

    assert response.get_json()['message'] == 'Usuario agregado con éxito'

    assert response.get_json()['user_id'] == 'abc123'
    # Verificar si la función mock fue llamada
    mock_insert.assert_called_once()
 
 
 # PUT test   
@patch('src.routes.users.collection.update_one')
def test_update_user(mock_update, client):
    test_id = ObjectId()  
    user_update_data = {
        "email": "updated@example.com",
        "full_name": "Updated Name",

    }
    # Simular un resultado exitoso de la operación de actualización
    mock_update.return_value.matched_count = 1


    response = client.put(f'/users/{str(test_id)}', data=json.dumps(user_update_data), content_type='application/json')

# verificar respuestas:
    assert response.status_code == 200

    assert response.get_json()['message'] == 'Usuario actualizado con éxito'

    mock_update.assert_called_once_with({'_id': test_id}, {'$set': user_update_data})
    
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