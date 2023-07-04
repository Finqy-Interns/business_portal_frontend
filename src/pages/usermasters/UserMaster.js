import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './UserMaster.css'
import { BsBorder } from "react-icons/bs";
import {
  checkTokenValidity,
  getTokenData,
  getToken,
} from "../../utils/token.utils";
import axios from "axios";
import { FaPen } from "react-icons/fa";

const options = [
  { value: "Product 1", label: "Product 1" },
  { value: "Product 2", label: "Product 2" },
  { value: "Product 3", label: "Product 3" },
  { value: "Product 4", label: "Product 4" },
  { value: "Product 5", label: "Product 5" },
  { value: "Product 6", label: "Product 6" },
  { value: "Product 8", label: "Product 8" },
  { value: "Product 9", label: "Product 9" },
  { value: "Product 10", label: "Product 10" },
  { value: "Product 11", label: "Product 11" },
  { value: "Product 12 ", label: "Product 12" },
  { value: "Product 13", label: "Product 13" },
];

const  UserMaster = ({ setActivePage }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    setActivePage("um")
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== -1) {
      // Edit an existing user
      const updatedUsers = [...users];
      updatedUsers[editIndex] = {
        name,
        password,
        products: selectedProducts.map((product) => product.value).join(", "),
        role,
      };
      setUsers(updatedUsers);
      setEditIndex(-1);
    } else {
      // Create a new user object
      const newUser = {
        name,
        password,
        products: selectedProducts.map((product) => product.value).join(", "),
        role,
      };

      // Add the new user to the users array
      setUsers([...users, newUser]);
    }

    // Clear the input fields
    setName("");
    setPassword("");
    setSelectedProducts([]);
    setRole("");
  };

  const handleEdit = (index) => {
    const selectedUser = users[index];
    setName(selectedUser.name);
    setPassword(selectedUser.password);
    setSelectedProducts(
      selectedUser.products
        .split(", ")
        .map((product) => ({ value: product, label: product }))
    );
    setRole(selectedUser.role);
    setEditIndex(index);
  };
  async function fetchusers() {
    try {
      const token = getToken()
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/admin/user`,
        {
          headers: {
            authorization: `Bearer${token}`, // Replace with your actual token
          },
        }
      );


      const data = await response.data.data;
      console.log(data);

      setUsers(data);
      console.log(users);
      // console.log(roles); // Update the state with the received role data
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }

  useEffect(() => {
    // user.products.length > 0
    // ? 
    // : "No products"
    // user.products.map((product) => product.name).join(", ")
    users.map(user=>{
      console.log(user.products.map((product) => product.name).join(", "))
    })
  }, [users])

  useEffect(()=>{
    fetchusers()
  },[])

  return (
    <div className="user-master-page">
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="input_container">
            <label htmlFor="username">Username:</label>
            <input
              style={{
                backgroundColor: "white",
                color: "red",
                border: "solid thin lightgrey",
              }}
              className="inputs"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="username">Password:</label>
            <input
              style={{
                backgroundColor: "white",
                color: "red",
                border: "solid thin lightgrey",
              }}
              className="inputs"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="dropdown-container">
            <div className="dropdown">
              <label htmlFor="products">Product:</label>
              <br></br>
              <Select
                id="products"
                maxMenuHeight={250}
                className="react-select--inline"
                classNamePrefix="react-select"
                options={options}
                isMulti
                value={selectedProducts}
                onChange={(selectedOptions) =>
                  setSelectedProducts(selectedOptions)
                }
              />
            </div>

            <div className="dropdown">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          {/* <button type="submit">Submit</button> */}
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#a70404",
              color: "white",
              border: "none",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Submit
          </button>
        </form>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Username</th>
            <th>Password</th>
            <th>Products</th>
            <th>Role</th>
            {/* <th>Action</th> */}
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.password}</td>
              <td>
                {user.products.length > 0
                  ? user.products.map((product) => product.name).join(", ")
                  : "No products"}
              </td>

              <td>
                {user.roles.length > 0
                  ? user.roles.map((role) => role.name).join(", ")
                  : "No products"}
              </td>

              {/* <td>{user.role[0]}</td> */}
              {/* <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserMaster;
