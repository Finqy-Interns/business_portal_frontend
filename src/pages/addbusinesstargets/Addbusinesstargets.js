import React, { useEffect, useState, useRef } from "react";
import "./Addbusinesstargets.css";
import { checkTokenValidity, getToken } from "../../utils/token.utils";
import TableAndDropdownComponent from "../../components/TableAndDropdownComponent";
import axios from 'axios';

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const AddBusinessTargets = ({ setActivePage }) => {

  const [data, setData] = useState(null)

  const [productData, setProductData] = useState(null)
  const [productDataCurrency, setProductDataCurrency] = useState(null)
  const [productId, setProductId] = useState(null);
  const [productName, setProductName] = useState(null);

  const [subProductData, setSubProductData] = useState(null)
  const [subProductDataCurrency, setSubProductDataCurrency] = useState(null)
  const [subProductId, setSubProductId] = useState(null)

  const [channelData, setChannelData] = useState(null)
  const [channelDataCurrency, setChannelDataCurrency] = useState(null)
  // eslint-disable-next-line
  const [channelId, setChannelId] = useState(null)

  const [selectedFY, setSelectedFY] = useState(null);

  // const [editStatus, setEditStatus] = useState(false);

  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const [uploadResponse, setUploadResponse] = useState(false)
  const [loading, setLoading] = useState(false)

  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const [token, setToken] = useState()

  useEffect(() => {
    const tokenValidity = checkTokenValidity();
    if (tokenValidity) {
      const token = getToken();
      setToken(token)
      setActivePage('addbusinesstargets')
    }
    else {
      window.location.href = window.location.pathname.split('/').slice(0, -1).join('/') + '/login'
    }
        // eslint-disable-next-line
  }, [])


  useEffect(() => {
    setData([])
    setProductData([])
    setProductDataCurrency([])
    setSubProductDataCurrency([])
    setSubProductData([])
    setChannelData([])
    setChannelDataCurrency([])
    fetchData()
    // setEditStatus(false)
    // eslint-disable-next-line
  }, [productId])

  // Case when Only product and Channel Exists
  useEffect(() => {
    if (data) {
      const { channels } = data
      if (channels?.length > 0) {
        setChannelData(channels)
        setChannelDataCurrency(channels)
      }
    }
  }, [data])

  // For SubProducts and channels
  useEffect(() => {
    if (data) {
      const { subProduct } = data
      if (subProduct?.length > 0) {
        const arr = subProduct.map(sp => sp.channels?.length === 0)
        if (!(arr.includes(false))) {
          console.log(subProduct, 'asdasd')
          setSubProductData(subProduct)
          setSubProductDataCurrency(subProduct)
        }
        else {
          const matchedObject = subProduct.find(item => item.subProduct_id === subProductId);
          setSubProductData([matchedObject])
          setSubProductDataCurrency([matchedObject])
          if (matchedObject?.channels?.length > 0) {
            const channels = matchedObject.channels
            setChannelData(channels)
            setChannelDataCurrency(channels)
          }
        }
      }
    }
  }, [data, subProductId])

  // useEffect(() => {
  //   if (editStatus) {
  //     fetchData()
  //   }
  //   else {
  //     setProductData([])
  //     setProductDataCurrency([])
  //     setSubProductDataCurrency([])
  //     setSubProductData([])
  //     setChannelData([])
  //     setChannelDataCurrency([])
  //   }
  // }, [editStatus])

  async function fetchData() {
    try {
      const tokenValidity = checkTokenValidity();

      if (tokenValidity) {
        if (productId && selectedFY) {
          const token = getToken();
          var response = await fetch(
            `${process.env.REACT_APP_BASE_URL}/api/user/hierarchy/target/${productId}/${selectedFY}/save`,
            {
              headers: {
                authorization: `Bearer${token}`, // Replace with your actual token
              },
            }
          );
          response = await response.json();
          // console.log('data',response);

          if (response.data) {
            setData(response.data);
            setProductData(response.data?.product);
            setProductDataCurrency(response.data?.product);
            setUploadResponse(true);
          } else {
            setData([]);
            setUploadResponse(false);
            setProductData([]);
            setProductDataCurrency([]);
            setSubProductDataCurrency([]);
            setSubProductData([]);
            setChannelData([]);
            setChannelDataCurrency([]);
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
  }

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  async function uploadExcel(e) {
    try {
      const selectedFile = e.target.files[0];
      const fileName = selectedFile["name"];
      // console.log(selectedFile)
      if (fileName.indexOf(`${productName} Target`) !== -1) {
        const selectedFile = e.target.files[0];
        const token = getToken();

        const formData = new FormData();
        formData.append("file", selectedFile);
        // console.log('file',selectedFile)
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
          setUploadResponse(true);
          // console.log('asd', JSON.stringify(response?.data?.data));
          // console.log('coming here')

          toggleForm();
          setData(response?.data?.data);
          setProductData(response?.data?.data.product);
          setProductDataCurrency(response?.data?.data.product);
          // setProductDataCurrency(response?.data?.data)
        }
      } else {
        alert("Please upload correct excel file! Download Demo File");
      }
    } catch (err) {
      console.log("err", err);
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
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/user/add/target/${productId}`,
        updatedData,
        {
          headers: {
            authorization: `Bearer${token}`,
          },
        }
      );
      setLoading(false);
      if (response?.data?.status === 200) {
        // await sleep(1000)
        window.location.reload();
      }
    } catch (err) {
      setLoading(false);
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

      // API call to add
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/user/add/target/${productId}`,
        updatedData,
        {
          headers: {
            authorization: `Bearer${token}`,
          },
        }
      );
      setLoading(false);
      if (response?.data?.status === 200) {
        // await sleep(1000)
        window.location.reload();
      }
    } catch (err) {
      setLoading(false);
      const { status, msg } = err?.response?.data;
      if (status === 3400) {
        alert(
          "Target is already added for this year! You cannot add the target again"
        );
      } else {
        console.log("msg", msg);
      }
    }
  }
  return (
    <>
      <TableAndDropdownComponent
        status="target"
        style={{ marginLeft: "280px" }}
        statusToDisplay="Target"
        demoURL={`${process.env.REACT_APP_BASE_URL}/api/user/demoExcel`}
        uploadURL={`${process.env.REACT_APP_BASE_URL}/api/user/upload/excel`}
        demoExcelName={`${productName} Target`}
        showDropDown={true}
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
          // editStatus
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
          setSelectedFY,
          setError,
          toggleForm,
          setLoading,
          // setEditStatus,
        }}
        editDisabled={uploadResponse}
        upload={true}
        onSave={onSave}
        onPublish={onPublish}
        // onEdit={() => {
        //   setEditStatus(!editStatus)
        // }}
      />
    </>
  );
};

export default AddBusinessTargets;
