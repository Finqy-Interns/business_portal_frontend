import React, { useEffect, useState, useRef } from "react";
import "./AddNumbers.css";
import TableAndDropdownComponent from "../../components/TableAndDropdownComponent";
import axios from "axios";
import {
  checkTokenValidity,
  getTokenData,
  getToken,
} from "../../utils/token.utils";
import { getPreviousMonth } from "../../utils/getPreviousMonth";
import Table from "../../components/Table";
import { getMonths } from "../../utils/business-targets.util";
import { setAmount } from "../../utils/business-targets.util";

const AddNumbers = ({ setActivePage }) => {
  const [data, setData] = useState(null);
  const [targetData, setTargetData] = useState(null);

  const [productData, setProductData] = useState([]);
  const [productDataCurrency, setProductDataCurrency] = useState([]);
  const [productId, setProductId] = useState(null);
  const [productName, setProductName] = useState(null);

  const [productTargetData, setProductTargetData] = useState([]);
  const [productTargetDataCurrency, setProductTargetDataCurrency] = useState(
    []
  );

  const [subProductData, setSubProductData] = useState([]);
  const [subProductDataCurrency, setSubProductDataCurrency] = useState([]);
  const [subProductId, setSubProductId] = useState(null);

  const [subProductTargetData, setSubProductTargetData] = useState([]);
  const [subProductTargetDataCurrency, setSubProductTargetDataCurrency] =
    useState([]);

  const [channelData, setChannelData] = useState([]);
  const [channelDataCurrency, setChannelDataCurrency] = useState([]);
  // eslint-disable-next-line
  const [channelId, setChannelId] = useState(null);

  const [channelTargetData, setChannelTargetData] = useState([]);
  const [channelTargetDataCurrency, setChannelTargetDataCurrency] = useState(
    []
  );

  const [selectedFY, setSelectedFY] = useState(null);

  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const [uploadResponse, setUploadResponse] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currencyValue, setCurrencyValue] = useState("select");

  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const [token, setToken] = useState();

  const month = getPreviousMonth();

  const [months, setMonths] = useState(() => {
    return getMonths("actual");
  });

  useEffect(() => {
    const tokenValidity = checkTokenValidity();
    if (tokenValidity) {
      const token = getToken();
      setToken(token);
      setActivePage("addnumbers");
    } else {
      window.location.href =
        window.location.pathname.split("/").slice(0, -1).join("/") + "/login";
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setProductData([]);
    setProductDataCurrency([]);
    setSubProductDataCurrency([]);
    setSubProductData([]);
    setChannelData([]);
    setChannelDataCurrency([]);

    setProductTargetData([]);
    setProductTargetDataCurrency([]);
    setSubProductTargetData([]);
    setSubProductTargetDataCurrency([]);
    setChannelTargetData([]);
    setChannelTargetDataCurrency([]);

    fetchTargetData();
    fetchNumberData();
    // eslint-disable-next-line
  }, [productId]);

  // Case when Only product and Channel Exists
  useEffect(() => {
    if (data) {
      const { channels } = data;
      if (channels?.length > 0) {
        setChannelData(channels);
        setChannelDataCurrency(channels);
      }
    }
  }, [data]);

  useEffect(() => {
    if (targetData) {
      const { channels } = targetData;
      if (channels?.length > 0) {
        setChannelTargetData(channels);
        setChannelTargetDataCurrency(channels);
      }
    }
  }, [targetData]);

  // For SubProducts
  // For SubProducts and channels
  useEffect(() => {
    if (data) {
      const { subProduct } = data;
      if (subProduct?.length > 0) {
        const arr = subProduct.map((sp) => sp.channels?.length === 0);
        if (!arr.includes(false)) {
          console.log(subProduct, "asdasd");
          setSubProductData(subProduct);
          setSubProductDataCurrency(subProduct);
        } else {
          const matchedObject = subProduct.find(
            (item) => item.subProduct_id === subProductId
          );
          setSubProductData([matchedObject]);
          setSubProductDataCurrency([matchedObject]);
          if (matchedObject?.channels?.length > 0) {
            const channels = matchedObject.channels;
            setChannelData(channels);
            setChannelDataCurrency(channels);
          }
        }
      }
    }
  }, [data, subProductId]);

  useEffect(() => {
    if (targetData) {
      const { subProduct } = targetData;
      if (subProduct?.length > 0) {
        const arr = subProduct.map((sp) => sp.channels?.length === 0);
        if (!arr.includes(false)) {
          console.log(subProduct, "asdasd");
          setSubProductTargetData(subProduct);
          setSubProductTargetDataCurrency(subProduct);
        } else {
          const matchedObject = subProduct.find(
            (item) => item.subProduct_id === subProductId
          );
          setSubProductTargetData([matchedObject]);
          setSubProductTargetDataCurrency([matchedObject]);
          if (matchedObject?.channels?.length > 0) {
            const channels = matchedObject.channels;
            setChannelTargetData(channels);
            setChannelTargetDataCurrency(channels);
          }
        }
      }
    }
  }, [targetData, subProductId]);

  useEffect(() => {
    // console.log('months', months)
    const oldM = getMonths("actual");
    if (oldM) {
      var yearSuffix;
      var startYear = (Number(selectedFY) - 1).toString();
      var endYear = selectedFY;
      if (
        oldM[0].value !== "january" &&
        oldM[0].value !== "february" &&
        oldM[0].value !== "march"
      ) {
        yearSuffix = startYear.slice(-2);
      } else {
        yearSuffix = endYear.slice(-2);
      }
      // console.log("months", {
      //   displayValue: `${oldM[0].displayValue}-${yearSuffix}`,
      //   value: oldM[0].value,
      // });
      setMonths([
        {
          displayValue: `${oldM[0].displayValue}-${yearSuffix}`,
          value: oldM[0].value,
        },
      ]);
    }
    // eslint-disable-next-line
  }, [selectedFY]);

  const fetchTargetData = async () => {
    try {
      const tokenValidity = checkTokenValidity();

      if (tokenValidity) {
        if (productId && selectedFY) {
          const token = getToken();
          // console.log(`localhost/api/user/hierarchy/target/${productId}/${selectedFY}/save`)
          const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}/api/user/hierarchy/target/${productId}/${selectedFY}/publish`,
            {
              headers: {
                authorization: `Bearer${token}`, // Replace with your actual token
              },
            }
          );
          const jsonData = await response.json();
          if (jsonData.data) {
            setTargetData(jsonData.data);
            setProductTargetData(jsonData.data.product);
            setProductTargetDataCurrency(jsonData.data.product);
          } else {
            // setProductId("")
            // setError('No Business Target found!')
          }
        }
      } else {
        window.location.href =
          window.location.pathname.split("/").slice(0, -1).join("/") + "/login";
      }
    } catch (err) {
      setProductId(null);
      console.error("Error fetching data:", err);
    }
  };

  const fetchNumberData = async () => {
    if (productId) {
      // const month = 'june'
      // console.log('month',month)
      // localhost/api/user/hierarchy/actual/1/2024/save/may
      // console.log(`localhost/api/user/hierarchy/actual/${productId}/${selectedFY}/save/${month}`)
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/user/hierarchy/actual/${productId}/${selectedFY}/save/${month}`,
        {
          headers: {
            authorization: `Bearer${token}`,
          },
        }
      );
      const jsonData = await response.json();
      console.log("json data number data", JSON.stringify(jsonData.data));
      if (jsonData.data) {
        // setPreviousNumberData(jsonData.data)
        setData(jsonData.data);
        setProductData(jsonData.data.product);
        setProductDataCurrency(jsonData.data.product);
        setUploadResponse(true);
      }
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  async function uploadExcel(e) {
    try {
      const tokenData = getTokenData();
      console.log("tokenData", tokenData);
      const role = tokenData.role;
      if (role === "business_user") {
        const currentData = new Date();
        const day = currentData.getDate();
        if (day > 15) {
          alert("Deadline has passed! You cant upload the excel");
          return;
        }
      }
      const selectedFile = e.target.files[0];
      const fileName = selectedFile["name"];
      // console.log(selectedFile)
      if (fileName.indexOf(`${productName} Actual ${month}`) !== -1) {
        const selectedFile = e.target.files[0];
        const token = getToken();

        const formData = new FormData();
        formData.append("file", selectedFile);
        console.log("file", `${process.env.REACT_APP_BASE_URL}/api/user/upload/excel/${productId}/${selectedFY}`);
        const response = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/api/user/upload/excel/${productId}`,
          formData,
          {
            headers: {
              authorization: `Bearer${token}`,
            },
          }
        );

        if (response?.data?.data) {
          console.log("excel data", JSON.stringify(response?.data?.data));
          toggleForm();
          setUploadResponse(true);
          setProductData(response?.data?.data.product);
          setProductDataCurrency(response?.data?.data.product);
          setData(response?.data?.data);
          // setProductDataCurrency(response?.data?.data)
        }
      } else {
        alert("Please upload correct excel file! Download Demo File");
      }
    } catch (err) {
      console.log('errorsssssssssssssssssssssssssss', err)
      const { status, msg } = err?.response?.data;
      if (status === 3400) {
        alert(
          "Target is already added for this year! Please edit in order to modify the target"
        );
      } else {
        console.log("msg", msg);
      }
    }
  }

  async function onSave() {
    try {
      setLoading(true);
      const updatedData = {
        data: {
          ...data,
          // TODO: Add Year Input from User
          year: selectedFY,
          status: "save",
        },
      };

      // API call to add
      // const month = 'june'
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/user/add/actual/${productId}/${month}`,
        updatedData,
        {
          headers: {
            authorization: `Bearer${token}`,
          },
        }
      );
      setLoading(false);
      if (response?.data?.status === 200) {
        window.location.reload();
      }
    } catch (err) {
      setLoading(false);
      const { status, msg } = err?.response?.data;
      if (status === 3400) {
        alert(
          "Actuals for the Month is already published! you cannot publish it again!"
        );
      } else {
        console.log("msg", msg);
      }
    }
  }

  async function onPublish() {
    try {
      setLoading(true);
      const updatedData = {
        data: {
          ...data,
          // TODO: Add Year Input from User
          year: selectedFY,
          status: "publish",
        },
      };

      // console.log('data',JSON.stringify(updatedData))

      // API call to add
      // const month = 'june'
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/user/add/actual/${productId}/${month}`,
        updatedData,
        {
          headers: {
            authorization: `Bearer${token}`,
          },
        }
      );

      setLoading(false);
      if (response?.data?.status === 200) {
        window.location.reload();
      }
    } catch (err) {
      setLoading(false);
      const { status, msg } = err?.response?.data;
      if (status === 3400) {
        alert(
          "Actuals for the Month is already published! you cannot publish it again!"
        );
      } else {
        console.log("msg", msg);
      }
    }
  }
  return (
    <div style={{ display: "flex" }}>
      <TableAndDropdownComponent
        style={{ marginLeft: "280px" }}
        status="actual"
        statusToDisplay="Actual"
        demoURL={`${process.env.REACT_APP_BASE_URL}/api/user/demoExcel`}
        showDropDown={true}
        demoExcelName={`${productName} Actual ${month}`}
        dataObject={{
          data,
          productId,
          productData,
          productDataCurrency,
          subProductData,
          subProductDataCurrency,
          channelData,
          channelDataCurrency,
          productName,
          fileInputRef,
          error,
          showForm,
          loading,
          selectedFY
        }}
        dataMethods={{
          setProductDataCurrency,
          setSubProductDataCurrency,
          setChannelDataCurrency,
          setProductId,
          setSubProductId,
          setChannelId,
          setProductName,
          handleChooseFile,
          uploadExcel,
          setError,
          setSelectedFY,
          toggleForm,
        }}
        upload={true}
        editDisabled={uploadResponse}
        onSave={onSave}
        onPublish={onPublish}
      />
      <div
        style={{
          flex: 1,
          marginLeft: "20px",
          marginTop: "20px",
          marginRight: "20px",
        }}
      >
        {/* <div className="dropdown-container"> */}

        {/* </div> */}
        <div
          className="dropdown-container"
          style={{
            flexDirection: "column",
            marginTop: "0px",
            // marginLeft: "33%",
            textAlign: "center",
            // float: "right",
          }}
        >
          {targetData && (
            <div style={{ justifyContent: "center" }}>
              <label htmlFor="currency-dropdown1">Currency:</label>
            </div>
          )}
          {targetData && (
            <>
              <div style={{ textAlign: "center" }}>
                <select
                  id="currency-dropdown1"
                  value={currencyValue}
                  style={{ justifyContent: "center" }}
                  onChange={(e) => {
                    if (productTargetDataCurrency) {
                      setCurrencyValue(e.target.value);
                      setAmount(
                        e.target.value,
                        targetData,
                        setProductTargetDataCurrency,
                        setSubProductTargetDataCurrency,
                        setChannelTargetDataCurrency
                      );
                    }
                  }}
                >
                  <option value="select">Select Currency</option>
                  <option value="absolute">Absolute</option>
                  <option value="crores">In Crores</option>
                  <option value="lakhs">In Lakhs</option>
                </select>
              </div>
            </>
          )}
        </div>
        <div style={{ marginTop: "50px" }}></div>
        {productId && (
          <h3 style={{ fontWeight: "bold", textAlign: "center" }}>Target</h3>
        )}
        {/* style={{ marginTop: "14%" }} */}
        <div>
          {
            // Product Data
            productId && productTargetDataCurrency && (
              <Table data={productTargetDataCurrency} months={months} />
            )
          }
          {
            // Sub Product Data
            // eslint-disable-next-line
            subProductTargetDataCurrency?.length > 0 &&
              subProductTargetDataCurrency.map((sp, index) => {
                if (sp) {
                  return (
                    <div key={index}>
                      <h3>Sub Product - {sp.name || sp.sp_name}</h3>
                      <Table data={sp} months={months} />
                    </div>
                  );
                }
              })
          }
          {
            // Channel Data
            // eslint-disable-next-line
            targetData &&
              channelTargetDataCurrency &&
              channelTargetDataCurrency.map((ch, index) => {
                if (ch) {
                  return (
                    <div key={index}>
                      <h3>Channel - {ch.name || ch.c_name}</h3>
                      <Table data={ch} months={months} />
                    </div>
                  );
                }
              })
          }
        </div>
      </div>
    </div>
  );
};
export default AddNumbers;
