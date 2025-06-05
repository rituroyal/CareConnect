
# from flask import Blueprint, request, jsonify, render_template
# from app.predictor import predict_disease

# api = Blueprint('api', __name__)

# @api.route('/api/predict', methods=['POST'])
# def predict():
#     data = request.get_json()
#     symptoms = data.get('symptoms', [])
#     if not symptoms:
#         return jsonify({"error": "No symptoms provided"}), 400
#     disease = predict_disease(symptoms)
#     return jsonify({"predicted_disease": disease})

# @api.route("/")
# def index():
#     return render_template("index.html")

from flask import Blueprint, request, jsonify, render_template
from app.predictor import predict_disease
from app.disease_info import disease_info  # ⬅️ Import disease info

api = Blueprint('api', __name__)

@api.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    symptoms = data.get('symptoms', [])
    
    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400

    disease = predict_disease(symptoms)
    info = disease_info.get(disease, {})

    return jsonify({
        "predicted_disease": disease,
        "description": info.get("description", "No description available."),
        "causes": info.get("causes", "Unknown."),
        "emergency": info.get("emergency", "Not specified."),
        "cure": info.get("cure", "Not specified.")
    })

@api.route("/")
def index():
    return render_template("index.html")
