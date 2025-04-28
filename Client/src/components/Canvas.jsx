import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { ReactSketchCanvas } from "react-sketch-canvas";

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
        canvasRef.current.loadPaths(JSON.parse(canvasData));
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

  const saveCanvasData = async () => {
    if (canvasRef.current) {
      const drawingData = await canvasRef.current.exportPaths();
      const drawingDataString = JSON.stringify(drawingData);

      setCanvasData(drawingDataString);
      updateElementContent(id, drawingDataString);

      if (socket) {
        socket.emit("canvasChange", { roomID, id, content: drawingDataString });
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
      <ReactSketchCanvas
        ref={canvasRef}
        backgroundColor="#1e1e1e"
        strokeColor={brushColor}
        strokeWidth={brushSize}
        width="902px"
        height="490px"
        style={{
          borderRadius: "5px",
          overflow: "hidden",
          backgroundColor: "#1e1e1e",
        }}
        onStroke={() => saveCanvasData()}
        withTimestamp={true}
      />

      {/* Clear Canvas Button */}
      <Button
        variant="outlined"
        color="warning"
        onClick={() => {
          if (canvasRef.current) {
            canvasRef.current.clearCanvas();

            const emptyCanvasData = JSON.stringify([]); // Sketch canvas expects empty array
            setCanvasData(emptyCanvasData);
            updateElementContent(id, emptyCanvasData);

            if (socket) {
              socket.emit("canvasChange", {
                roomID,
                id,
                content: emptyCanvasData,
              });
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
