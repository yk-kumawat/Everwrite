import React from "react";
import {
  Box,
  Button,
  Slider,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Toolbar = ({
  addPage,
  addCanvas,
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize,
  socket,
  roomID,
}) => {

  const handleBrushColorChange = (e) => {
    const newColor = e.target.value;
    setBrushColor(newColor);

    if (socket) {
      console.log("Emitting brush color change:", newColor);
      socket.emit("brushColorChange", { roomID, color: newColor });
    }
  };

  const handleBrushSizeChange = (e, newSize) => {
    setBrushSize(newSize);

    if (socket) {
      console.log("Emitting brush size change:", newSize);
      socket.emit("brushSizeChange", { roomID, size: newSize });
    }
  };

  return (
    <div className="border-3 border-[#1e1e1e] h-160 w-50 p-4 flex flex-col gap-4 items-center justify-evenly">
      {/* Add Page Button */}
      <div className="flex flex-col items-center gap-4">
        <Button
          sx={{ width: "80px", height: "80px" }}
          variant="outlined"
          onClick={addPage}
        >
          <AddIcon />
        </Button>
        <p>Add Page</p>
      </div>

      {/* Add Canvas Button */}
      <div className="flex flex-col items-center gap-4">
        <Button
          sx={{ width: "80px", height: "80px" }}
          variant="outlined"
          onClick={addCanvas}
        >
          <AddIcon />
        </Button>
        <p>Add Canvas</p>
      </div>

      <Box sx={{ textAlign: "center", mb: 0 }}>
        <RadioGroup
          row
          value={brushColor}
          onChange={handleBrushColorChange}
          sx={{ gap: "5px", justifyContent: "center", mb: 2 }}
        >
          {["#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#000000"].map(
            (color) => (
              <FormControlLabel
                key={color}
                value={color}
                control={
                  <Radio
                    disableRipple
                    sx={{
                      padding: "2px",
                      "&.Mui-checked": { color: color },
                      "&:hover": { opacity: 0.8 },
                    }}
                    icon={
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: color,
                          borderRadius: "50%",
                          border: `3px solid ${brushColor === color ? "#90caf9" : "transparent"}`,
                          transition: "0.3s ease-in-out",
                        }}
                      />
                    }
                    checkedIcon={
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: color,
                          borderRadius: "50%",
                          border: `3px solid #90caf9`,
                          transition: "0.3s ease-in-out",
                        }}
                      />
                    }
                    checked={brushColor === color}
                  />
                }
                label=""
                sx={{ margin: "0px" }}
              />
            )
          )}
        </RadioGroup>
        <p>Brush Color</p>
      </Box>

      <Box sx={{ width: "150px", textAlign: "center" }}>
        <Slider
          value={brushSize}
          onChange={handleBrushSizeChange}
          min={1}
          max={10}
          sx={{
            color: "blue",
            "& .MuiSlider-thumb": {
              backgroundColor: "#fff",
              height: "15px",
              width: "15px",
            },
            "& .MuiSlider-track": { backgroundColor: "#90caf9" },
            "& .MuiSlider-rail": { backgroundColor: "#666" },
          }}
        />
        <p>
          Brush Size : <span sx={{ color: "white", mt: 1 }}>{brushSize}px</span>
        </p>
      </Box>
    </div>
  );
};

export default Toolbar;
