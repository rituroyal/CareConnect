from flask_cors import CORS
from app import create_app
import os

# --- ADD THESE LINES ---
def download_models():
    import gdown

    model_files = {
        "app/model/disease_model.pkl": "1zFD7wQEk1GoW4wVziNF93djVlhEknDEo",  
        "app/model/symptom_encoder.pkl": "1mKBV4WWKYUSfYthv6AkbVU2s0YrIFmRg" 
    }

    for path, file_id in model_files.items():
        if not os.path.exists(path):
            print(f"[INFO] Downloading {path} from Google Drive...")
            gdown.download(f"https://drive.google.com/uc?id={file_id}", path, quiet=False)

# Run this before starting the app
download_models()
# ----------------------

app = create_app()
CORS(app)  # Enable CORS globally

if __name__ == "__main__":
    app.run(debug=True)
