from flask import Flask, jsonify, Blueprint
import requests


app = Flask(__name__)

api_growatt_bp = Blueprint('api_growatt', __name__)


API_BASE_URL = "http://test.growatt.com/v1"


API_TOKEN = '6eb6f069523055a339d71e5b1f6c88cc'

@app.route('/power_stations', methods=['GET'])
def get_power_stations():

    params = {
        'C_user_id': 1,
        'search_type': "PlantName",
        'search_keyword': "test",
        'page': 1,
        'perpage': 10
    }
    

    response = requests.get(f"{API_BASE_URL}/plant/list", headers={'token': API_TOKEN}, params=params)
    
 # Check if the request was successful
    if response.ok:
        print(response.json())
        return jsonify(response.json())
    else:
        print(response.text)
        return jsonify(response.text), response.status_code
    

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
