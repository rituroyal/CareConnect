from flask import Flask

def create_app():
    app = Flask(__name__, template_folder="../templates")  # important!
    
    from app.routes import api
    app.register_blueprint(api)
    
    return app
