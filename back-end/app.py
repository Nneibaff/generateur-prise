import csv
import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permettre les requêtes depuis React

def read_csv_file(file_path):
    try:
        with open(file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            return [row for row in reader]
    except Exception as e:
        raise Exception(f"Erreur lors de la lecture du fichier CSV: {str(e)}")

@app.route('/api/modeles', methods=['GET'])
def get_modeles():
    if os.path.exists('modeles.csv'):
        try:
            modeles = read_csv_file('modeles.csv')
            return jsonify(modeles)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Fichier CSV non trouvé"}), 404

@app.route('/api/formats', methods=['GET'])
def get_formats():
    if os.path.exists('formats.csv'):
        try:
            formats = read_csv_file('formats.csv')
            return jsonify(formats)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Fichier CSV non trouvé"}), 404

@app.route('/api/finitions', methods=['GET'])
def get_finitions():
    if os.path.exists('finitions.csv'):
        try:
            finitions = read_csv_file('finitions.csv')
            return jsonify(finitions)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Fichier CSV non trouvé"}), 404


@app.route('/api/equipements', methods=['GET'])
def get_equipements():
    if os.path.exists('equipements.csv'):
        try:
            equipements = read_csv_file('equipements.csv')
            return jsonify(equipements)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Fichier CSV non trouvé"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)