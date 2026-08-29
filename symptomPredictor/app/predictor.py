import pickle
import os
import pandas as pd

model_path = os.path.join(os.path.dirname(__file__), 'model', 'disease_model.pkl')
encoder_path = os.path.join(os.path.dirname(__file__), 'model', 'symptom_encoder.pkl')
label_encoder_path = os.path.join(os.path.dirname(__file__), 'model', 'label_encoder.pkl')

# Load original training data for rule-based logic
training_data = {
    "symptoms": [
        ["fever", "cough", "sore throat"],
        ["headache", "nausea", "vomiting"],
        ["fever", "rash", "joint pain"],
        ["chest pain", "shortness of breath"],
        ["cough", "sore throat"],
        ["fatigue", "weight loss", "increased thirst"],
        ["fever", "vomiting", "abdominal pain"],
        ["itching", "rash"],
        ["diarrhea", "dehydration"],
        ["fever", "night sweats", "weight loss"],
        ["nausea", "yellow skin", "dark urine"],
        ["joint pain", "stiffness", "swelling"],
        ["fever", "headache", "stiff neck"],
        ["high blood pressure", "blurred vision"],
        ["frequent urination", "increased thirst"],
        ["vomiting", "abdominal cramps", "bloating"],
        ["fatigue", "pale skin", "shortness of breath"],
        ["dizziness", "rapid heartbeat"],
        ["confusion", "slurred speech", "drooping face"],
        ["weight gain", "cold intolerance"],
        ["excessive sweating", "weight loss"],
        ["muscle weakness", "vision issues"],
        ["memory loss", "confusion"],
        ["persistent cough", "blood in sputum"],
        ["abdominal bloating", "pelvic pain"],
        ["bone pain", "frequent fractures"],
        ["nausea", "loss of appetite", "jaundice"],
        ["blurred vision", "eye pain", "nausea"],
        ["sensitivity to light", "eye redness"],
        ["ear pain", "hearing loss"],
        ["runny nose", "sneezing"],
        ["fever", "chills", "sweating"],
        ["weight loss", "persistent cough"],
        ["difficulty swallowing", "hoarseness"],
        ["burning urination", "pelvic pain"],
        ["increased hunger", "fatigue"],
        ["shaky hands", "confusion", "hunger"],
        ["dry skin", "irritability", "bedwetting"],
        ["muscle cramps", "fatigue"],
        ["abdominal pain", "bloody stools"],
        ["lower back pain", "urination issues"]
    ],
    "disease": [
        "flu",
        "migraine",
        "dengue",
        "pneumonia",
        "cold",
        "diabetes",
        "food poisoning",
        "allergy",
        "cholera",
        "tuberculosis",
        "hepatitis",
        "arthritis",
        "meningitis",
        "hypertension",
        "diabetes",
        "gastritis",
        "anemia",
        "heart attack",
        "stroke",
        "hypothyroidism",
        "hyperthyroidism",
        "multiple sclerosis",
        "alzheimer's",
        "lung cancer",
        "ovarian cancer",
        "osteoporosis",
        "liver disease",
        "glaucoma",
        "conjunctivitis",
        "ear infection",
        "allergic rhinitis",
        "malaria",
        "lung TB",
        "throat cancer",
        "UTI",
        "type 2 diabetes",
        "hypoglycemia",
        "type 1 diabetes",
        "electrolyte imbalance",
        "ulcerative colitis",
        "kidney stones"
    ]
}

df = pd.DataFrame(training_data)


def predict_disease(symptoms):
    try:
        model = pickle.load(open(model_path, 'rb'))
        symptom_columns = pickle.load(open(encoder_path, 'rb'))
        label_encoder = pickle.load(open(label_encoder_path, 'rb'))
    except FileNotFoundError:
        return {"error": "Model files not found. Make sure disease_model.pkl, symptom_encoder.pkl and label_encoder.pkl exist."}

    symptoms = [s.strip().lower() for s in symptoms]
    input_set = set(symptoms)

    # Step 1: Exact / subset rule match
    for _, row in df.iterrows():
        disease_symptoms = set(row["symptoms"])

        if input_set == disease_symptoms or input_set.issubset(disease_symptoms):
            return row["disease"]

    # Step 2: Partial rule match
    best_match = None
    best_score = 0.0

    for _, row in df.iterrows():
        disease_symptoms = set(row["symptoms"])
        common = input_set.intersection(disease_symptoms)

        if len(disease_symptoms) > 0:
            score = len(common) / len(disease_symptoms)

            if score > best_score:
                best_score = score
                best_match = row["disease"]

    if best_score >= 0.5:
        return best_match

    # Step 3: Machine learning fallback
    input_vector = pd.DataFrame(0, index=[0], columns=symptom_columns)

    for symptom in symptoms:
        if symptom in input_vector.columns:
            input_vector.loc[0, symptom] = 1

    encoded_prediction = model.predict(input_vector)[0]

    return label_encoder.inverse_transform([encoded_prediction])[0]

