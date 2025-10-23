from config import db

class FarmerData(db.Model):
    __tablename__ = 'farmerdata'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(100), nullable=False)
    Email = db.Column(db.String(100))
    Role = db.Column(db.String(50))
    Password = db.Column(db.String(100))
    Latitude = db.Column(db.Float)
    Longitude = db.Column(db.Float)
    FieldSize = db.Column(db.Float)