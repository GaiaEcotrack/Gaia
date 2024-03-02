from flask import Flask, Blueprint, render_template, request, json, jsonify
import spacy
# from src.routes.chatbox import chatbox_route

application = Flask(__name__)

chatbox_route = Blueprint('chatbox_route', __name__, template_folder='templates')

nlp = spacy.load("en_core_web_sm")

@chatbox_route.route('/', methods = ['GET'])
def chatbox():
    return render_template('chatbox.html')

@chatbox_route.route('/', methods = ['POST'])
def chatbot():
    if request.is_json:
        data = request.json
        if 'message' in data:
            user_message = data['message']
            bot_response = process_text(user_message)
            return jsonify({"response": bot_response})
        else:
            return jsonify({"error": "Message not found in request body"}), 400
    else:
        return jsonify({"error": "Request content type must be application/json"}), 400
# Intenciones y respuestas
RESPONSE = {
    "greeting": "Hello, how can I assist you today?",
    "help_order": "It looks like you need assistance. Can you specify whether it's about energy generated, energy consumed, or tokens generated?",
    "farewell": "Goodbye! I hope I was able to provide the assistance you needed.",
    "thank_you": "You're welcome! Is there anything else related to your energy tokenization needs that I can help with?",
    "product_inquiry": "I can help you with that. Are you interested in details about energy generation, consumption, or token generation?",
    "complaint": "I'm sorry to hear you're experiencing issues. Could you please provide more details so I can assist you effectively?",
    "delivery_status": "To check the status of your equipment or measurements, please provide me with the specific details or ID.",
    "payment_issue": "It seems there's an issue with token transactions. Could you provide more specifics so I can assist better?",
    "account_questions": "For account-related inquiries, please let me know what information you need or what issue you're facing.",
    "user_help": "If you need help navigating through the app sections like home, equipment status, measurements, or graphs, just ask!",
    "token":"To get information on energy generation, please specify the date range or equipment you're interested in",
    "energy_generation_info": "To get information on energy generation, please specify the date range or equipment you're interested in.",
    "energy_consumption_details": "For details on energy consumption, let me know the specific period or device you're querying.",
    "token_generation_query": "If you have questions about how tokens are generated from energy, feel free to ask for more details."
}

# Palabras clave para cada intención
INTENT_KEYWORDS = {
    "token": ["token", "tokenization", "energy"],
    "greeting": ["hello", "hi", "greetings"],
    "help_order": ["help", "assistance", "support"],
    "farewell": ["goodbye", "bye", "see you"],
    "thank_you": ["thanks", "thank you", "appreciate"],
    "product_inquiry": ["information", "details", "inquiry"],
    "complaint": ["issue", "problem", "complaint"],
    "delivery_status": ["status", "update", "progress"],
    "payment_issue": ["payment", "transaction", "tokens"],
    "account_questions": ["account", "registration", "login"],
    "user_help": ["navigate", "use", "how to"],
    "energy_generation_info": ["generation", "produce", "energy generated"],
    "energy_consumption_details": ["consumption", "use", "energy consumed"],
    "token_generation_query": ["tokens", "generate", "tokenization"]
}

def get_intent(text):
    doc = nlp(text.lower())
    for token in doc:
        for intent, keywords in INTENT_KEYWORDS.items():
            if token.lemma_ in [keyword.lower() for keyword in keywords]:  # Compara lemas y maneja mayúsculas y minúsculas
                return intent
    return "unknown"

def process_text(text):
    intent = get_intent(text)
    return RESPONSE.get(intent, 'Im sorry im not trained to anwser that')

# user_input = "Hello"
# response = process_text(user_input)
# print("Bot: ", response)

# while True:
#     user_input = input("You: ")
#     if user_input.lower() in ["salir", "exit"]:
#         print('Bot: Hasta luego!')
#         break
#     if not user_input.strip():
#         print('Bot: Parece que no has ingresado nada. Puedes intentar de nuevo?')
#         continue
#     response = process_text(user_input)
#     print('Bot: ', response)