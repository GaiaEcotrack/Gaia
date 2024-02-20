from flask import Blueprint, jsonify,request
import requests
import time
import hmac
import hashlib
from coinbase.wallet.client import Client

API_KEY = 'iDmn11Ml9Z18QAtN'
API_SECRET = 'GIIsvP3jvM6xodSXTUahOugoEBCnUoMl'

coinbase_route = Blueprint('coinbase', __name__)


# Esta función generará la firma para la autenticación
def generate_signature(timestamp, method, path_url, body=''):
    message = f'{timestamp}{method}{path_url}{body}'.encode('utf-8')
    signature = hmac.new(API_SECRET.encode(), message, hashlib.sha256).hexdigest()
    return signature

# Esta función realizará la autenticación para cada solicitud
def authenticate_request(request):
    timestamp = str(int(time.time()))
    method = request.method
    path_url = request.path
    body = request.data.decode('utf-8')
    signature = generate_signature(timestamp, method, path_url, body)
    
    # Actualiza los headers de la solicitud con la información de autenticación
    request.headers.update({
        'CB-ACCESS-SIGN': signature,
        'CB-ACCESS-TIMESTAMP': timestamp,
        'CB-ACCESS-KEY': API_KEY
    })


def fetch_data(url):
    response = requests.get(url)
    data = response.json()
    return data

def get_vara():
    url = 'https://api.coinbase.com/v2/prices/Vara-USD/sell'
    return fetch_data(url)

def get_btc():
    url = 'https://api.coinbase.com/v2/prices/BTC-USD/sell'
    return fetch_data(url)

def get_eth():
    url = 'https://api.coinbase.com/v2/prices/ETH-USD/sell'
    return fetch_data(url)

def get_dot():
    url = 'https://api.coinbase.com/v2/prices/DOT-USD/sell'
    return fetch_data(url)

@coinbase_route.route('/vara')
def vara_route():
    return jsonify(get_vara())

@coinbase_route.route('/btc')
def btc_route():
    return jsonify(get_btc())

@coinbase_route.route('/eth')
def eth_route():
    return jsonify(get_eth())

@coinbase_route.route('/dot')
def dot_route():
    return jsonify(get_dot())

@coinbase_route.route('/')
def get_all_info():
    all_data = {
        'vara': get_vara(),
        'btc': get_btc(),
        'eth': get_eth(),
        'dot': get_dot()
    }
    return jsonify(all_data)

@coinbase_route.route('/user')
def current_user():
    # Autenticar la solicitud
    client = Client(API_KEY, API_SECRET)

    user = client.get_accounts()
    
    # Devolver la respuesta como JSON
    return jsonify(user)
