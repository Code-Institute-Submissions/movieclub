import os
from flask import Flask, render_template, redirect, requests, url_for
from flask_pymongo inport flask_pymongo
from bson.objectid import ObjectId

app = Flask(__name__)

app.config['MONGO_URI'] = 'mongodb+srv://movieclub_movieadmin:1Evening!@cluster0-z3z20.mongodb.net/movieclubmos?retryWrites=true&w=majority'

mongodb = PyMongo(app)

@app.route('/')
@app.route('/get_movies')
def get_movies():
    return 'Hello World....again...blah'
    return render_template ("moviles.html", movies-mongo.db.movies.find)

if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
    port=int(os.environ.get('PORT')),
    debug=True)