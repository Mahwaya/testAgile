let menuData = {
    categories: [],
    products: []
  };
  
  let currentCategory = null;
  
  document.addEventListener("DOMContentLoaded", () => {
    const backButton = document.getElementById("back-to-list");
    if (backButton) {
      backButton.addEventListener("click", () => {
        showListView();
      });
    }
  
    loadMenuData();
  });
  
  async function loadMenuData() {
    const url = "data/menu.json";
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to load menu.json: " + response.status);
      }
  
      const data = await response.json();
      menuData = data;
  
      console.log("Menu data loaded:", menuData);
  
      renderCategories();
    } catch (error) {
      console.error(error);
      showDataError();
    }
  }
  
  function showDataError() {
    const app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = "<p>Sorry, the menu failed to load. Please try again later.</p>";
  }
  
  /* Category view */
  
  function renderCategories() {
    const container = document.getElementById("category-buttons");
    if (!container || !Array.isArray(menuData.categories)) {
      return;
    }
  
    container.innerHTML = "";
  
    menuData.categories.forEach(categoryName => {
      const button = document.createElement("button");
      button.className = "category-btn";
      button.dataset.category = categoryName;
  
      const iconSpan = document.createElement("span");
      iconSpan.className = "icon";
      iconSpan.textContent = getCategoryIcon(categoryName);
  
      const labelSpan = document.createElement("span");
      labelSpan.textContent = categoryName;
  
      button.appendChild(iconSpan);
      button.appendChild(labelSpan);
  
      button.addEventListener("click", () => {
        onCategoryClick(categoryName);
      });
  
      container.appendChild(button);
    });
  }
  
  function getCategoryIcon(categoryName) {
    if (categoryName === "Starters") return "🍽";
    if (categoryName === "Main") return "🥘";
    if (categoryName === "Desserts") return "🍰";
    return "🍴";
  }
  
  function onCategoryClick(categoryName) {
    currentCategory = categoryName;
    console.log("Category selected:", categoryName);
    renderProductsByCategory(categoryName);
    showListView();
  }
  
  /* Week 5 product list view */
  
  function renderProductsByCategory(categoryName) {
    const listContainer = document.getElementById("product-list");
    if (!listContainer) return;
  
    const products = menuData.products.filter(
      product => product.category === categoryName
    );
  
    if (products.length === 0) {
      listContainer.innerHTML = `<p>No products found for ${categoryName}.</p>`;
      return;
    }
  
    listContainer.innerHTML = "";
  
    products.forEach(product => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.dataset.productId = product.id;
  
      if (product.image) {
        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;
        card.appendChild(img);
      }
  
      const title = document.createElement("h3");
      title.textContent = product.name;
      card.appendChild(title);
  
      if (product.calories) {
        const calories = document.createElement("p");
        calories.textContent = `Calories: ${product.calories}`;
        card.appendChild(calories);
      }
  
      const price = document.createElement("p");
      price.className = "price";
      price.textContent = formatPrice(product.price);
      card.appendChild(price);
  
      const detailButton = document.createElement("button");
      detailButton.textContent = "View details";
      detailButton.addEventListener("click", () => {
        showProductDetail(product.id);
      });
      card.appendChild(detailButton);
  
      listContainer.appendChild(card);
    });
  }
  
  function formatPrice(price) {
    if (typeof price === "number") {
      return `${price} PLN`;
    }
    return String(price);
  }
  
  /* Week 6 product detail view */
  
  function showProductDetail(productId) {
    const detailSection = document.getElementById("product-detail-section");
    const listSection = document.getElementById("product-list-section");
    const detailContainer = document.getElementById("product-detail");
  
    if (!detailSection || !listSection || !detailContainer) return;
  
    const product = menuData.products.find(p => p.id === productId);
    if (!product) {
      console.warn("Product not found for detail view:", productId);
      return;
    }
  
    listSection.hidden = true;
    detailSection.hidden = false;
  
    detailContainer.innerHTML = "";
  
    const card = document.createElement("article");
    card.className = "product-detail-card";
  
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "product-detail-image";
  
    if (product.image) {
      const img = document.createElement("img");
      img.src = product.image;
      img.alt = product.name;
      imageWrapper.appendChild(img);
    }
  
    const infoWrapper = document.createElement("div");
    infoWrapper.className = "product-detail-info";
  
    const header = document.createElement("div");
    header.className = "product-detail-header";
  
    const title = document.createElement("h2");
    title.textContent = product.name;
    header.appendChild(title);
  
    const meta = document.createElement("div");
    meta.className = "product-detail-meta";
  
    if (product.category) {
      const catChip = document.createElement("span");
      catChip.textContent = product.category;
      meta.appendChild(catChip);
    }
  
    if (product.calories) {
      const calChip = document.createElement("span");
      calChip.textContent = `${product.calories} kcal`;
      meta.appendChild(calChip);
    }
  
    const price = document.createElement("p");
    price.className = "product-detail-price";
    price.textContent = formatPrice(product.price);
  
    const body = document.createElement("div");
    body.className = "product-detail-body";
    body.textContent = product.description || "No description provided.";
  
    const ingredients = document.createElement("p");
    ingredients.className = "product-detail-ingredients";
    if (product.ingredients) {
      ingredients.textContent = "Ingredients: " + product.ingredients;
    }
  
    infoWrapper.appendChild(header);
    infoWrapper.appendChild(meta);
    infoWrapper.appendChild(price);
    infoWrapper.appendChild(body);
    if (product.ingredients) {
      infoWrapper.appendChild(ingredients);
    }
  
    card.appendChild(imageWrapper);
    card.appendChild(infoWrapper);
  
    detailContainer.appendChild(card);
  }
  
  function showListView() {
    const listSection = document.getElementById("product-list-section");
    const detailSection = document.getElementById("product-detail-section");
  
    if (listSection) listSection.hidden = false;
    if (detailSection) detailSection.hidden = true;
  
    if (currentCategory) {
      renderProductsByCategory(currentCategory);
    }
  }  
