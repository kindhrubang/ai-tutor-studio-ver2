from app.core.config import settings
import openai
import json
from fastapi import UploadFile
from bson import ObjectId
import io
from datetime import datetime