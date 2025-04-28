from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict
from models.notes import NoteItem
from controllers.notesController import add_note, get_notes, delete_note, update_existing_note, check_note_title

router = APIRouter()

class NoteRequest(BaseModel):
    email: str
    title: str
    elements: List[Dict]
    counter: int
    
class DeleteNoteRequest(BaseModel):
    email: str
    title: str
    
class TitleCheckRequest(BaseModel):
    email: str
    title: str

@router.post("/createNotes")
async def save_note(request: NoteRequest):
    note = NoteItem(
        title=request.title, 
        elements=request.elements, 
        counter=request.counter,
    )
    return add_note(request.email, note)

@router.get("/getNotes")
async def fetch_notes(email: str):
    return get_notes(email)

@router.put("/updateNote")
async def update_note(request: NoteRequest):
    return update_existing_note(request.email, request.title, request.elements, request.counter)

@router.delete("/deleteNote")
async def remove_note(request: DeleteNoteRequest):
    return delete_note(request.email, request.title)

@router.post("/checkTitle")
async def check_title(request: TitleCheckRequest):
    return check_note_title(request.email, request.title)