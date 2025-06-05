
# import pickle
# import os

# model_path = os.path.join(os.path.dirname(__file__), '../model/disease_model.pkl')
# encoder_path = os.path.join(os.path.dirname(__file__), '../model/symptom_encoder.pkl')

# model = pickle.load(open(model_path, 'rb'))
# mlb = pickle.load(open(encoder_path, 'rb'))

# def predict_disease(symptoms):
#     symptoms = [s.strip().lower() for s in symptoms]
#     input_vector = mlb.transform([symptoms])
#     predicted_disease = model.predict(input_vector)[0]
#     return predicted_disease

import pickle
import os
import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer

model_path = os.path.join(os.path.dirname(__file__), 'model', 'disease_model.pkl')
encoder_path = os.path.join(os.path.dirname(__file__), 'model', 'symptom_encoder.pkl')



model = pickle.load(open(model_path, 'rb'))
mlb = pickle.load(open(encoder_path, 'rb'))

# Load original training data for rule-based logic
training_data = {
    "symptoms": [
        ["fever", "cough", "sore throat"],             # flu
        ["headache", "nausea", "vomiting"],            # migraine
        ["fever", "rash", "joint pain"],               # dengue
        ["chest pain", "shortness of breath"],         # pneumonia
        ["cough", "sore throat"],                      # cold
        ["fatigue", "weight loss", "increased thirst"],# diabetes
        ["fever", "vomiting", "abdominal pain"],       # food poisoning
        ["itching", "rash"],                           # allergy
        ["diarrhea", "dehydration"],                   # cholera
        ["fever", "night sweats", "weight loss"],      # tuberculosis
        ["nausea", "yellow skin", "dark urine"],       # hepatitis
        ["joint pain", "stiffness", "swelling"],       # arthritis
        ["fever", "headache", "stiff neck"],           # meningitis
        ["high blood pressure", "blurred vision"],     # hypertension
        ["frequent urination", "increased thirst"],    # diabetes
        ["vomiting", "abdominal cramps", "bloating"],  # gastritis
        ["fatigue", "pale skin", "shortness of breath"], # anemia
        ["dizziness", "rapid heartbeat"],              # heart attack
        ["confusion", "slurred speech", "drooping face"], # stroke
        ["weight gain", "cold intolerance"],           # hypothyroidism
        ["excessive sweating", "weight loss"],         # hyperthyroidism
        ["muscle weakness", "vision issues"],          # multiple sclerosis
        ["memory loss", "confusion"],                  # alzheimer's
        ["persistent cough", "blood in sputum"],       # lung cancer
        ["abdominal bloating", "pelvic pain"],         # ovarian cancer
        ["bone pain", "frequent fractures"],           # osteoporosis
        ["nausea", "loss of appetite", "jaundice"],    # liver disease
        ["blurred vision", "eye pain", "nausea"],      # glaucoma
        ["sensitivity to light", "eye redness"],       # conjunctivitis
        ["ear pain", "hearing loss"],                  # ear infection
        ["runny nose", "sneezing"],                    # allergic rhinitis
        ["fever", "chills", "sweating"],               # malaria
        ["weight loss", "persistent cough"],           # lung TB
        ["difficulty swallowing", "hoarseness"],       # throat cancer
        ["burning urination", "pelvic pain"],          # UTI
        ["increased hunger", "fatigue"],               # type 2 diabetes
        ["shaky hands", "confusion", "hunger"],        # hypoglycemia
        ["dry skin", "irritability", "bedwetting"],    # type 1 diabetes
        ["muscle cramps", "fatigue"],                  # electrolyte imbalance
        ["abdominal pain", "bloody stools"],           # ulcerative colitis
        ["lower back pain", "urination issues"],       # kidney stones
    ],
    "disease": [
        "flu", "migraine", "dengue", "pneumonia", "cold", "diabetes", "food poisoning", "allergy",
        "cholera", "tuberculosis", "hepatitis", "arthritis", "meningitis", "hypertension", "diabetes",
        "gastritis", "anemia", "heart attack", "stroke", "hypothyroidism", "hyperthyroidism",
        "multiple sclerosis", "alzheimer's", "lung cancer", "ovarian cancer", "osteoporosis",
        "liver disease", "glaucoma", "conjunctivitis", "ear infection", "allergic rhinitis", "malaria",
        "lung TB", "throat cancer", "UTI", "type 2 diabetes", "hypoglycemia", "type 1 diabetes",
        "electrolyte imbalance", "ulcerative colitis", "kidney stones"
    ]
}
df = pd.DataFrame(training_data)

# ✅ Main prediction function
def predict_disease(symptoms):
    try:
        model = pickle.load(open(model_path, 'rb'))
        encoder = pickle.load(open(encoder_path, 'rb'))
    except FileNotFoundError:
        return {"error": "Model files not found. Make sure they are downloaded."}
    
    symptoms = [s.strip().lower() for s in symptoms]
    input_set = set(symptoms)

    # 🔹 Step 1: Exact match (all input symptoms are in training set)
    for _, row in df.iterrows():
        disease_symptoms = set(row["symptoms"])
        if input_set == disease_symptoms or input_set.issubset(disease_symptoms):
            return row["disease"]

    # 🔹 Step 2: Partial match (at least 50% overlap)
    best_match = None
    best_score = 0.0
    for _, row in df.iterrows():
        disease_symptoms = set(row["symptoms"])
        common = input_set.intersection(disease_symptoms)
        score = len(common) / len(disease_symptoms)
        if score > best_score:
            best_score = score
            best_match = row["disease"]

    if best_score >= 0.5:  # You can tune this threshold
        return best_match

    # 🔹 Step 3: Fallback to ML model
    input_vector = mlb.transform([symptoms])
    return model.predict(input_vector)[0]
