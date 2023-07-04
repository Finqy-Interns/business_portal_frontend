import React, { useState, useEffect } from "react";
import { setAmount } from "../utils/business-targets.util";
import { checkTokenValidity, getToken } from "../utils/token.utils";
import ReactLoading from 'react-loading'

function Dropdown({ ...props }) {
  const [products, setProducts] = useState([]);
  const [subproducts, setSubproducts] = useState([]);
  // eslint-disable-next-line
  const [channels, setChannels] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSubproduct, setSelectedSubproduct] = useState("");

  const [showSP, setShowSP] = useState(null);
  const [spChannels, setSpChannels] = useState(null)
  const [currencyValue, setCurrencyValue] = useState("select")

  const [loading, setLoading] = useState(true)

  // console.log('props',props.data)

  useEffect(() => {
    setSelectedProduct("")
    setSelectedSubproduct("")
  }, [props.selectedYear])

  useEffect(() => {
    // Fetch data from the API
    const token = getToken()
    fetch(`${process.env.REACT_APP_BASE_URL}/api/user/hierarchy`, {
      headers: {
        authorization: `Bearer${token}`, // Replace with your actual token
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false)
        if (data.status >= 200 && data.status <= 300) {
          setProducts(data.data);
        } else if (data.status === 401) {
          props.setError("Login Token Expired");
          window.location.href =
            window.location.pathname.split("/").slice(0, -1).join("/") +
            "/login";
        } else {
          props.setError("Some Error Occured! Please contact Tech");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    // eslint-disable-next-line
  }, []);

  const handleProductChange = (event) => {
    const selectedProductId = event.target.value;
    if (selectedProductId) {
      setSelectedProduct(selectedProductId);

      // Find the selected product in the data
      const selectedProductData = products.find(
        (product) => product.product.p_id === parseInt(selectedProductId)
      );

      props.getProductId(selectedProductData.product.p_id, selectedProductData.product.name);
      setCurrencyValue('select')
      props.getSubProductId(null)
      props.getChannelId(null)

      // Disable the subproduct dropdown if there are no subproducts
      if (selectedProductData.subproducts.length === 0) {
        setSelectedSubproduct("");
        setSubproducts([]);
      } else {
        setShowSP(true)
        const arr = selectedProductData.subproducts.map(sp => sp.channels.length === 0);
        if (!arr.includes(false)) {
          setSpChannels(false)
        }
        else {
          setSpChannels(true)
        }
        setSubproducts(selectedProductData.subproducts);
      }
      setChannels(selectedProductData.channels);
    }
  };

  const handleSubproductChange = (event) => {
    const selectedSubproductId = event.target.value;
    if (selectedSubproductId) {
      setSelectedSubproduct(selectedSubproductId);

      // Find the selected subproduct in the data
      const selectedSubproductData = subproducts.find(
        (subproduct) => subproduct.sp_id === parseInt(selectedSubproductId)
      );
      setCurrencyValue('select')
      props.getSubProductId(selectedSubproductData.sp_id)
      setChannels(selectedSubproductData.channels);
    }
  };
  return (
    products.length > 0 && (
      <div style={props.style}>

        {loading && (
          <ReactLoading type={"spin"} color={"blue"} height={90} width={40} />
        )}
        {
          !loading && (<div className="dropdown-container" style={{ display: "flex", flexWrap: "nowrap" }}>
            <div style={{ marginRight: "10px" }}>
              <label htmlFor="financialYear">Financial Year:</label>
              <br />
              <select
                id="financialYear"
                value={props.selectedYear}
                onChange={(e) => props.setSelectedYear(e.target.value)}
              >
                {props.years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginRight: "10px" }}>
              <label htmlFor="productDropdown">Product:</label>
              <br />
              <select
                id="productDropdown"
                value={selectedProduct}
                onChange={handleProductChange}
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option
                    key={product.product.p_id}
                    value={product.product.p_id}
                  >
                    {product.product.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginRight: "10px" }}>
              <label htmlFor="currencyDropdown">Currency:</label>
              <br />
              <select
                id="currencyDropdown"
                value={currencyValue}
                onChange={(e) => {
                  setCurrencyValue(e.target.value);
                  setAmount(
                    e.target.value,
                    props.data,
                    props.setProductData,
                    props.setSubProductData,
                    props.setChannelData
                  );
                }}
              >
                <option value="select">Select Currency</option>
                <option value="absolute">Absolute</option>
                <option value="crores">In Crores</option>
                <option value="lakhs">In Lakhs</option>
              </select>
            </div>

          </div>)
        }
      </div>
    )
  );
}

export default Dropdown;
