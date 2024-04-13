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
    
    "greeting_other": "Hey there! How can I assist you today?",
    "greeting_how_are_you": "I'm doing well, thank you! How can I help you?",
    "greeting_how_is_your_day": "My day is going great, thanks for asking! How can I assist you?",
    "greeting_who_are_you": "I'm ChatBot Gaia a virtual assistant here to help you with your queries. How can I help you today?",
    "greeting_what_are_you_doing": "I'm here to assist you with any questions or tasks you have. How can I help you?",
    "greeting_other_responses": "Hey there! How can I assist you today?",
    
    "account_definition": "In cryptocurrency systems, a user is represented by an account that has an address(es) with specific balances associated with their address. Besides that, an account can contain additional details such as contact information, eligibility for rewards, and more.",
    "actor_definition": "A computational entity that, in response to a message it receives, can concurrently: send a finite number of messages to other actors; create a finite number of new actors; designate the behavior to be used for the next message it receives.",
    "actor_model_definition": "The principle of the Actor model approach for communication is that programs never share any state and just exchange messages between each other.",
    "blockchain_definition": "A blockchain is a decentralized and distributed system of recording information in ways that make it almost impossible to change, hack or manipulate.",
    "block_definition": "A data structure in the blockchain database, where transaction data in a cryptocurrency blockchain are permanently recorded. A block records some or all of the most recent transactions not yet validated by the network. Once the data is validated, the block is closed.",
    "block_height_definition": "A number of blocks preceding it in the blockchain.",
    "block_hash_definition": "A unique hash of the block that is aimed to maintain the integrity of the data stored in the block.",
    "bridges_definition": "Bridges are ways for two economically sovereign blockchains to communicate with each other.",
    "collators_definition": "Collators maintain parachains by collecting parachain transactions from users and producing state transition proofs for Relay Chain validators.",
    "dapp_definition": "A Decentralized Application, or dApp for short, is an application that can operate autonomously, typically through the use of smart contracts, that runs on a blockchain network.",
    "dao_definition": "A Decentralized Autonomous Organization, or DAO for short, is an organization that’s represented by rules encoded in a smart contract that is transparent and controlled by the organization members instead of being influenced by central entities.",
    "defi_definition": "Decentralized Finance, or DeFi for short, are financial services that are powered by decentralized applications and blockchain technology.",
    "layer_0_definition": "The ground floor for all blockchain protocols.",
    "layer_1_definition": "A term used to describe the underlying main blockchain architecture.",
    "layer_2_definition": "A secondary framework or protocol that is built on top of an existing blockchain system.",
    "ledger_definition": "A list of entries containing transactions signed by account owners. A blockchain is a type of distributed ledger.",
    "memory_parallelism_definition": "Memory-level parallelism is a term in computer architecture referring to the ability to have pending multiple memory operations.",
    "node_definition": "A computer device that runs on a blockchain network for message processing; it can also be a validator (block producer).",
    "nft_definition": "A Non-Fungible Token is a unique unit of data that’s represented as a cryptographic token that’s stored on a blockchain.",
    "parachain_definition": "Parachains are application specific data structures that are integrated into the Polkadot and Kusama networks.",
    "polkadot_definition": "Polkadot is an open-source blockchain network that is aiming to enable cross-chain communication between different blockchain networks.",
    "relay_chain_definition": "The Relay Chain is the central chain of the Polkadot network.",
    "rust_definition": "A multi-paradigm, general-purpose programming language designed for performance and safety.",
    "sharding_definition": "Sharding is the process of dividing a blockchain’s database into smaller “shards” to spread the transactional load.",
    "smart_contracts_definition": "A smart contract is a transactional computer program that can execute transactions automatically once certain conditions have been met.",
    "substrate_definition": "Substrate is the modular framework for building customized blockchains and the foundation for the whole DotSama ecosystem.",
    "transaction_definition": "A record in a digital ledger that represents an atomic event in a blockchain.",
    "validator_definition": "A node that verifies transactions on a blockchain and produces blocks.",
    "wallet_definition": "A blockchain wallet is an application that allows users to store and manage their cryptocurrencies.",
    "web3_definition": "Web3 is the third evolution of the internet that is heavily supported by blockchain technology and decentralized applications.",
    "wasm_definition": "WebAssembly is a way to run applications in programming languages other than JavaScript as web pages.",
    
    

}

# Palabras clave para cada intención
INTENT_KEYWORDS = {
    "token": ["token", "tokenization", "energy", "Gaia_token", "tokenized_energy", "renewable_token", "digital_currency", "cryptocurrency"],
    "greeting": ["hello", "hi", "greetings", "welcome", "good_day", "howdy"],
    "help_order": ["help", "assistance", "support", "guide", "aid", "facilitate", "advice", "service"],
    "farewell": ["goodbye", "bye", "see_you", "farewell", "take_care", "until_next_time"],
    "thank_you": ["thanks", "thank_you", "appreciate", "grateful", "acknowledge"],
    "product_inquiry": ["information", "details", "inquiry", "data", "specs", "specifications"],
    "complaint": ["issue", "problem", "complaint", "trouble", "concern", "fault", "defect"],
    "delivery_status": ["status", "update", "progress", "tracking", "shipment", "delivery"],
    "payment_issue": ["payment", "transaction", "tokens", "billing", "invoice", "charges", "fees"],
    "account_questions": ["account", "registration", "login", "sign_up", "profile", "membership"],
    "user_help": ["navigate", "use", "how_to", "guide", "tutorial", "instructions"],
    "energy_generation_info": ["generation", "produce", "energy_generated", "renewable_sources", "solar", "wind", "power_output"],
    "energy_consumption_details": ["consumption", "use", "energy_consumed", "usage", "utilization", "efficiency"],
    "token_generation_query": ["tokens", "generate", "tokenization", "minting", "crypto_assets", "digital_tokens"],
    "transaction_fees": ["fees", "charges", "cost", "expense", "transaction_cost"],
    "corporate_crm_integration": ["CRM", "integration", "business_management", "customer_relationship", "salesforce"],
    "license_model": ["license", "software", "use_license", "subscription", "Odoo_appstore"],
    "sale_of_carbon_credits": ["carbon_credits", "carbon_certificate", "CO2", "greenhouse_gases", "emissions", "environmental_credits"],
    "vara_network": ["vara", "network", "blockchain_network"],
    "blockchain": ["blockchain", "chain", "blocks", "distributed_ledger"],
    "gear_technologies": ["gear", "technologies", "gear_tech", "innovation"],
    "smart_contracts": ["smart_contracts", "contracts", "blockchain_contracts", "self-executing"],
    
    "greeting_other": ["hey", "what's_up", "nice_to_meet_you", "how_are_you", "long_time_no_see"],
    "greeting_how_are_you": ["how_are_you", "how's_it_going", "what's_new"],
    "greeting_how_is_your_day": ["how's_your_day", "how's_your_day_going"],
    "greeting_who_are_you": ["who_are_you", "what's_your_name", "introduce_yourself"],
    "greeting_what_are_you_doing": ["what_are_you_doing", "what_do_you_do"],
    
    "account_definition": ["account", "user", "address", "balances", "contact_information", "eligibility", "rewards"],
    "actor_definition": ["computational_entity", "message", "actors", "behavior"],
    "actor_model_definition": ["Actor_model", "communication", "programs", "state", "exchange", "messages"],
    "blockchain_definition": ["blockchain", "decentralized", "distributed_system", "recording_information", "impossible_to_change", "hack", "manipulate"],
    "block_definition": ["block", "data_structure", "blockchain_database", "transaction_data", "permanently_recorded", "validated", "closed"],
    "block_height_definition": ["block_height", "preceding_blocks", "blockchain"],
    "block_hash_definition": ["block_hash", "unique_hash", "integrity", "data_stored"],
    "bridges_definition": ["bridges", "economically_sovereign_blockchains", "communicate"],
    "collators_definition": ["collators", "parachains", "collecting", "producing", "state_transition_proofs", "Relay_Chain_validators"],
    "dapp_definition": ["Decentralized_Application", "dApp", "autonomously", "smart_contracts", "blockchain_network"],
    "dao_definition": ["Decentralized_Autonomous_Organization", "DAO", "organization", "rules", "smart_contract", "transparent", "controlled"],
    "defi_definition": ["Decentralized_Finance", "DeFi", "financial_services", "powered", "decentralized_applications", "blockchain_technology"],
    "layer_0_definition": ["Layer-0_protocol", "blockchain_protocols"],
    "layer_1_definition": ["Layer-1_blockchain_protocol", "underlying_main_blockchain_architecture", "solutions", "consensus_protocol", "sharding"],
    "layer_2_definition": ["Layer-2_blockchain_protocol", "secondary_framework", "existing_blockchain_system", "transaction_speed", "scaling_difficulties"],
    "ledger_definition": ["ledger", "entries", "transactions", "account_owners", "distributed_ledger"],
    "memory_parallelism_definition": ["memory_parallelism", "computer_architecture", "pending", "memory_operations"],
    "node_definition": ["node", "computer_device", "blockchain_network", "message_processing", "validator"],
    "nft_definition": ["Non-Fungible_Token", "NFT", "unique_unit_of_data", "cryptographic_token", "stored", "blockchain"],
    "parachain_definition": ["parachain", "application_specific_data_structures", "Polkadot", "Kusama_networks"],
    "polkadot_definition": ["Polkadot", "open-source_blockchain_network", "cross-chain_communication", "blockchain_networks"],
    "relay_chain_definition": ["Relay_Chain", "central_chain", "Polkadot_network", "shared_security", "consensus", "transaction_settlements"],
    "rust_definition": ["Rust", "programming_language", "performance", "safety", "concurrency"],
    "sharding_definition": ["sharding", "dividing", "blockchain’s_database", "smaller_shards", "spread", "transactional_load"],
    "smart_contracts_definition": ["smart_contracts", "transactional_computer_program", "execute_transactions", "automatic_execution", "conditions"],
    "substrate_definition": ["Substrate", "modular_framework", "customized_blockchains", "DotSama_ecosystem"],
    "transaction_definition": ["transaction", "digital_ledger", "atomic_event", "blockchain", "Gear_Protocol"],
    "validator_definition": ["validator", "verifies_transactions", "blockchain", "produces_blocks"],
    "wallet_definition": ["wallet", "blockchain_wallet", "store", "manage", "cryptocurrencies"],
    "web3_definition": ["Web3", "third_evolution_of_the_internet", "blockchain_technology", "decentralized_applications"],
    "wasm_definition": ["WebAssembly", "applications", "programming_languages", "JavaScript", "web_pages"],
    
    
    
    
}

def get_intent(text):
    doc = nlp(text.lower())
    for token in doc:
        for intent, keywords in INTENT_KEYWORDS.items():
            # Comprueba si el token es una palabra clave o si está contenido en una palabra clave
            if token.lemma_ in [keyword.lower() for keyword in keywords] or token.text.lower() in [keyword.lower() for keyword in keywords]:
                return intent
    return "unknown"

def process_text(text):
    intent = get_intent(text)
    if intent != "unknown":
        return RESPONSE.get(intent, 'Im sorry im not trained to anwser that')
    else:
        return 'Im sorry im not trained to anwser that'

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