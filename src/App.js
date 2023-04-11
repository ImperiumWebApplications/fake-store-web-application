import React, { useEffect, useState } from "react";
import CategorySidebar from "./components/CategorySidebar";
import ProductTable from "./components/ProductTable";
import Header from "./components/Header";
import { Container, Grid } from "@mui/material";

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((json) => setCategories(json));
  }, []);

  return (
    <div className="App">
      <Header />
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <CategorySidebar
              categories={categories}
              onSelectCategory={setSelectedCategory}
            />
          </Grid>
          <Grid item xs={9}>
            <ProductTable selectedCategory={selectedCategory} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
