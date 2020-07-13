
import os
from flask import Flask, render_template, redirect, request, url_for
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import urllib.request
from datetime import datetime

app = Flask(__name__)
messages = []

app.config["MONGO_DBNAME"] = 'movieclub'
app.config['MONGO_URI'] = 'mongodb+srv://movieclub_movieadmin:hneSNJhg44nImFeo@cluster0-z3z20.mongodb.net/movieclub?retryWrites=true&w=majority&ssl=true&ssl_cert_reqs=CERT_NONE'

mongo = PyMongo(app)


@app.route('/')
@app.route('/show_movie_review_list')
def show_movie_review_list():
    current_date = datetime.now()
    movies = mongo.db.movie_list.find({"movie_reviewdate": {"$exists": True}}).sort("movie_reviewdate", -1)    
    movies2 = mongo.db.movie_list.find({"movie_reviewdate": {"$exists": True}}).sort("movie_reviewdate", -1)    
    return render_template("movie_review_list.html", movies=movies, movies2=movies2, current_date=current_date)


@app.route('/get_movies', methods=['POST', 'GET'])
def get_movies():
    return render_template("movies.html", movies=mongo.db.movie_list.find())


@app.route('/add_movie')
def add_movie():
    return render_template("addmovie.html", categories=mongo.db.movie_category.find())


@app.route('/insert_movie', methods=['POST', 'GET'])
def insert_movie():
    movies = mongo.db.movie_list
    movies.insert_one(request.form.to_dict())
    return redirect(url_for('get_movies'))


@app.route('/admin_movie_update/<movie_id>', methods=['POST', 'GET'])
def admin_movie_update(movie_id):
    themovie = mongo.db.movie_list.find_one({"_id": ObjectId(movie_id)})
    return render_template("adminmovieupdate.html", movie=themovie, categories=mongo.db.movie_category.find())


@app.route('/insert_admin_movie_update/<movie_id>', methods=['POST', 'GET'])
def insert_admin_movie_update(movie_id):
    movies = mongo.db.movie_list
    movies.update({'_id': ObjectId(movie_id)},
    {
        'movie_name': request.form.get('movie_name'),
        'movie_releasedate': request.form.get('movie_releasedate'),
        'movie_overview': request.form.get('movie_overview'),
        'movie_category': request.form.get('movie_category'),
        'movie_reviewdate': request.form.get('movie_reviewdate'),
        'movie_has_been_reviewed': request.form.get('movie_has_been_reviewed')
    })
    return redirect(url_for('get_movies'))


@app.route('/admin_movie_remove/<movie_id>')
def admin_movie_remove(movie_id):
    mongo.db.movie_list.remove({'_id': ObjectId(movie_id)})
    return redirect(url_for('get_movies'))

    
@app.route("/movie_review_comments")
def movie_review_comments():
    movie_comments = mongo.db.movie_review_comments.find()
    return render_template("movie_review_comments.html", movie_comments=movie_comments)


@app.route("/insert_movie_review_comments", methods=['POST', 'GET'])
def insert_movie_review_comments():
    movie_comments = mongo.db.movie_review_comments.find()
    return redirect(url_for('movie_review_comments'))


if __name__ == '__main__':
    app.run(host=os.environ.get('IP'), port=int(os.environ.get('PORT')), 
        debug=True)
