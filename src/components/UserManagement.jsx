import { useEffect, useState } from "react";
import Shimmer from "./ShimmerEffect";

function App() {
  const [users, setUsers] = useState([]); // State to displaying users
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" }); // State to store form data for users
  const [editUserId, setEditUserId] = useState(null); // State to check if a user is being edited
  const [isAddingNewUser, setIsAddingNewUser] = useState(false); // State for adding new user
  const [errors, setErrors] = useState({}); // State for form validation errors

  useEffect(() => {
    // Fetching delay for the shimmer effect
    setTimeout(() => {
      fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) => response.json())
        .then((data) => {
          setUsers(data);
          setLoading(false);
        });
    }, 1000); // Delay for showing shimmer effect
  }, []);

  const handleAddingUser = () => {
    setIsAddingNewUser(true);
    // Clear the form
    setFormData({ name: "", email: "", phone: "" });
    setEditUserId(null);
  };

  // Handling input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validation for form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be exactly 10 digits";
    return newErrors;
  };

  // Adding or Updatng a user
  const saveUser = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});

    if (editUserId) {
      // Update existing user
      setUsers(
        users.map((user) =>
          user.id === editUserId
            ? {
                ...user,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
              }
            : user
        )
      );
    } else {
      // Adding new user
      const newUser = {
        id: users.length + 1,
        ...formData,
      };
      setUsers([...users, newUser]);
    }

    // Reset the form
    setFormData({ name: "", email: "", phone: "" });
    setIsAddingNewUser(false);
    setEditUserId(null);
  };

  // To delete a user
  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // To edit a user
  const editUser = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      phone: userToEdit.phone,
    });
    setIsAddingNewUser(true);
    setEditUserId(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-black text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8">User Management</h1>

      <button
        onClick={handleAddingUser}
        className="bg-purple-700 text-white font-semibold py-2 px-4 rounded hover:bg-purple-800 transition mb-6 mx-auto block"
      >
        Add User
      </button>

      {isAddingNewUser && (
        <div className="bg-black bg-opacity-50 p-6 rounded shadow-lg max-w-xl mx-auto mb-6">
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="phone"
              placeholder="Phone (10 digits)"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <button
            onClick={saveUser}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            {editUserId ? "Update User" : "Add User"}
          </button>
        </div>
      )}

      {/* Conditionally Render Shimmer or Users */}
      {loading ? (
        <Shimmer />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="bg-gray-800 p-4 rounded shadow-lg flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
                  <p className="text-sm mb-2">Email: {user.email}</p>
                  <p className="text-sm mb-4">Phone: {user.phone}</p>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => editUser(user.id)}
                    className="bg-purple-600 text-white font-semibold py-1 px-2 rounded hover:bg-purple-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-600 text-white font-semibold py-1 px-2 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full">No users found.</p>
          )}
        </div>
      )}
      <footer className="mt-8 text-center">
        <p className="text-white font-light">Created by Deepika Singh</p>
      </footer>
    </div>
  );
}

export default App;
