import React, { useState } from "react";
import { TableCell, TextField } from "@mui/material";

const EditableCell = ({ value, isEditable, onChange }) => {
  const [cellValue, setCellValue] = useState(value);

  const handleValueChange = (event) => {
    setCellValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <TableCell>
      {isEditable ? (
        <TextField fullWidth value={cellValue} onChange={handleValueChange} />
      ) : (
        cellValue
      )}
    </TableCell>
  );
};

export default EditableCell;
