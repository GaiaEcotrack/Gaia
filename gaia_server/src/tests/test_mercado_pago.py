import pytest
from unittest.mock import patch, MagicMock
from application import application

@pytest.fixture
def client():
    application.config['TESTING'] = True
    with application.test_client() as client:
        yield client

@patch('mercadopago.SDK')
def test_crear_pago_success(mock_sdk, client):
    # Configurar el MagicMock para simular el objeto de preferencia y su método create
    mock_preference = MagicMock()
    mock_preference.create.return_value = {
        "response": {
            "id": "123456789",
            "init_point": "https://www.mercadopago.com/mla/checkout/start?pref_id=123456789",
            "sandbox_init_point": "https://sandbox.mercadopago.com/mla/checkout/start?pref_id=123456789"
        }
    }
    
    # Configurar el SDK simulado para devolver el objeto de preferencia simulado
    mock_sdk_instance = mock_sdk.return_value
    mock_sdk_instance.preference.return_value = mock_preference

    # Datos de ejemplo para crear la preferencia de pago
    item_data = {
        "title": "Producto Test",
        "quantity": 2,
        "unit_price": 100.00,
        "description": "Descripción del producto Test"
    }

    # Enviar solicitud POST a la ruta '/mercadopago/crearpago'
    response = client.post('/mercadopago/crearpago', json=item_data)
    
    # Verificar el código de estado y los datos de la respuesta
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['id'] == "123456789"
    assert 'init_point' in json_data
    assert 'sandbox_init_point' in json_data
    # Verificar que la función create del mock de preferencia fue llamada
    mock_preference.create.assert_called_once_with({
        "items": [
            {
                "title": item_data["title"],
                "quantity": item_data["quantity"],
                "unit_price": item_data["unit_price"],
                "currency_id": "USD",
                "description": item_data["description"]
            }
        ],
        "back_urls": {
            "success": "https://www.gaiaecotrack.com",
            "failure": "https://www.gaiaecotrack.com",
            "pending": "https://www.gaiaecotrack.com"
        },
        "auto_return": "approved",
    })
