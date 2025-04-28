from pydantic import BaseModel
from typing import List, Dict, Optional

class NoteItem(BaseModel):
    counter: int
    elements: List[Dict]
    title: str

class UserNotes(BaseModel):
    email: str
    notes: List[NoteItem]
