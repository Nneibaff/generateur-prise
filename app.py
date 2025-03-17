
# initialize the Flask app
from flask import Flask
app = Flask(__name__)

# define a route for the default URL
@app.route('/')
def hello():
    return "Hello World!"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)