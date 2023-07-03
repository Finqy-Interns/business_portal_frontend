import { FaPen } from "react-icons/fa";
import Select from "react-select";
import "./RolesMaster.css";
import { BsBorder } from "react-icons/bs";
import React, { useState, useEffect } from "react";
import {
  checkTokenValidity,
  getTokenData,
  getToken,
} from "../../utils/token.utils";

import axios from "axios";

const RoleMaster = ({ setActivePage }) => {
  const [roles, setRoles] = useState([]);
  const [editableProduct, setEditableProduct] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const [newRoleName, setNewRoleName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [roleData, setRoleData] = useState({ roleName: "", permissions: [] });
  const [error, setError] = useState(null);


  const closePermissionModal = () => {
    setShowPermissionModal(false);
  };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const permissionValuesToSend = selectedPermissions.map(
//       (item) => item.value
//     );
//     console.log("pc", permissionValuesToSend);
//     try {
//       const token = getToken();
//       const response = await axios.post(
//         "http://localhost/api/admin/role/add",
//         {
//           permissions: permissionValuesToSend,
//           name: newRoleName,
//           // Include any other necessary fields for the new product
//         },
//         {
//           headers: {
//             authorization: `Bearer${token}`,
//           },
//         }
//       );
//       console.log("res", response);
//       setNewRoleName("");
//       setSelectedPermissions([]);
//       fetchRoles();
//     } catch (error) {
//       console.error("Error adding role:", error);
//     }
//   };
// const handleEdit = (role,index) => {
//   const selectedRole = role;
//   console.log('role', role)
//   console.log('index', index)

//   // setEditableProduct(selectedRole);
//   // setEditMode(true);
//   setNewRoleName(selectedRole.name);
//   setSelectedPermissions(
//     selectedRole.permissions.map((permission) => ({
//       value: permission.permission_id,
//       label: permission.name,
//     }))
//   );
// };
 const handleEdit = (role, index) => {
   const selectedRole = role;
   console.log("role", role);
   console.log("index", index);

   setEditableProduct(selectedRole);
   setEditMode(true);
   setNewRoleName(selectedRole.name);
   setSelectedPermissions(
     selectedRole.permissions.map((permission) => ({
       value: permission.permission_id,
       label: permission.name,
     }))
   );
   setError(null); // Reset error state
 };

 const handleSubmit = async (event) => {
   event.preventDefault();
   const permissionValuesToSend = selectedPermissions.map((item) => item.value);
   console.log("pc", permissionValuesToSend);
   try {
     const token = getToken();
     let response;
     if (editMode && editableProduct) {
       // Edit mode, use PUT request
       response = await axios.put(
         `http://${process.env.REACT_APP_BASE_URL}/api/admin/role/edit/${editableProduct.role_id}`,
         {
           permissions: permissionValuesToSend,
           name: newRoleName,
           // Include any other necessary fields for editing the role
         },
         {
           headers: {
             authorization: `Bearer${token}`,
           },
         }
       );
     } else {
       // Add mode, use POST request
       response = await axios.post(
         `http://${process.env.REACT_APP_BASE_URL}/api/admin/role/add` ,
         {
           permissions: permissionValuesToSend,
           name: newRoleName,
           // Include any other necessary fields for adding the role
         },
         {
           headers: {
             authorization: `Bearer${token}`,
           },
         }
       );
     }
     console.log("res", response);
     setNewRoleName("");
     setSelectedPermissions([]);
     fetchRoles();
     setEditMode(false);
     setEditableProduct(null);
   } catch (error) {
     console.error("Error submitting role:", error);
     setError(error.response?.data?.msg || "Error submitting role");
   }
 };
  useEffect(() => {
    setActivePage("rolemaster");
    fetchRoles();
    fetchPermissions();
  }, []);

  const handleRoleNameChange = (e) => {
    console.log(e.target.value);
    setNewRoleName(e.target.value);
  };

  async function fetchRoles() {
    try {
      const token = getToken();
      const response = await axios.get(
        `http://${process.env.REACT_APP_BASE_URL}/api/admin/role`,
        {
          headers: {
            authorization: `Bearer${token}`,
          },
        }
      );

      const data = await response.data.data;
      console.log(data);

      setRoles(data);
      console.log(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }

  async function fetchPermissions() {
    try {
      const token = getToken();

      const response = await axios.get(
        `http://${process.env.REACT_APP_BASE_URL}/api/admin/permission`,
        {
          headers: {
            authorization: `Bearer${token}`,
          },
        }
      );

      var data = response.data.data;

      data = data.map((d) => {
        return {
          value: d.permission_id,
          label: d.name,
        };
      });
      console.log(data);

      setPermissions(data);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  }

  return (
    <div className="user-master-page">
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="input_container">
            <label htmlFor="username">Role:</label>
            <input
              style={{
                backgroundColor: "white",
                color: "red",
                border: "solid thin lightgrey",
              }}
              className="inputs"
              type="text"
              placeholder="Role"
              value={newRoleName}
              onChange={handleRoleNameChange}
            />
          </div>

          {permissions && (
            <div className="dropdown-container">
              <div className="dropdown">
                <label htmlFor="permissions">Permissions:</label>
                <Select
                  id="permissions"
                  maxMenuHeight={250}
                  className="react-select--inline"
                  classNamePrefix="react-select"
                  options={permissions}
                  isMulti
                  value={selectedPermissions}
                  onChange={(selectedOptions) => {
                    setSelectedPermissions(selectedOptions);
                  }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
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
            <th>Role</th>
            {/* <th>Action</th> */}
          </tr>
        </thead>

        <tbody>
          {roles.map((role, index) => (
            <tr key={role.role_id}>
              <td>{role.role_id}</td>
              <td>{role.name}</td>
              {/* <td>
                <button>
                  <FaPen onClick={() => handleEdit(role,index)} />
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleMaster;
