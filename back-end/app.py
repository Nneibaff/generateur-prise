import pandas as pd
import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permettre les requêtes depuis React

@app.route('/api/modeles', methods=['GET'])
def get_modeles():
    if os.path.exists('modeles.csv'):
        try:
            modeles = pd.read_csv('modeles.csv').to_dict(orient='records')
            return jsonify(modeles)
        except Exception as e:
            return jsonify({"error": f"Erreur lors de la lecture du fichier CSV: {str(e)}"}), 500
    else:
        return jsonify({"error": "Fichier CSV non trouvé"}), 404

@app.route('/api/formats', methods=['GET'])
def get_formats():
    if os.path.exists('formats.csv'):
        try:
            formats = pd.read_csv('formats.csv').to_dict(orient='records')
            return jsonify(formats)
        except Exception as e:
            return jsonify({"error": f"Erreur lors de la lecture du fichier CSV: {str(e)}"}), 500
    else:
        return jsonify({"error": "Fichier CSV non trouvé"}), 404

@app.route('/api/finitions', methods=['GET'])
def get_finitions():
    if os.path.exists('finitions.csv'):
        try:
            finitions = pd.read_csv('finitions.csv').to_dict(orient='records')
            return jsonify(finitions)
        except Exception as e:
            return jsonify({"error": f"Erreur lors de la lecture du fichier CSV: {str(e)}"}), 500
    else:
        return jsonify({"error": "Fichier CSV non trouvé"}), 404

@app.route('/api/motifscuir', methods=['GET'])
def get_motifscuir():
    if os.path.exists('motifscuir.csv'):
        try:
            motifscuir = pd.read_csv('motifscuir.csv').to_dict(orient='records')
            return jsonify(motifscuir)
        except Exception as e:
            return jsonify({"error": f"Erreur lors de la lecture du fichier CSV: {str(e)}"}), 500
    else:
        return jsonify({"error": "Fichier CSV non trouvé"}), 404

@app.route('/api/equipements', methods=['GET'])
def get_equipements():
    if os.path.exists('equipements.csv'):
        try:
            equipements = pd.read_csv('equipements.csv').to_dict(orient='records')
            return jsonify(equipements)
        except Exception as e:
            return jsonify({"error": f"Erreur lors de la lecture du fichier CSV: {str(e)}"}), 500
    else:
        return jsonify({"error": "Fichier CSV non trouvé"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)