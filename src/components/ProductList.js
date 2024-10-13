import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import productData from "./products";
import { useCart } from "react-use-cart";
import { Link } from "react-router-dom";
import "./responsive.css";

function ProductList() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [quantity, setQuantity] = useState(
    productData.map((prod) => {
      return { id: prod.id, qty: 0 };
    })
  );
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");

  const { items, addItem, updateItem } = useCart();

  const showAlert = (message, type) => {
    document.getElementById("alert").classList.add(type);
    document.getElementById("alert").innerText = message;
    document.getElementById("alert").classList.remove("modal");
    setTimeout(() => {
      document.getElementById("alert").classList.remove(type);
      document.getElementById("alert").innerText = "";
      document.getElementById("alert").classList.add("modal");
    }, 1500);
  };

  const getProducts = () => {
    try {
      setProducts(productData);
      setFilteredProducts(productData);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const columns = [
    {
      name: "Image",
      selector: (row) => (
        <div className="fixed-image-column">
          <img
            style={{ height: "50px", width: "50px", objectFit: "cover" }}
            src={row.image}
            alt={row.name}
          />
        </div>
      ),
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Color",
      selector: (row) => row.color,
      sortable: true,
    },
    {
      name: "Size",
      selector: (row) => row.size,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Stock",
      selector: (row) =>
        row.inStock ? (
          <span style={{ color: "green" }}>
            <i className="fa-solid fa-face-smile"></i> In stock
          </span>
        ) : (
          <span style={{ color: "red" }}>
            <i className="fa-solid fa-face-frown"></i> Out of stock
          </span>
        ),
    },
    {
      name: "Total Available Quantity",
      selector: (row) =>
        items.some((item) => item["id"] === row.id)
          ? items[items.findIndex((x) => x.id === row.id)][
              "updatedAvailableQuantity"
            ]
          : row.totalAvailableQuantity,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => "$" + row.price.toFixed(2),
      sortable: true,
    },
    {
      name: "Buy",
      cell: (row) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",

            gap: "10px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <input
            style={{
              maxWidth: "40px",
              height: "35px",
              borderRadius: "0px",
              textAlign: "center",
              boxSizing: "border-box",
              flex: "1",
              marginBottom: "5px",
              fontSize: "14px",
            }}
            type="number"
            value={quantity[row.id - 1]?.qty || ""}
            onChange={(event) => {
              let inputValue = parseInt(event.target.value);
              let updatedQty = [...quantity];
              updatedQty[row.id - 1].qty =
                isNaN(inputValue) || inputValue < 0 ? 0 : inputValue;
              setQuantity(updatedQty);
            }}
          />

          <button
            style={{
              width: "100%",
              maxWidth: "140px",
              height: "40px",
              borderRadius: "0px",
              backgroundColor: "#343a40",
              color: "white",
              border: "none",
              fontSize: "14px",
              cursor: "pointer",
              marginBottom: "5px",
            }}
            onClick={() => {}}
          >
            <i className="fa-solid fa-cart-shopping fa-xs"></i>
          </button>

          <input
            type="checkbox"
            key={row.id}
            id={row.id}
            style={{
              marginTop: "5px",
              height: "20px",
              width: "20px",
              flexShrink: "1",
              marginRight: "10px",
              marginBottom: "5px",
            }}
            disabled={
              quantity[row.id - 1]?.qty < 1 ||
              row.totalAvailableQuantity <= quantity[row.id - 1]?.qty
            }
            onChange={() => {
              if (quantity[row.id - 1]?.qty < 1) {
                showAlert(
                  "Product quantity should be greater than 0",
                  "alert-danger"
                );
                return;
              } else if (
                quantity[row.id - 1]?.qty > row.totalAvailableQuantity
              ) {
                showAlert(
                  "Specified quantity of product is not available",
                  "alert-danger"
                );
                return;
              }

              if (items.some((item) => item["id"] === row.id)) {
                let itemIndex = items.findIndex((x) => x.id === row.id);
                if (
                  quantity[row.id - 1]?.qty >
                  items[itemIndex]["updatedAvailableQuantity"]
                ) {
                  showAlert(
                    "Specified quantity of product is not available",
                    "alert-danger"
                  );
                  return;
                } else {
                  updateItem(row.id, {
                    quantity:
                      items[itemIndex]["quantity"] + quantity[row.id - 1]?.qty,
                    updatedAvailableQuantity:
                      items[itemIndex]["updatedAvailableQuantity"] -
                      quantity[row.id - 1]?.qty,
                  });
                  showAlert(
                    "Product quantity updated in cart",
                    "alert-success"
                  );
                }
              } else {
                addItem(
                  {
                    id: row.id,
                    image: row.image,
                    name: row.name,
                    price: row.price,
                    updatedAvailableQuantity:
                      row.totalAvailableQuantity - quantity[row.id - 1]?.qty,
                  },
                  quantity[row.id - 1]?.qty
                );
                showAlert("Product added to cart", "alert-success");
              }
            }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    let resl;
    if (search) {
      resl = products.filter((product) => {
        return (
          product.name.toLowerCase().match(search.toLowerCase()) ||
          product.name
            .replace(/-/g, "")
            .toLowerCase()
            .match(search.replace(/-/g, "").toLowerCase())
        );
      });

      setFilteredProducts(resl);
    }

    if (categoryFilter) {
      resl = products.filter((product) => {
        return sizeFilter
          ? product.size.toLowerCase() === sizeFilter.toLowerCase() &&
              product.category.toLowerCase() === categoryFilter.toLowerCase()
          : product.category.toLowerCase() === categoryFilter.toLowerCase();
      });

      setFilteredProducts(resl);

      if (search) {
        resl = filteredProducts.filter((product) => {
          return (
            product.name.toLowerCase().match(search.toLowerCase()) ||
            product.name
              .replace(/-/g, "")
              .toLowerCase()
              .match(search.replace(/-/g, "").toLowerCase())
          );
        });

        setFilteredProducts(resl);
      }
    }
    if (sizeFilter) {
      resl = products.filter((product) => {
        return categoryFilter
          ? product.category.toLowerCase() === categoryFilter.toLowerCase() &&
              product.size.toLowerCase() === sizeFilter.toLowerCase()
          : product.size.toLowerCase() === sizeFilter.toLowerCase();
      });

      setFilteredProducts(resl);

      if (search) {
        resl = filteredProducts.filter((product) => {
          return (
            product.name.toLowerCase().match(search.toLowerCase()) ||
            product.name
              .replace(/-/g, "")
              .toLowerCase()
              .match(search.replace(/-/g, "").toLowerCase())
          );
        });

        setFilteredProducts(resl);
      }
    }

    !search &&
      !categoryFilter &&
      !sizeFilter &&
      setFilteredProducts(productData);
    // eslint-disable-next-line
  }, [search, categoryFilter, sizeFilter]);

  return (
    <div className="container mt-2">
      <h2 style={{ textAlign: "center" }}>Product List</h2>
      <div
        className="alert alert-dismissible fade show modal"
        id="alert"
        role="alert"
      ></div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          "@media (max-width: 768px)": {
            display: "flex",
            flexDirection: "column",
          },
          justifyContent: "space-between",
          alignItems: "center",

          padding: "10px",
          flexWrap: "wrap",
          gap: "30px",
        }}
      >
        <div
          style={{
            flexWrap: "wrap", // Allow wrapping of elements on smaller screens
            gap: "10px", // Space between elements
            justifyContent: "space-between",
            // border: "1px solid maroon",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <select
              className="form-select me-1"
              style={{
                width: "100%",
                maxWidth: "140px", // Limit the width on smaller screens
                borderRadius: "0px",
                boxSizing: "border-box",
              }}
              name="category"
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="" disabled>
                Category
              </option>
              <option value="hoodie">Hoodie</option>
              <option value="t-shirt">T-Shirt</option>
            </select>

            <select
              className="form-select me-3"
              style={{
                width: "100%",
                maxWidth: "140px", // Limit the width on smaller screens
                borderRadius: "0px",
                boxSizing: "border-box",
              }}
              name="size"
              id="size"
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
            >
              <option value="" disabled>
                Size
              </option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>

          <div>
            <span
              style={{
                color: "blue",
                cursor: "pointer",
                // border: "1px solid blue",
                // marginRight: "10px",
                // marginTop: "5px",
              }}
              onClick={() => {
                setFilteredProducts(productData);
                setCategoryFilter("");
                setSizeFilter("");
              }}
            >
              <i className="fa-solid fa-arrow-rotate-left"></i> Reset
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",

            "@media (max-width: 768px)": {
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
            },
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "blue" }}>Search:</span>
            <input
              type="text"
              style={{}}
              className="form-control ms-1 me-3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Link
            className="btn btn-primary"
            to="/cart"
            style={{
              borderRadius: "0px",
              whiteSpace: "nowrap",
              width: "100%",
              maxWidth: "150px",
              padding: "10px 20px",
              textAlign: "center",
              boxSizing: "border-box",
            }}
          >
            Add to Cart
          </Link>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <DataTable
          columns={columns}
          data={filteredProducts}
          fixedHeader
          selectableRowsHighlight
          highlightOnHover
          subHeader
          subHeaderAlign="left"
        />
      </div>
    </div>
  );
}

export default ProductList;
