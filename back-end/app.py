from flask import Flask, jsonify
from flask_cors import CORS
import csv
import os

app = Flask(__name__)
CORS(app)  # Permettre les requêtes depuis React

@app.route('/api/config', methods=['GET'])
def get_config():
    # Retourner des données de configuration pour React
    return jsonify({
        "type": ["Type A", "Type B", "Type C"],
        "color": ["Red", "Green", "Blue"]
    })

@app.route('/api/formats', methods=['GET'])
def get_formats():
    formats = []
    
    if os.path.exists('formats.csv'):  # Vérifier si le fichier existe
        try:
            with open('formats.csv', newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                
                    # Nettoyer les données si nécessaire
                    formats.append(row)
            return jsonify(formats)
        except Exception as e:
            return jsonify({"error": f"Erreur lors de la lecture du fichier CSV: {str(e)}"}), 500
    else:
        return jsonify({"error": "Fichier CSV non trouvé"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)