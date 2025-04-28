from config.db import notes_collection
from models.notes import NoteItem
from fastapi import HTTPException
from bson import ObjectId

def add_note(email: str, note: NoteItem):
    user_notes = notes_collection.find_one({"email": email})

    note_data = note.dict()
    note_data["_id"] = str(ObjectId())

    if user_notes:
        notes_collection.update_one(
            {"email": email},
            {"$push": {"notes": note_data}}
        )
    else:
        notes_collection.insert_one({
            "email": email,
            "notes": [note_data]
        })

    return {"message": "Note added successfully", "note_id": note_data["_id"]}


def get_notes(email: str):
    user_notes = notes_collection.find_one({"email": email}, {"_id": 0})  # Exclude MongoDB `_id`
    if not user_notes:
        raise HTTPException(status_code=404, detail="No notes found for this user")
    return user_notes


def update_existing_note(email: str, title: str, elements: list, counter: int):
    user_notes = notes_collection.find_one({"email": email})

    if not user_notes:
        raise HTTPException(status_code=404, detail="User not found")

    note_index = next((i for i, note in enumerate(user_notes["notes"]) if note["title"] == title), None)

    if note_index is None:
        raise HTTPException(status_code=404, detail="Note not found")

    # Update note data
    user_notes["notes"][note_index]["elements"] = elements
    user_notes["notes"][note_index]["counter"] = counter

    notes_collection.update_one(
        {"email": email},
        {"$set": {"notes": user_notes["notes"]}}
    )

    return {"message": "Note updated successfully"}


def delete_note(email: str, title: str):
    user_notes = notes_collection.find_one({"email": email})

    if not user_notes:
        raise HTTPException(status_code=404, detail="User not found")

    updated_notes = [note for note in user_notes["notes"] if note["title"] != title]

    if len(updated_notes) == len(user_notes["notes"]):
        raise HTTPException(status_code=404, detail="Note not found")

    notes_collection.update_one(
        {"email": email},
        {"$set": {"notes": updated_notes}}
    )

    return {"message": "Note deleted successfully"}


def check_note_title(email: str, title: str):
    # Fetch user notes from MongoDB
    user_notes = notes_collection.find_one({"email": email})

    if not user_notes:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if the title exists
    title_exists = any(note["title"] == title for note in user_notes.get("notes", []))

    if title_exists:
        return {"exists": True, "message": "Title already exists"}
    else:
        return {"exists": False, "message": "Title is available"}