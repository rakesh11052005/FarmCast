from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///farmcast.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False