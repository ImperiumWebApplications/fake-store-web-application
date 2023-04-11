import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faTrash,
  faSave,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import EditableCell from "./EditableCell";

const ProductTable = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [editableRowId, setEditableRowId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [newRows, setNewRows] = useState([]);

  useEffect(() => {
    const categoryFilter = selectedCategory
      ? "/category/" + selectedCategory
      : "";

    fetch("https://fakestoreapi.com/products" + categoryFilter)
      .then((res) => res.json())
      .then((json) => setProducts(json));
  }, [selectedCategory]);

  const handleEdit = (id) => {
    setEditableRowId(id);
  };

  const handleSave = (id) => {
    const strId = id.toString();
    if (strId.startsWith("new-")) {
      handleNewProductSave(id);
    } else {
      // Save edited data using API post request
      fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...editedData,
          description: "lorem ipsum set",
          image: "https://i.pravatar.cc",
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          setProducts(
            products.map((product) =>
              product.id === id ? { ...product, ...editedData } : product
            )
          );
        });
      setEditableRowId(null);
      setEditedData({});
    }
  };

  const handleNewProductSave = (tempId) => {
    fetch("https://fakestoreapi.com/products", {
      method: "POST",
      body: JSON.stringify({
        ...editedData[tempId],
        description: "lorem ipsum set",
        image: "https://i.pravatar.cc",
        category: selectedCategory || "",
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        // Merge the new product data with the products array
        setProducts([{ ...json, ...editedData[tempId] }, ...products]);
        setNewRows(newRows.filter((row) => row !== tempId));
        setEditableRowId(null);
        setEditedData((prevData) => {
          const newData = { ...prevData };
          delete newData[tempId];
          return newData;
        });
      });
  };

  const handleDelete = (id) => {
    const strId = id.toString();
    if (strId.startsWith("new-")) {
      setNewRows(newRows.filter((row) => row !== id));
      setEditedData({});
    } else {
      // Delete row using API delete request
      fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((json) => {
          setProducts(products.filter((product) => product.id !== id));
        });
    }
  };

  const handleAdd = () => {
    const tempId = "new-" + Date.now();
    setNewRows([...newRows, tempId]);
    setEditableRowId(tempId);
  };

  const handleFieldChange = (id, field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [id]: { ...prevData[id], [field]: value },
    }));
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Price</TableCell>
              <TableCell style={{ display: "flex", alignItems: "center" }}>
                Actions
                <IconButton onClick={handleAdd}>
                  <FontAwesomeIcon icon={faPlusCircle} />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newRows.map((tempId) => (
              <TableRow key={tempId}>
                <EditableCell
                  value={(editedData[tempId] && editedData[tempId].title) || ""}
                  isEditable={editableRowId === tempId}
                  onChange={(value) =>
                    handleFieldChange(tempId, "title", value)
                  }
                />
                <EditableCell
                  value={(editedData[tempId] && editedData[tempId].price) || ""}
                  isEditable={editableRowId === tempId}
                  onChange={(value) =>
                    handleFieldChange(tempId, "price", value)
                  }
                />
                <TableCell>
                  <IconButton onClick={() => handleSave(tempId)}>
                    <FontAwesomeIcon icon={faSave} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(tempId)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {products.map((product) => (
              <TableRow key={product.id}>
                <EditableCell
                  value={
                    (editedData[product.id] && editedData[product.id].title) ||
                    product.title
                  }
                  isEditable={editableRowId === product.id}
                  onChange={(value) =>
                    handleFieldChange(product.id, "title", value)
                  }
                />
                <EditableCell
                  value={
                    (editedData[product.id] && editedData[product.id].price) ||
                    product.price
                  }
                  isEditable={editableRowId === product.id}
                  onChange={(value) =>
                    handleFieldChange(product.id, "price", value)
                  }
                />
                <TableCell>
                  {editableRowId === product.id ? (
                    <IconButton onClick={() => handleSave(product.id)}>
                      <FontAwesomeIcon icon={faSave} />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleEdit(product.id)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </IconButton>
                  )}

                  <IconButton onClick={() => handleDelete(product.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProductTable;
