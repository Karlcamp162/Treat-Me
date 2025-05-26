import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import MyNavbar from "../components/Navbar";

const OrderNow = () => {
  const [orders, setOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [usersMap, setUsersMap] = useState({});

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.email === "admin@example.com";

  useEffect(() => {
    axios.get("http://127.0.0.1:3000/api/v1/users")
      .then(res => {
        const map = {};
        res.data.forEach(u => map[u.id] = u);
        setUsersMap(map);
      })
      .catch(err => console.error("Failed to fetch users:", err));
  }, []);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
    setTotalPrice(savedOrders.reduce((sum, item) => sum + parseFloat(item.item_price), 0));

    const fetchConfirmedOrders = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:3000/api/ordered_items");
        const data = res.data;
        setConfirmedOrders(
          isAdmin ? data : data.filter(order => order.user_id === user.id)
        );
      } catch (error) {
        console.error("Error fetching confirmed orders:", error);
      }
    };

    fetchConfirmedOrders();
  }, [user.id, isAdmin]);

  const removeItem = (index) => {
    const newOrders = [...orders];
    newOrders.splice(index, 1);
    setOrders(newOrders);
    setTotalPrice(newOrders.reduce((sum, item) => sum + parseFloat(item.item_price), 0));
    localStorage.setItem("orders", JSON.stringify(newOrders));
  };

  const confirmOrder = async () => {
    if (orders.length === 0) return;

    const payloads = orders.map(order => ({
      user_id: user.id,
      item_id: order.id,
      quantity: 1,
      total_price: parseFloat(order.item_price),
      completed: false
    }));

    try {
      await Promise.all(
        payloads.map(order =>
          axios.post("http://127.0.0.1:3000/api/ordered_items", { ordered_item: order })
        )
      );

      localStorage.removeItem("orders");
      setOrders([]);
      setOrderConfirmed(true);
      setTimeout(() => navigate("/"), 4000);
    } catch (error) {
      console.error("Error confirming the order:", error);
    }
  };

  const toggleComplete = async (order) => {
    try {
      const updated = { ...order, completed: !order.completed };
      await axios.put(`http://127.0.0.1:3000/api/ordered_items/${order.id}`, {
        ordered_item: updated,
      });

      setConfirmedOrders((prev) =>
        prev.map((o) => (o.id === order.id ? updated : o))
      );
    } catch (error) {
      console.error("Failed to toggle completion:", error);
    }
  };

  const deleteConfirmedOrder = async (orderId) => {
    try {
      await axios.delete(`http://127.0.0.1:3000/api/ordered_items/${orderId}`);
      setConfirmedOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  const completedOrdersCount = confirmedOrders.filter(o => o.completed).length;
  const notCompletedOrdersCount = confirmedOrders.filter(o => !o.completed).length;

  const groupedByUser = confirmedOrders.reduce((acc, order) => {
    const uid = order.user_id;
    if (!acc[uid]) acc[uid] = [];
    acc[uid].push(order);
    return acc;
  }, {});

  return (
    <>
      <MyNavbar />
      <div className="flex flex-col min-h-screen bg-yellow-50 p-6 mt-12">
        <h1 className="text-center text-4xl text-red-800 mb-6">Order Summary</h1>

        {orderConfirmed && (
          <div className="bg-green-500 text-white text-center py-2 rounded mb-4">
            ✅ Order Confirmed! Redirecting to home...
          </div>
        )}

        <div className="shadow-md bg-yellow-100 p-6 rounded-lg mb-6">
          {orders.length > 0 ? (
            <>
              <table className="table-auto w-full mb-4 border">
                <thead className="bg-yellow-400 text-red-800">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Item</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item, index) => (
                    <tr key={index} className="border-t text-center">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{item.item_name}</td>
                      <td className="px-4 py-2">${parseFloat(item.item_price).toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-400"
                          onClick={() => removeItem(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h4 className="text-right text-green-700 text-xl font-semibold">
                Total: ${totalPrice.toFixed(2)}
              </h4>
              <div className="text-center mt-4">
                <button
                  className="bg-yellow-500 text-black px-6 py-2 rounded-full hover:bg-yellow-400 font-semibold"
                  onClick={confirmOrder}
                >
                  Confirm Order
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600">No orders yet.</p>
          )}
        </div>

        {confirmedOrders.length > 0 && (
          <div className="shadow-md bg-blue-200 p-6 rounded-lg mt-8">
            <h2 className="text-2xl text-green-700 text-center mb-4">
              {isAdmin ? "All Confirmed Orders" : "Your Confirmed Orders"}
            </h2>

            <div className="mb-4 text-center text-lg">
              <p className="text-green-600">Completed Orders: {completedOrdersCount}</p>
              <p className="text-red-600">Pending Orders: {notCompletedOrdersCount}</p>
            </div>

            {isAdmin
              ? Object.entries(groupedByUser).map(([userId, userOrders]) => {
                  const u = usersMap[userId] || {};
                  return (
                    <div key={userId} className="mb-8 bg-white p-4 rounded shadow">
                      <h3 className="text-xl font-bold text-red-700 mb-2">
                        {u.user_name || u.name || "Unknown User"} ({u.email})
                      </h3>
                      <p className="text-sm mb-2 text-gray-600">
                        📞 {u.phone_num || "N/A"} | 🏠 {u.address || "N/A"}
                      </p>
                      <table className="table-auto w-full border text-center">
                        <thead className="bg-green-400 text-white">
                          <tr>
                            <th className="px-4 py-2">#</th>
                            <th className="px-4 py-2">Item</th>
                            <th className="px-4 py-2">Total</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userOrders.map((order, idx) => (
                            <tr key={order.id} className="border-t hover:bg-yellow-50">
                              <td className="px-4 py-2">{idx + 1}</td>
                              <td className="px-4 py-2">{order.item?.item_name || `Item #${order.item_id}`}</td>
                              <td className="px-4 py-2">₱{parseFloat(order.total_price).toFixed(2)}</td>
                              <td className="px-4 py-2">
                                {order.completed ? "✅ Completed" : "❌ Pending"}
                              </td>
                              <td className="px-4 py-2 space-x-2">
                                <button
                                  className={`px-3 py-1 rounded-full text-white text-sm ${
                                    order.completed
                                      ? "bg-red-600 hover:bg-red-500"
                                      : "bg-green-600 hover:bg-green-500"
                                  }`}
                                  onClick={() => toggleComplete(order)}
                                >
                                  {order.completed ? "Mark Incomplete" : "Mark Completed"}
                                </button>
                                <button
                                  className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-full text-sm"
                                  onClick={() => deleteConfirmedOrder(order.id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })
              : (
                <table className="table-auto w-full border text-center bg-white">
                  <thead className="bg-green-500 text-white">
                    <tr>
                      <th className="px-4 py-2">#</th>
                      <th className="px-4 py-2">Item</th>
                      <th className="px-4 py-2">Total</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confirmedOrders.map((order, index) => (
                      <tr key={order.id} className="border-t hover:bg-yellow-50">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{order.item?.item_name || `Item #${order.item_id}`}</td>
                        <td className="px-4 py-2">₱{parseFloat(order.total_price).toFixed(2)}</td>
                        <td className="px-4 py-2">
                          {order.completed ? "✅ Completed" : "❌ Pending"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderNow;
