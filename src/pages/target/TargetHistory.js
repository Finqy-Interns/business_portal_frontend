import React, { useEffect, useState } from "react";
import "./TargetHistory.css"
import TableAndDropdownComponent from "../../components/TableAndDropdownComponent";
import { checkTokenValidity, getToken } from "../../utils/token.utils";

const TargetHistory = ({ setActivePage }) => {

  const [data, setData] = useState(null)

  const [productData, setProductData] = useState([])
  const [productDataCurrency, setProductDataCurrency] = useState([])
  const [productId, setProductId] = useState(null);
  const [productName, setProductName] = useState(null);

  const [subProductData, setSubProductData] = useState([])
  const [subProductDataCurrency, setSubProductDataCurrency] = useState([])
  const [subProductId, setSubProductId] = useState(null)

  const [channelData, setChannelData] = useState([])
  const [channelDataCurrency, setChannelDataCurrency] = useState([])

  // eslint-disable-next-line
  const [channelId, setChannelId] = useState(null)

  const [error, setError] = useState(null);

  const [selectedFY, setSelectedFY] = useState(null);

  // const [uploadResponse, setUploadResponse] = useState(false)
  // eslint-disable-next-line
  const [token, setToken] = useState()

  useEffect(() => {
    const tokenValidity = checkTokenValidity();
    if (tokenValidity) {
      setActivePage('targethistory')
      const token = getToken();
      setToken(token)
    }
    else {
      window.location.href = window.location.pathname.split('/').slice(0, -1).join('/') + '/login'
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    setProductData(null)
    setProductDataCurrency(null)
    setSubProductDataCurrency(null)
    setSubProductData(null)
    setChannelData(null)
    setChannelDataCurrency(null)
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


  async function fetchData() {
    try {
      const tokenValidity = checkTokenValidity();

      if (tokenValidity) {
        if (productId && selectedFY) {
          const token = getToken();
          const response = await fetch(
            `http://${process.env.REACT_APP_BASE_URL}/api/user/hierarchy/target/${productId}/${selectedFY}/publish/`,
            {
              headers: {
                authorization: `Bearer${token}`, // Replace with your actual token
              },
            }
          );
          const jsonData = await response.json();

          if (jsonData.data) {
            setData(jsonData.data);
            setProductData(jsonData.data.product);
            setProductDataCurrency(jsonData.data.product);
          } else {
            setProductId("");
            setError("No Business Target found!");
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

  useEffect(() => {
    setProductData([]);
    setSubProductData([]);
    setProductId(productId);
  }, [productId]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [productId]);

  return (
    <TableAndDropdownComponent
      style={{ marginLeft: "280px" }}
      status="target"
      statusToDisplay="Target"
      upload={false}
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
        error,
      }}
      dataMethods={{
        setProductDataCurrency,
        setSubProductDataCurrency,
        setChannelDataCurrency,
        setProductId,
        setSubProductId,
        setChannelId,
        setProductName,
        setSelectedFY,
        setError,
      }}
      editDisabled={false}
      onSave={() => {}}
      onPublish={() => {}}
    />
  );
};

export default TargetHistory;