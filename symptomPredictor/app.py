from flask_cors import CORS
from app import create_app
import os


def download_models():
    import gdown

    model_files = {
        "app/model/disease_model.pkl":
            "1vJFKgDJQKFBWO52u-fDllA6cyn7Z1coQ",

        "app/model/label_encoder.pkl":
            "1f6AZTPtbx_oR4rn98w7OavnPfFi8opUA",

        "app/model/symptom_encoder.pkl":
            "1LgAXV8lKdHLBzSQYn4cQOK6up3QjAqpY"
    }

    for path, file_id in model_files.items():

        if not os.path.exists(path):

            os.makedirs(os.path.dirname(path), exist_ok=True)

            print(f"[INFO] Downloading {path} from Google Drive...")

            gdown.download(
                f"https://drive.google.com/uc?id={file_id}",
                path,
                quiet=False
            )


download_models()

app = create_app()

CORS(app)


if __name__ == "__main__":
    app.run(debug=True)