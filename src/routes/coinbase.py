from flask import Blueprint, jsonify,request
import requests
import time
import hmac
import hashlib
from coinbase.wallet.client import Client
import jwt
from cryptography.hazmat.primitives import serialization
import secrets
import json
from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("API_KEY")
API_SECRET = os.getenv("API_SECRET")
SECRET_KEY = os.getenv("SECRET_KEY")
BASE_URL = os.getenv("BASE_URL")
GATE_IO_API_KEY = os.getenv("GATE_IO_API_KEY")
GATE_IO_API_SECRET_KEY = os.getenv("GATE_IO_API_SECRET_KEY")




coinbase_route = Blueprint('coinbase', __name__)
client = Client(API_KEY, API_SECRET)

key_name       = "organizations/{org_id}/apiKeys/{key_id}"
key_secret     = "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIN67jsO7TGSSA/Qs5deyKww4h19A2N+F44xyjLDyV5UnoAoGCCqGSM49\nAwEHoUQDQgAEWsX9bs2Cvee7TPGylRvRrFcoWqjUt8gL3pLa5Elqsw4vMU8s8Pxt\nL8bQScY+vP6ORYHWgSksG8oXEQs/Mp9XAA==\n-----END EC PRIVATE KEY-----\n"
request_method = "GET"
request_host   = "api.coinbase.com"
request_path   = "/api/v3/brokerage/accounts"
service_name   = "retail_rest_api_proxy"

def build_jwt(service, uri):
    private_key_bytes = key_secret.encode('utf-8')
    private_key = serialization.load_pem_private_key(private_key_bytes, password=None)
    jwt_payload = {
        'sub': key_name,
        'iss': "coinbase-cloud",
        'nbf': int(time.time()),
        'exp': int(time.time()) + 120,
        'aud': [service],
        'uri': uri,
    }
    jwt_token = jwt.encode(
        jwt_payload,
        private_key,
        algorithm='ES256',
        headers={'kid': key_name, 'nonce': secrets.token_hex()},
    )
    return jwt_token

@coinbase_route.route('/aut')
def auth():
    uri = f"{request_method} {request_host}{request_path}"
    jwt_token = build_jwt(service_name, uri)
    return jsonify({"JWT": jwt_token})


def fetch_data(url):
    response = requests.get(url)
    if response.ok:  # Verificar si la solicitud fue exitosa (código de estado HTTP 200)
        try:
            data = response.json()  # Intentar serializar la respuesta en JSON
            return data
        except json.decoder.JSONDecodeError:
            return {"error": "No se pudo decodificar la respuesta JSON"}
    else:
        return {"error": f"Error al obtener datos: {response.status_code} {response.reason}"}


def get_vara():
    url = 'https://api.coinbase.com/v2/prices/Vara-USD/sell'
    data = fetch_data(url)  # Usar fetch_data para obtener datos JSON
    return data

def get_btc():
    url = 'https://api.coinbase.com/v2/prices/BTC-USD/sell'
    data = fetch_data(url)
    return data

def get_eth():
    url = 'https://api.coinbase.com/v2/prices/ETH-USD/sell'
    data = fetch_data(url)
    return data

def get_dot():
    url = 'https://api.coinbase.com/v2/prices/DOT-USD/sell'
    data = fetch_data(url)
    return data

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

@coinbase_route.route('/user')
def current_user():
    # Autenticar la solicitud
    client = Client(API_KEY, API_SECRET)

    user = client.get_accounts()
    
    # Devolver la respuesta como JSON
    return jsonify(user)


@coinbase_route.route("/comprar")
def index():
    # Obtiene el precio actual de Bitcoin
    price = client.get_product_ticker("BTC-USD")["price"]

    # Renderiza la página con el precio actual
    return render_template("index.html", price=price)

@coinbase_route.route("/buy", methods=["POST"])
def buy():
    # Obtiene los datos del formulario
    amount = request.form.get("amount")
    price = request.form.get("price")

    # Crea una orden de compra
    order = client.place_order(
        product_id="BTC-USD",
        side="buy",
        price=price,
        amount=amount,
    )

    # Renderiza la página con el resultado de la orden
    return render_template("order.html", order=order)

@coinbase_route.route("/sell", methods=["POST"])
def sell():
    # Obtiene los datos del formulario
    amount = request.form.get("amount")
    price = request.form.get("price")

    # Crea una orden de venta
    order = client.place_order(
        product_id="BTC-USD",
        side="sell",
        price=price,
        amount=amount,
    )

    # Renderiza la página con el resultado de la orden
    return render_template("order.html", order=order)

@coinbase_route.route('/metodos_de_pago')
def obtener_metodos_de_pago():
    url = 'https://api.coinbase.com/v2/payment-methods'
    headers = {
        'Authorization': 'Bearer ' + API_KEY,
    }
    response = requests.get(url, headers=headers)
    data = response.json()
    return data


# Función para crear la firma de la solicitud
def generate_signature(timestamp, method, path, body=""):
    message = f"{timestamp}{method.upper()}{path}{body}"
    signature = hmac.new(SECRET_KEY.encode(), message.encode(), hashlib.sha256).hexdigest()
    return signature

# Ruta para realizar la solicitud a la API de Coinbase
@coinbase_route.route('/get_ticker', methods=['GET'])
def get_ticker():
    path = "/v3/brokerage/products"
    url = f"{BASE_URL}{path}"
    
    timestamp = str(int(time.time()))
    signature = generate_signature(timestamp, "GET", path)
    
    headers = {
        "CB-ACCESS-KEY": API_KEY,
        "CB-ACCESS-SIGN": signature,
        "CB-ACCESS-TIMESTAMP": timestamp
    }
    
    response = requests.get(url, headers=headers)
    data = response.json()
    
    return jsonify(data)

def gen_sign(method, url, query_string=None, payload_string=None):
    key = GATE_IO_API_KEY       # api_key gate io
    secret = GATE_IO_API_SECRET_KEY     # api_secret gateio

    t = time.time()
    m = hashlib.sha512()
    m.update((payload_string or "").encode('utf-8'))
    hashed_payload = m.hexdigest()
    s = '%s\n%s\n%s\n%s\n%s' % (method, url, query_string or "", hashed_payload, t)
    sign = hmac.new(secret.encode('utf-8'), s.encode('utf-8'), hashlib.sha512).hexdigest()
    return {'KEY': key, 'Timestamp': str(t), 'SIGN': sign}




@coinbase_route.route('/sell_vara', methods=['GET'])
def withdraw():
    host = "https://api.gateio.ws"
    prefix = "/api/v4"
    headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}

    url = '/withdrawals'
    query_param = ''
    body = '{"withdraw_order_id":"order_123456","currency":"VARA","address":"kGgN8aH6EWWiQFhHwTsaczDBTncPCsEJPGoyfKHM3ukohMoTW","amount":"20","memo":"","chain":"VARA"}'
    sign_headers = gen_sign('POST', prefix + url, query_param, body)
    headers.update(sign_headers)
    r = requests.post(host + prefix + url, headers=headers, data=body)
    return jsonify(r.json())

@coinbase_route.route('/vara_curries', methods=['GET'])
def get_base_volume():
    host = "https://api.gateio.ws"
    prefix = "/api/v4"
    headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
    url = '/spot/tickers'
    query_param = 'currency_pair=VARA_USDT'

    response = requests.get(host + prefix + url, headers=headers, params=query_param)
    ticker_data = response.json()

    if ticker_data:
        base_volume = ticker_data[0].get('base_volume')
        return base_volume
    else:
        return jsonify({"error": "No se encontraron datos para el par de monedas VARA_USDT"}), 404

@coinbase_route.route('/btc_curries', methods=['GET'])
def get_base_volume_btc():
    host = "https://api.gateio.ws"
    prefix = "/api/v4"
    headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
    url = '/spot/tickers'
    query_param = 'currency_pair=BTC_USDT'

    response = requests.get(host + prefix + url, headers=headers, params=query_param)
    ticker_data = response.json()

    if ticker_data:
        base_volume = ticker_data[0].get('base_volume')
        return base_volume
    else:
        return jsonify({"error": "No se encontraron datos para el par de monedas VARA_USDT"}), 404

@coinbase_route.route('/eth_curries', methods=['GET'])
def get_base_volume_eth():
    host = "https://api.gateio.ws"
    prefix = "/api/v4"
    headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
    url = '/spot/tickers'
    query_param = 'currency_pair=ETH_USDT'

    response = requests.get(host + prefix + url, headers=headers, params=query_param)
    ticker_data = response.json()

    if ticker_data:
        base_volume = ticker_data[0].get('base_volume')
        return base_volume
    else:
        return jsonify({"error": "No se encontraron datos para el par de monedas VARA_USDT"}), 404

@coinbase_route.route('/dot_curries', methods=['GET'])
def get_base_volume_dot():
    host = "https://api.gateio.ws"
    prefix = "/api/v4"
    headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
    url = '/spot/tickers'
    query_param = 'currency_pair=DOT_USDT'

    response = requests.get(host + prefix + url, headers=headers, params=query_param)
    ticker_data = response.json()

    if ticker_data:
        base_volume = ticker_data[0].get('base_volume')
        return base_volume
    else:
        return jsonify({"error": "No se encontraron datos para el par de monedas VARA_USDT"}), 404

@coinbase_route.route('/')
def get_all_info():
    all_data = {}
    
    try:
        # Obtener datos para VARA
        vara_data = get_vara()
        vara_volume = get_base_volume()
        all_data['vara'] = {'price': vara_data, 'vol': vara_volume}

        # Obtener datos para BTC
        btc_data = get_btc()
        btc_volume = get_base_volume_btc()
        all_data['btc'] = {'price': btc_data, 'vol': btc_volume}

        # Obtener datos para ETH
        eth_data = get_eth()
        eth_volume = get_base_volume_eth()
        all_data['eth'] = {'price': eth_data, 'vol': eth_volume}

        # Obtener datos para DOT
        dot_data = get_dot()
        dot_volume = get_base_volume_dot()
        all_data['dot'] = {'price': dot_data, 'vol': dot_volume}
        
        # Si todos los datos se obtuvieron correctamente, devolver la respuesta JSON
        return jsonify(all_data)
    
    except Exception as e:
        # Manejar cualquier error que pueda ocurrir durante la obtención de datos
        error_message = f"Error al obtener datos: {str(e)}"
        return jsonify({"error": error_message}), 500
