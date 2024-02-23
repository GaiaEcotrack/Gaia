# routes.py
from flask import jsonify, request
from flask import Blueprint
import mercadopago

# Crear un Blueprint para organizar las rutas
mercadopago_route = Blueprint('mercadopago', __name__)

# Configurar MercadoPago
sdk  = mercadopago.SDK('TEST-3966790106439966-020716-c3a20a6a6e44c355d6ce2b2ea6e05969-273198687')

# Ruta para crear preferencia de pago
@mercadopago_route.route('/crearpago', methods=['POST'])
def crear_pago():
    # Obtener datos del ítem del cuerpo de la solicitud
    item_data = request.json

    # Crear la preferencia de pago
    preference_data = {
        "items": [
            {
                "title": item_data.get("title", "Mi producto"),
                "quantity": item_data.get("quantity", 1),
                "unit_price": item_data.get("unit_price", 75.76),
                "currency_id": "USD",
                "description": item_data.get("description")
            }
        ],
        "back_urls": {
			"success": "http://localhost:3000/payment",
			"failure": "http://localhost:3000/payment",
			"pending": "http://localhost:3000/payment"
		},
		"auto_return": "approved",
    }

    try:
        # Crear la preferencia de pago en MercadoPago
        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]

        # Devolver la preferencia de pago generada
        return jsonify(preference), 200
    except mercadopago.exceptions.MPException as e:
        # Manejar cualquier error del SDK de MercadoPago
        return jsonify({"error": str(e)}), 500