import React, { useEffect, useState, } from 'react';
import { checkTokenValidity, getToken } from "../../utils/token.utils";
import TableAndDropdownComponent from '../../components/TableAndDropdownComponent';

const ActualHistory = ({ setActivePage }) => {

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

    const [error, setError] = useState(null)
        // eslint-disable-next-line
    const [token, setToken] = useState()

    async function fetchData() {
      try {
        const tokenValidity = checkTokenValidity();

        if (tokenValidity) {
          if (productId && selectedFY) {
            const token = getToken();
            const response = await fetch(
              `${process.env.REACT_APP_BASE_URL}/api/user/hierarchy/actual/${productId}/${selectedFY}/publish/all`,
              {
                headers: {
                  authorization: `Bearer${token}`,
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
            window.location.pathname.split("/").slice(0, -1).join("/") +
            "/login";
        }
      } catch (err) {
        setProductId(null);
        console.error("Error fetching data:", err);
      }
    }

    useEffect(() => {
      const tokenValidity = checkTokenValidity();
      if (tokenValidity) {
        setActivePage("actualhistory");
        const token = getToken();
        setToken(token);
      } else {
        window.location.href =
          window.location.pathname.split("/").slice(0, -1).join("/") + "/login";
      }
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      setData(null);
      setProductData(null);
      setProductDataCurrency(null);
      setSubProductDataCurrency(null);
      setSubProductData(null);
      setChannelData(null);
      setChannelDataCurrency(null);
      fetchData();
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

    return (
      <TableAndDropdownComponent
        style={{ marginLeft: "280px" }}
            status="target"
            statusToDisplay="Actual"
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
}

export default ActualHistory;
