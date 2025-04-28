import * as React from "react";
import { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import toast from "react-hot-toast";
import Page from "../components/Page";
import Canvas from "../components/Canvas";
import Toolbar from "../components/Toolbar";
import axios from "axios";

export default function CreateNotes({ note, socket, roomID }) {
  const [noteData, setNoteData] = useState({
    title: "",
    elements: [{ id: 0, type: "page", content: "" }],
    counter: 1,
  });
  const [userEmail, setUserEmail] = useState("");
  const [brushColor, setBrushColor] = useState("#FFFFFF");
  const [brushSize, setBrushSize] = useState(2);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }

    // If editing an existing note, load its data
    if (note) {
      setNoteData({
        title: note.title,
        elements: note.elements || [{ id: 0, type: "page", content: "" }],
        counter: note.elements ? note.elements.length : 1,
      });
    }
  }, [note]);

  useEffect(() => {
    if (!socket) return;
  
    socket.on("titleChange", ({ title }) => {
      setNoteData((prev) => ({ ...prev, title }));
    });
  
    socket.on("elementChange", ({ element }) => {
      setNoteData((prev) => ({
        ...prev,
        elements: [...prev.elements, element],
        counter: prev.counter + 1,
      }));
    });
  
    socket.on("contentChange", ({ id, content }) => {
      setNoteData((prev) => ({
        ...prev,
        elements: prev.elements.map((el) =>
          el.id === id ? { ...el, content } : el
        ),
      }));
    });
  }, [socket]);
  
  useEffect(() => {
    if (!socket) return;
  
    socket.on("brushColorChange", ({ color }) => {
      console.log("Receiving brush color update:", color);
      setBrushColor(color);
    });
  
    socket.on("brushSizeChange", ({ size }) => {
      console.log("Receiving brush size update:", size);
      setBrushSize(size);
    });
  
    return () => {
      socket.off("brushColorChange");
      socket.off("brushSizeChange");
    };
  }, [socket]);
  


  const updateTitle = (e) => {
    const newTitle = e.target.value;
    setNoteData((prev) => ({ ...prev, title: newTitle }));
  
    if (socket) {
      socket.emit("titleChange", { roomID, title: newTitle });
    }
  };

  const addPage = () => {
    const newPage = { id: noteData.counter, type: "page", content: "" };
    setNoteData((prev) => ({
      ...prev,
      elements: [...prev.elements, newPage],
      counter: prev.counter + 1,
    }));
  
    if (socket) {
      socket.emit("elementChange", { roomID, element: newPage });
    }
  };
  
  const addCanvas = () => {
    const newCanvas = { id: noteData.counter, type: "canvas", content: "" };
    setNoteData((prev) => ({
      ...prev,
      elements: [...prev.elements, newCanvas],
      counter: prev.counter + 1,
    }));
  
    if (socket) {
      socket.emit("elementChange", { roomID, element: newCanvas });
    }
  };
  

  const handleChange = (id, e) => {
    const content = e.target.value;
    setNoteData((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === id ? { ...el, content } : el
      ),
    }));
  
    if (socket) {
      socket.emit("contentChange", { roomID, id, content });
    }
  };
  
  const updateElementContent = (id, content) => {
    setNoteData((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === id ? { ...el, content } : el
      ),
    }));
  
    if (socket) {
      socket.emit("contentChange", { roomID, id, content });
    }
  };
  
  useEffect(() => {
    if (!socket) return;
  
    socket.on("deleteElement", ({ id }) => {
      console.log("Receiving element deletion:", id);
      setNoteData((prev) => ({
        ...prev,
        elements: prev.elements.filter((element) => element.id !== id),
      }));
    });
  
    return () => {
      socket.off("deleteElement");
    };
  }, [socket]);
  
  

  const deleteElement = (id) => {
    if (noteData.elements.length > 1) {
      setNoteData((prev) => {
        const updatedElements = prev.elements.filter((element) => element.id !== id);
  
        // Emit deletion event to other users
        if (socket) {
          console.log("Emitting element deletion:", id);
          socket.emit("deleteElement", { roomID, id });
        }
  
        return { ...prev, elements: updatedElements };
      });
    }
  };
  

  const saveNote = () => {
    if (!noteData.title) {
      toast.error("Title is Required");
      return;
    }

    document
      .querySelectorAll(".canvas-save-button")
      .forEach((btn) => btn.click());

    setTimeout(() => {
      setNoteData((prevNoteData) => {
        console.log("Final noteData before saving:", prevNoteData);

        try {
          if (note) {
            axios.put("http://127.0.0.1:8000/notes/updateNote", {
              email: userEmail,
              title: prevNoteData.title,
              elements: prevNoteData.elements,
              counter: prevNoteData.counter,
            });
            toast.success("Note Updated Successfully");
          } else {
            axios.post("http://127.0.0.1:8000/notes/createNotes", {
              email: userEmail,
              title: prevNoteData.title,
              elements: prevNoteData.elements,
              counter: prevNoteData.counter,
            });
            toast.success("Note Saved Successfully");
          }
        } catch (error) {
          console.error("Error saving note:", error);
          alert("Failed to save note.");
        }

        return prevNoteData;
      });
    }, 500);
  };
  
  
  

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        textAlign: "center",
        justifyContent: "space-evenly",
      }}
      className="gap-3"
    >
      <div>
        {/* Title Input */}
        <div className="flex gap-3 mb-[20px]">
          <TextField
            className="bg-[#1e1e1e]"
            component="form"
            sx={{
              "& > :not(style)": { m: 0, textAlign: "start", width: "90ch" },
            }}
            noValidate
            autoComplete="off"
            id="outlined-basic"
            label="Title"
            variant="outlined"
            value={noteData.title}
            onChange={updateTitle}
          />
          <Button onClick={saveNote} className="h-14" variant="outlined">
            {note ? "Update" : "Create"}
          </Button>
        </div>

        {/* Display Pages & Canvases */}
        <div
          className="overflow-scroll h-[570px] w-[930px]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {noteData.elements.map((element) =>
            element.type === "page" ? (
              <Page
                key={element.id}
                id={element.id}
                value={element.content}
                onChange={(e) => handleChange(element.id, e)}
                deleteElement={deleteElement}
              />
            ) : (
              <Canvas
                key={element.id}
                id={element.id}
                savedData={element.content}
                updateElementContent={updateElementContent}
                deleteElement={deleteElement}
                brushColor={brushColor}
                brushSize={brushSize}
                socket={socket}
                roomID={roomID}
              />
            )
          )}
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar
        addPage={addPage}
        addCanvas={addCanvas}
        brushColor={brushColor}
        setBrushColor={setBrushColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        socket={socket}
        roomID={roomID}
      />
    </Box>
  );
}
