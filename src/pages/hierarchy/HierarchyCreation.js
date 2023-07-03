import React, { useState, useEffect } from "react";
import "./HierarchyCreation.css"; // CSS file for styling
import Sidebar from "../../components/Sidebar";

const Hierarchy = ({ setActivePage }) => {
  // State variables to store form values
  const [title, setTitle] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [product, setProduct] = useState("");
  const [subProduct, setSubProduct] = useState("");
  const [channel, setChannel] = useState("");

  // State variable to store hierarchy table data
  const [hierarchyTableData, setHierarchyTableData] = useState([]);

  useEffect(()=>{
    setActivePage("prodmaster")
  },[])

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new hierarchy object with the form values
    const newHierarchy = {
      title,
      financialYear,
      startDate: startDate ? startDate.toLocaleDateString() : "",
      endDate: endDate ? endDate.toLocaleDateString() : "",
      selectedYear,
      product,
      subProduct,
      channel,
    };

    // Add the new hierarchy to the hierarchy table data
    setHierarchyTableData([...hierarchyTableData, newHierarchy]);

    // Clear the form fields
    setTitle("");
    setFinancialYear("");
    setStartDate(null);
    setEndDate(null);
    setSelectedYear("");
    setProduct("");
    setSubProduct("");
    setChannel("");
  };

  return (
    <div>
      <h1>{title}</h1>
      <h2>{financialYear}</h2>
      <div className="date-selection">
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={startDate ? startDate.toISOString().split("T")[0] : ""}
          onChange={(e) => setStartDate(new Date(e.target.value))}
        />
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={endDate ? endDate.toISOString().split("T")[0] : ""}
          onChange={(e) => setEndDate(new Date(e.target.value))}
        />
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        > 
          <option value="">Select Year</option>
          </select>
      </div>
      <div className="input-fields">
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Product"
        />
        <input
          type="text"
          value={subProduct}
          onChange={(e) => setSubProduct(e.target.value)}
          placeholder="Subproduct"
        />
        <input
          type="text"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          placeholder="Channel"
        />
      </div>
      <button className="create_hierarchy_button" onClick={handleSubmit}>
        Create Hierarchy
      </button>

      <table className="hierarchy-table">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Product</th>
            <th>Subproduct</th>
            <th>Channel</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {hierarchyTableData.map((hierarchy, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{hierarchy.product}</td>
              <td>{hierarchy.subProduct}</td>
              <td>{hierarchy.channel}</td>
              <td>{hierarchy.startDate}</td>
              <td>{hierarchy.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Hierarchy;
