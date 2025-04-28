from pymongo import MongoClient

MONGO_URI = "mongodb+srv://yk__kumawat:yk573614@everwrite.ke1cb.mongodb.net/?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true"

try:
    client = MongoClient(MONGO_URI)
    db = client["test_db"]  # Replace with your actual database name
    print("✅ MongoDB connection successful!")
    print("Collections:", db.list_collection_names())
except Exception as e:
    print("❌ Error connecting to MongoDB:", e)
