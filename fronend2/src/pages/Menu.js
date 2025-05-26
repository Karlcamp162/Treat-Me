import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MyNavbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const Menu = () => {
  const { user } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newItem, setNewItem] = useState({ name: "", description: "", price: "", img: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    axios
      .get("http://127.0.0.1:3000/api/items")
      .then((response) => {
        setMenuItems(response.data);
      })
      .catch(() => setError("Failed to load menu items."));
  }, []);

  const addToOrder = (item) => {
    if (!item.availability) return;
    setOrders((prevOrders) => [...prevOrders, item]);
  };

  const removeFromOrder = (index) => {
    setOrders((prevOrders) => prevOrders.filter((_, i) => i !== index));
  };

  const placeOrder = () => {
    if (orders.length === 0) return;
    const pendingOrders = orders.map((order) => ({
      ...order,
      status: "pending",
    }));
    localStorage.setItem("orders", JSON.stringify(pendingOrders));
    navigate("/ordereditems");
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleCreateItem = () => {
    setError("");
    if (!isAdmin) return;

    const { name, description, price, img } = newItem;

    if (!name || !description || !price || !img) {
      setError("Please fill in all fields to add a new item.");
      return;
    }

    axios
      .post("http://127.0.0.1:3000/api/items", {
        item: {
          item_name: name,
          item_description: description,
          item_price: price,
          item_img: img,
          availability: true,
        },
      })
      .then((response) => {
        setMenuItems((prevItems) => [...prevItems, response.data]);
        setNewItem({ name: "", description: "", price: "", img: "" });
      })
      .catch(() => setError("Failed to create new item."));
  };

  const handleDeleteItem = (id) => {
    if (!isAdmin) return;
    axios
      .delete(`http://127.0.0.1:3000/api/items/${id}`)
      .then(() => {
        setMenuItems(menuItems.filter((item) => item.id !== id));
      })
      .catch(() => setError("Failed to delete item."));
  };

  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.item_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPrice = orders.reduce((sum, item) => sum + parseFloat(item.item_price), 0);

  return (
    <div className="min-h-screen bg-yellow-300">
      <MyNavbar />
      <div className="container mx-auto py-12 px-6 mt-8">
        <h1 className="text-center text-4xl font-bold text-red-800 mb-8">Our Menu</h1>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search Menu"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-1/2 p-3 rounded-lg border border-gray-300"
          />
        </div>

        {error && (
          <div className="mb-6 text-center text-red-700 font-semibold">{error}</div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Menu Items */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-yellow-50 p-4 rounded-lg shadow-md hover:bg-yellow-200 transition ${
                    !item.availability ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <img
                    src={item.item_img}
                    alt={item.item_name}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <h3 className="text-lg font-semibold text-red-600">{item.item_name}</h3>
                  <p className="text-sm text-gray-700 mb-2">{item.item_description}</p>
                  <h5 className="text-green-600 text-xl mb-2">
                    ${parseFloat(item.item_price).toFixed(2)}
                  </h5>
                  <button
                    disabled={!item.availability}
                    className={`mt-4 px-4 py-2 rounded-full text-white ${
                      item.availability
                        ? "bg-blue-500 hover:bg-blue-400 cursor-pointer"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={() => addToOrder(item)}
                  >
                    {item.availability ? "Add to Order" : "Unavailable"}
                  </button>
                  {isAdmin && (
                    <button
                      className="mt-4 ml-4 px-4 py-2 bg-red-700 text-white rounded-full hover:bg-red-600"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Order Panel */}
          <div className="w-full lg:w-1/3 bg-yellow-50 p-6 rounded-lg shadow-lg sticky top-0 max-h-[calc(100vh-3rem)] overflow-y-auto">
            <h4 className="text-center text-xl text-red-800 mb-6">Your Orders</h4>
            {orders.length > 0 ? (
              <>
                <ul className="space-y-4 mb-6">
                  {orders.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center border-b border-gray-300 pb-2"
                    >
                      <span>
                        {item.item_name} - ${parseFloat(item.item_price).toFixed(2)}
                      </span>
                      <button
                        className="bg-red-600 text-white p-1 rounded-full hover:bg-red-500"
                        onClick={() => removeFromOrder(index)}
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mb-4 font-semibold text-right text-green-700 text-lg">
                  Total: ${totalPrice.toFixed(2)}
                </div>
                <button
                  className="w-full py-3 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 font-semibold"
                  onClick={placeOrder}
                >
                  Place Order
                </button>
              </>
            ) : (
              <p className="text-center text-gray-500">No items added</p>
            )}
          </div>
        </div>

        {/* Admin Section - Add New Item */}
        {isAdmin && (
          <div className="mt-12 p-8 bg-blue-400 rounded-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Add New Item</h2>
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full p-3 mb-4 rounded-lg border border-gray-300"
            />
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full p-3 mb-4 rounded-lg border border-gray-300"
            />
            <input
              type="number"
              placeholder="Price"
              min="0"
              step="0.01"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="w-full p-3 mb-4 rounded-lg border border-gray-300"
            />
            <input
              type="text"
              placeholder="Image URL (full URL)"
              value={newItem.img}
              onChange={(e) => setNewItem({ ...newItem, img: e.target.value })}
              className="w-full p-3 mb-4 rounded-lg border border-gray-300"
            />
            <button
              onClick={handleCreateItem}
              className="w-full py-3 bg-green-500 text-white rounded-full hover:bg-green-400"
            >
              Add Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
