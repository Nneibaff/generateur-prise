from flask import Flask, jsonify
from flask_cors import CORS
import csv
import os

app = Flask(__name__)
CORS(app)  # Permettre les requêtes depuis React




@app.route('/api/formats', methods=['GET'])
def get_formats():
    formats = []
    
    if os.path.exists('formats.csv'): 
        try:
            with open('formats.csv', newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    formats.append(row) 
            return jsonify(formats)
        except Exception as e:
            return jsonify({"error": f"Erreur lors de la lecture du fichier CSV: {str(e)}"}), 500
    else:
        return jsonify({"error": "Fichier CSV non trouvé"}), 404


@app.route('/api/equipements', methods=['GET'])  
def get_equipements(): 
    equipements = []  

    if os.path.exists('equipements.csv'):  
        try:
            with open('equipements.csv', newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    equipements.append(row)
                return jsonify(equipements)
        except Exception as e:
            return jsonify({"error": f"Erreur lors de la lecture du fichier CSV: {str(e)}"}), 500
    else:
        return jsonify({"error": "Fichier CSV non trouvé"}), 404
    

@app.route('/api/finitions', methods=['GET'])
def get_finitions():
    finitions = []

    if os.path.exists('finitions.csv'):  
        try:
            with open('finitions.csv', newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    finitions.append(row)
            return jsonify(finitions)
        except Exception as e:
            return jsonify({"error": f"Erreur lors de la lecture du fichier CSV: {str(e)}"}), 500
    else:
        return jsonify({"error": "Fichier CSV non trouvé"}), 404
    


if __name__ == '__main__':
    app.run(debug=True, port=5000)