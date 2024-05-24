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
    "help": "It looks like you need assistance. Can you specify whether it's about energy generated, energy consumed, or tokens generated?",
    "farewell": "Goodbye! I hope I was able to provide the assistance you needed.",
    "thank_you": "You're welcome! Is there anything else related to your energy tokenization needs that I can help with?",
    "kw": "I can help you with that. Are you interested in details about energy generation, consumption, or token generation?",
    "complaint": "I'm sorry to hear you're experiencing issues. Could you please provide more details so I can assist you effectively?",
    "delivery_status": "To check the status of your equipment or measurements, please provide me with the specific details or ID.",
    "payment_issue": "It seems there's an issue with token transactions. Could you provide more specifics so I can assist better?",
    "account_questions": "For account-related inquiries, please let me know what information you need or what issue you're facing.",
    "user_help": "If you need help navigating through the app sections like home, equipment status, measurements, or graphs, just ask!",
    "token":"To get information on energy generation, please specify the date range or equipment you're interested in",
    "energy_generation_info": "To get information on energy generation, please specify the date range or equipment you're interested in.",
    "energy_consumption_details": "For details on energy consumption, let me know the specific period or device you're querying.",
    "token_generation_query": "If you have questions about how tokens are generated from energy, feel free to ask for more details.",
    "transaction_fees": "The transaction fees on our network are set to ensure optimal operation and maintenance of the services. Would you like to know the specific fees for different transactions?",
    "corporate_crm_integration": "Our platform offers seamless integration with corporate CRM systems to streamline operations. Are you interested in learning how to integrate your CRM with our services?",
    "license_model": "We provide a flexible license model that allows microproducers to access our software at a competitive rate. Would you like more information on licensing options available in the Odoo appstore?",
    "sale_of_carbon_credits": "We facilitate the sale of carbon credits, enabling companies to mitigate their carbon footprint effectively. Are you looking to purchase or learn more about carbon credits?",
    "vara_network": "Vara Network is a blockchain-based infrastructure focused on enhancing energy distribution systems. It facilitates secure and efficient transactions, leveraging the power of smart contracts and decentralized governance.",
    "blockchain": "Blockchain is a system of recording information in a way that makes it difficult or impossible to change, hack, or cheat the system. It's essentially a digital ledger of transactions that is duplicated and distributed across the entire network of computer systems on the blockchain.",
    "gear_technologies": "Gear Technologies refers to the advanced tools and software designed to improve machinery and equipment performance, including smart monitoring systems and automated controls that can be integrated with blockchain for enhanced security and efficiency.",
    "smart_contracts": "Smart contracts are self-executing contracts with the terms of the agreement between buyer and seller being directly written into lines of code. They run on blockchain, which means they are executed automatically when certain conditions are met, without the need for a middleman.",
}

# Palabras clave para cada intención
INTENT_KEYWORDS = {
    "token": ["token", "tokenization", "energy", "Gaia token", "tokenized energy", "renewable token", "digital currency", "cryptocurrency"],
    "greeting": ["hello", "hi", "greetings", "welcome", "good day", "howdy"],
    "help_order": ["help", "assistance", "support", "guide", "aid", "facilitate", "advice", "service"],
    "farewell": ["goodbye", "bye", "see you", "farewell", "take care", "until next time"],
    "thank_you": ["thanks", "thank you", "appreciate", "grateful", "acknowledge"],
    "product_inquiry": ["information", "details", "inquiry", "data", "specs", "specifications"],
    "complaint": ["issue", "problem", "complaint", "trouble", "concern", "fault", "defect"],
    "delivery_status": ["status", "update", "progress", "tracking", "shipment", "delivery"],
    "payment_issue": ["payment", "transaction", "tokens", "billing", "invoice", "charges", "fees"],
    "account_questions": ["account", "registration", "login", "sign up", "profile", "membership"],
    "user_help": ["navigate", "use", "how to", "guide", "tutorial", "instructions"],
    "energy_generation_info": ["generation", "produce", "energy generated", "renewable sources", "solar", "wind", "power output"],
    "energy_consumption_details": ["consumption", "use", "energy consumed", "usage", "utilization", "efficiency"],
    "token_generation_query": ["tokens", "generate", "tokenization", "minting", "crypto assets", "digital tokens"],
    "transaction_fees": ["fees", "charges", "cost", "expense", "transaction cost"],
    "corporate_crm_integration": ["CRM", "integration", "business management", "customer relationship", "salesforce"],
    "license_model": ["license", "software", "use license", "subscription", "Odoo appstore"],
    "sale_of_carbon_credits": ["carbon credits", "carbon certificate", "CO2", "greenhouse gases", "emissions", "environmental credits"],
    "vara_network": ["vara", "network", "blockchain network"],
    "blockchain": ["blockchain", "chain", "blocks", "distributed ledger"],
    "gear_technologies": ["gear", "technologies", "gear tech", "innovation"],
    "smart_contracts": ["smart contracts", "contracts", "blockchain contracts", "self-executing"],
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