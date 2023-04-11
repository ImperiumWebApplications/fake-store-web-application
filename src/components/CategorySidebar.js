import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";

const CategorySidebar = ({ categories, onSelectCategory }) => {
  return (
    <List>
      {categories.map((category, index) => (
        <ListItem button key={index} onClick={() => onSelectCategory(category)}>
          <ListItemText primary={category} />
        </ListItem>
      ))}
    </List>
  );
};

export default CategorySidebar;
