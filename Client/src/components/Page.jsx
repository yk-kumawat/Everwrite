import React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

const Page = ({ id, value, onChange, deleteElement }) => {
  const [isHovered, setIsHovered] = useState(false);
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
    >
      <TextField
        placeholder="Page"
        variant="outlined"
        multiline
        value={value}
        onChange={onChange}
        fullWidth
        rows={20}
        sx={{
          backgroundColor: "#1e1e1e",
          borderRadius: "5px",
          input: { color: "white" },
          textarea: { color: "white" },
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {isHovered && (
        <Button
          variant="outlined"
          color="error"
          onClick={() => deleteElement(id)}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            minWidth: "unset",
            width: "20px",
            height: "40px",
            transition: "opacity 0.3s ease-in-out",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <DeleteIcon sx={{ fontSize: 18 }} />
        </Button>
      )}
    </Box>
  );
};

export default Page;
