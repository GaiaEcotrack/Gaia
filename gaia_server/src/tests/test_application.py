# import sys
# sys.path.insert(0, "/Users/agustinnazer/Desktop/vara-energy/Gaia/gaia_server")

import pytest

from application import application


@pytest.fixture
def client():
    application.config['TESTING'] = True
    with application.test_client() as client:
        yield client
        
    
def test_welcome_server(client):
    rv = client.get('/')
    json_data = rv.get_json()
    assert rv.status_code == 200
    assert json_data['message'] == 'Welcome to the Gaia Server!'