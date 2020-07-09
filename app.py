import os
import urllib.request
from flask import Flask, render_template, redirect, request, url_for
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

app = Flask(__name__)

app.config["MONGO_DBNAME"] = 'movieclub'
app.config['MONGO_URI'] = 'mongodb+srv://movieclub_movieadmin:hneSNJhg44nImFeo@cluster0-z3z20.mongodb.net/movieclub?retryWrites=true&w=majority&ssl=true&ssl_cert_reqs=CERT_NONE'

mongo = PyMongo(app)

@app.route('/')
@app.route('/get_movies')
def get_movies():
    return render_template("movies.html", movies=mongo.db.movie_list.find())

@app.route('/add_movie')
def add_movie():
    return render_template("addmovie.html", categories=mongo.db.movie_category.find())

@app.route('/insert_movie', methods=['POST'])
def insert_movie():
    movies=mongo.db.movie_list
    movies.insert_one(request.form.to_dict())
    return redirect(url_for('get_movies'))

if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
    port=int(os.environ.get('PORT')),
    debug=True)