import pandas as pd
import pickle
import os

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score


# --------------------------------
# 1. Load datasets
# --------------------------------

train_data = pd.read_csv("Training.csv")
test_data = pd.read_csv("Testing.csv")


# --------------------------------
# 2. Remove unnecessary columns
# --------------------------------

train_data = train_data.drop(columns=["Unnamed: 133"], errors="ignore")
test_data = test_data.drop(columns=["Unnamed: 133"], errors="ignore")


# --------------------------------
# 3. Separate symptoms and disease
# --------------------------------

X_train = train_data.drop(columns=["prognosis"])
y_train = train_data["prognosis"]

X_test = test_data.drop(columns=["prognosis"])
y_test = test_data["prognosis"]


# --------------------------------
# 4. Make sure columns match
# --------------------------------

if list(X_train.columns) != list(X_test.columns):
    raise ValueError("Training and Testing symptom columns do not match.")


# --------------------------------
# 5. Encode disease names
# --------------------------------

label_encoder = LabelEncoder()

y_train_encoded = label_encoder.fit_transform(y_train)
y_test_encoded = label_encoder.transform(y_test)


# --------------------------------
# 6. Train Random Forest
# --------------------------------

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train_encoded)


# --------------------------------
# 7. Test model
# --------------------------------

predictions = model.predict(X_test)

accuracy = accuracy_score(
    y_test_encoded,
    predictions
)

print("Model accuracy:", accuracy)


# --------------------------------
# 8. Create model directory
# --------------------------------

model_dir = os.path.join("app", "model")

os.makedirs(model_dir, exist_ok=True)


# --------------------------------
# 9. Save disease model
# --------------------------------

model_path = os.path.join(
    model_dir,
    "disease_model.pkl"
)

with open(model_path, "wb") as file:
    pickle.dump(model, file)


# --------------------------------
# 10. Save symptom column order
# --------------------------------

symptom_columns = X_train.columns.tolist()

encoder_path = os.path.join(
    model_dir,
    "symptom_encoder.pkl"
)

with open(encoder_path, "wb") as file:
    pickle.dump(symptom_columns, file)


# --------------------------------
# 11. Save label encoder
# --------------------------------

label_encoder_path = os.path.join(
    model_dir,
    "label_encoder.pkl"
)

with open(label_encoder_path, "wb") as file:
    pickle.dump(label_encoder, file)


print("\nTraining completed!")
print("Model saved at:", model_path)
print("Symptom encoder saved at:", encoder_path)
print("Label encoder saved at:", label_encoder_path)
print("Number of symptoms:", len(symptom_columns))
print("Number of diseases:", len(label_encoder.classes__))