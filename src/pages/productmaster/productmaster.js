import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './productmaster.css';
import Sidebar from "../../components/Sidebar";
import {
  checkTokenValidity,
  getTokenData,
  getToken,
} from "../../utils/token.utils";
import axios from "axios";
import { FaPen } from "react-icons/fa";

const ProductM = ({setActivePage}) => {
  const [activeTab, setActiveTab] = useState('product');
  const [showForm, setShowForm] = useState(false);
  const [productList, setProductList] = useState([]);
  const [subproductList, setSubproductList] = useState([]);
  const [channelList, setChannelList] = useState([]);
  const [itemName, setItemName] = useState('');
  const [editItemId, setEditItemId] = useState(null);

  const openTab = (tabName) => {
    setActiveTab(tabName);
    setShowForm(false);
    resetForm();
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditItemId(null);
    resetForm();
  };

  const addItem = (event) => {
    event.preventDefault();
    const newItem = {
      id: Date.now(),
      name: itemName,
    };
    switch (activeTab) {
      case 'product':
        setProductList([...productList, newItem]);
        break;
      case 'subproduct':
        setSubproductList([...subproductList, newItem]);
        break;
      case 'channel':
        setChannelList([...channelList, newItem]);
        break;
      default:
        break;
    }
    resetForm();
    setShowForm(false);
  };

  const editItem = (itemId) => {
    let itemToEdit;
    switch (activeTab) {
      case 'product':
        itemToEdit = productList.find((item) => item.id === itemId);
        break;
      case 'subproduct':
        itemToEdit = subproductList.find((item) => item.id === itemId);
        break;
      case 'channel':
        itemToEdit = channelList.find((item) => item.id === itemId);
        break;
      default:
        break;
    }
    if (itemToEdit) {
      setItemName(itemToEdit.name);
      setEditItemId(itemId);
      setShowForm(true);
    }
  };

  const updateItem = (event) => {
    event.preventDefault();
    const updatedList = getListByActiveTab().map((item) => {
      if (item.id === editItemId) {
        return {
          ...item,
          name: itemName,
        };
      }
      return item;
    });
    setListByActiveTab(updatedList);
    resetForm();
    setShowForm(false);
  };

  const deleteItem = (itemId) => {
    const updatedList = getListByActiveTab().filter((item) => item.id !== itemId);
    setListByActiveTab(updatedList);
  };

  const resetForm = () => {
    setItemName('');
  };

  const getListByActiveTab = () => {
    switch (activeTab) {
      case 'product':
        return productList;
      case 'subproduct':
        return subproductList;
      case 'channel':
        return channelList;
      default:
        return [];
    }
  };

  const setListByActiveTab = (updatedList) => {
    switch (activeTab) {
      case 'product':
        setProductList(updatedList);
        break;
      case 'subproduct':
        setSubproductList(updatedList);
        break;
      case 'channel':
        setChannelList(updatedList);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setActivePage("porductmasters")
    fetchproductList();
    fetchsubproductList();
    fetchchannelList();
  }, []);

// Add a new item
const addProduct = async (event) => {
  event.preventDefault();
  const newProduct = {
    name: itemName,
  };

  try {
    // Send a POST request to the API endpoint to add the new product
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/admin/product`,
      newProduct
    );

    // Handle the response and update the state accordingly
    const addedProduct = response.data;
    setProductList([...productList, addedProduct]);
    resetForm();
    setShowForm(false);

    // Show a success message to the user (optional)
    alert("Product added successfully!");
  } catch (error) {
    console.error("Error adding product:", error);
    // Handle the error appropriately (e.g., display an error message to the user)
    alert("Failed to add product. Please try again.");
  }
};

//get products
async function fetchproductList() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/admin/product`,
      {
        headers: {
          authorization:
            "BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imt1c2hhZ3JhQGZpbnF5LmFpIiwicm9sZSI6ImZpbmFuY2VfYWRtaW4iLCJpYXQiOjE2ODc3NjM4OTUsImV4cCI6MTY4Nzc5OTg5NX0.aBKByRKPCrmf7u-Nf9KOZ9GEbulLill_Be2A95hesuk", // Replace with your actual token
        },
      }
    );

    //  const [roles, setRoles] = useState([]);
    const data = await response.data.data;
    console.log(data);

    setProductList(data);
    console.log(productList);
    // console.log(roles); // Update the state with the received role data
  } catch (error) {
    console.error("Error fetching products", error);
  }
}

async function fetchsubproductList() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/admin/subproduct`,
      {
        headers: {
          authorization:
            "BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imt1c2hhZ3JhQGZpbnF5LmFpIiwicm9sZSI6ImZpbmFuY2VfYWRtaW4iLCJpYXQiOjE2ODc3NjU5NDIsImV4cCI6MTY4NzgwMTk0Mn0.BNLoXitTNCFAWkS16SaxltEg2_5ZV-gnOfijP87ta-o", // Replace with your actual token
        },
      }
    );

    //  const [roles, setRoles] = useState([]);
    const data = await response.data.data;
    console.log(data);

    setSubproductList(data);
    console.log(subproductList);
    // console.log(roles); // Update the state with the received role data
  } catch (error) {
    console.error("Error fetching subproducts", error);
  }
}

async function fetchchannelList() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/admin/channel`,
      {
        headers: {
          authorization:
            "BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imt1c2hhZ3JhQGZpbnF5LmFpIiwicm9sZSI6ImZpbmFuY2VfYWRtaW4iLCJpYXQiOjE2ODc3NjM4OTUsImV4cCI6MTY4Nzc5OTg5NX0.aBKByRKPCrmf7u-Nf9KOZ9GEbulLill_Be2A95hesuk", // Replace with your actual token
        },
      }
    );

    //  const [roles, setRoles] = useState([]);
    const data = await response.data.data;
    console.log(data);

    setChannelList(data);
    console.log(channelList);
    // console.log(roles); // Update the state with the received role data
  } catch (error) {
    console.error("Error fetching channels", error);
  }
}

  return (
    <div>
      <div className="part">
        <div className="tabs-bar">
          <div className={`tab ${activeTab === 'product' ? 'active' : ''}`} onClick={() => openTab('product')}>
            Product
          </div>
          <div className={`tab ${activeTab === 'channel' ? 'active' : ''}`} onClick={() => openTab('channel')}>
            Channel
          </div>
          <div className={`tab ${activeTab === 'subproduct' ? 'active' : ''}`} onClick={() => openTab('subproduct')}>
            Subproduct
          </div>
        </div>

        <div
          id="product"
          className={`tabcontent ${activeTab === 'product' ? 'active' : ''}`}
        >
          <div className="button-container">
            <button onClick={toggleForm}>+ Add Product</button>
          </div>

          <div id="productTable">
            <table>
              <thead>
                <tr className="tablerow">
                  <th>Sr.No.</th>
                  <th>Product</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productList.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>
                      <button onClick={() => editItem(item.id)}>Edit</button>
                      <button onClick={() => deleteItem(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          id="subproduct"
          className={`tabcontent ${activeTab === 'subproduct' ? 'active' : ''}`}
        >
          <div className="button-container">
            <button onClick={toggleForm}>+ Add Subproduct</button>
          </div>

          <div id="subproductTable">
            <table>
              <thead>
                <tr className="tablerow">
                  <th>Sr.No.</th>
                  <th>Subproduct</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subproductList.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.sp_name}</td>
                    <td>
                      <button onClick={() => editItem(item.id)}>Edit</button>
                      <button onClick={() => deleteItem(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          id="channel"
          className={`tabcontent ${activeTab === 'channel' ? 'active' : ''}`}
        >
          <div className="button-container">
            <button onClick={toggleForm}>+ Add Channel</button>
          </div>

          <div id="channelTable">
            <table>
              <thead>
                <tr className="tablerow">
                  <th>Sr.No.</th>
                  <th>Channel</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {channelList.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.c_name}</td>
                    <td>
                      <button onClick={() => editItem(item.id)}>Edit</button>
                      <button onClick={() => deleteItem(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showForm && (
          <div id="form-popup">
            <div className="form-container">
              <form onSubmit={editItemId ? updateItem : addItem}>
                <label>
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}:
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                  />
                </label>

                <div className="button-container">
                  <button type="submit">{editItemId ? 'Update' : 'Add'}</button>
                  <button type="button" onClick={toggleForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductM;
