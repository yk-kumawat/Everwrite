import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactCanvasDraw from "react-canvas-draw";

const Canvas = ({
  id,
  deleteElement,
  brushColor,
  brushSize,
  updateElementContent,
  savedData,
  socket,
  roomID,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef(null);
  const [canvasData, setCanvasData] = useState(savedData || "");

  useEffect(() => {
    if (savedData) {
      setCanvasData(savedData);
    }
  }, [savedData]);

  useEffect(() => {
    if (canvasRef.current && canvasData) {
      setTimeout(() => {
        canvasRef.current.loadSaveData(canvasData, true);
      }, 100);
    }
  }, [canvasData]);

  useEffect(() => {
    if (!socket) return;

    socket.on("canvasChange", ({ id: canvasId, content }) => {
      if (canvasId === id) {
        console.log("Receiving canvas update:", content);
        setCanvasData(content);
      }
    });

    return () => {
      socket.off("canvasChange");
    };
  }, [socket, id]);

  const saveCanvasData = () => {
    if (canvasRef.current) {
      const drawingData = canvasRef.current.getSaveData();

      setCanvasData(drawingData);
      updateElementContent(id, drawingData);

      if (socket) {
        socket.emit("canvasChange", { roomID, id, content: drawingData });
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#1e1e1e",
        width: "902px",
        height: "490px",
        marginBottom: "20px",
        padding: "0px",
        borderRadius: "5px",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drawing Canvas */}
      <ReactCanvasDraw
        ref={canvasRef}
        backgroundColor="#1e1e1e"
        brushColor={brushColor}
        brushRadius={brushSize}
        canvasWidth={902}
        canvasHeight={490}
        hideGrid={true}
        lazyRadius={0}
        className="hover:border rounded"
        immediateLoading={true} // Important to ensure it loads data immediately
        saveData={canvasData}
        onChange={saveCanvasData}
      />

      {/* Clear Canvas Button */}
      <Button
        variant="outlined"
        color="warning"
        onClick={() => {
          if (canvasRef.current) {
            canvasRef.current.clear(); // Clear the actual canvas

            const emptyCanvasData = JSON.stringify({ lines: [] }); // Ensures valid JSON
            setCanvasData(emptyCanvasData); // Update local state

            updateElementContent(id, emptyCanvasData); // Sync with backend/state

            if (socket) {
              socket.emit("canvasChange", {
                roomID,
                id,
                content: emptyCanvasData,
              }); // Sync with other users
            }
          }
        }}
        sx={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
        }}
      >
        Clear
      </Button>

      <button
        className="canvas-save-button"
        onClick={saveCanvasData}
        style={{ display: "none" }} // Hidden button
      >
        Save Canvas
      </button>

      {/* Delete Canvas Button (Only on Hover) */}
      {isHovered && (
        <Button
          variant="outlined"
          color="error"
          onClick={() => deleteElement(id)}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "30px",
            height: "40px",
            minWidth: "unset",
            padding: 0,
          }}
        >
          <DeleteIcon sx={{ fontSize: 18 }} />
        </Button>
      )}
    </Box>
  );
};

export default Canvas;
