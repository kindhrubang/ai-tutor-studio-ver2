from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://mongodb:27017"
    MONGODB_DB_NAME: str = "db-tutor"
    DATABASE_URL: str = "mongodb://mongodb:27017/db-tutor"

settings = Settings()
