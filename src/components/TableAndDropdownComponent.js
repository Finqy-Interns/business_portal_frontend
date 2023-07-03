import React, { useEffect, useState, } from 'react'
import Table from './Table';
import Dropdown from './Dropdown';
import { getToken } from '../utils/token.utils';
import ReactLoading from 'react-loading'
// import axios from 'axios';
// import "./TableAndDropdownCSS.css"
import { getMonths, getColumnHeaders } from '../utils/business-targets.util';

const TableAndDropdownComponent = ({
  status,
  demoURL,
  uploadURL,
  editDisabled,
  onSave,
  upload,
  onPublish,
  onEdit,
  style,
  demoExcelName,
  statusToDisplay,
  showDropDown,
  dataObject,
  dataMethods,
}) => {
  const years = ["FY 2022-2023", "FY 2023-2024", "FY 2024-2025"];

  const {
    data,
    productId,
    productData,
    productDataCurrency,
    subProductData,
    subProductDataCurrency,
    channelData,
    channelDataCurrency,
    // productName,
    fileInputRef,
    error,
    showForm,
    loading,
    // editStatus
  } = dataObject;

  const {
    setProductDataCurrency,
    setSubProductDataCurrency,
    setChannelDataCurrency,
    setProductId,
    setSubProductId,
    setChannelId,
    setProductName,
    uploadExcel,
    handleChooseFile,
    setSelectedFY,
    setError,
    toggleForm,
    setLoading,
    // setEditStatus
  } = dataMethods;

  // const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(years[0]);

  const [months, setMonths] = useState(() => {
    return getMonths(status);
  });

  useEffect(() => {
    // console.log('months', months)
    setProductId("");
    setError("");
    const oldM = getMonths(status);
    if (oldM) {
      const [newM, endYear] = getColumnHeaders(oldM, selectedYear);
      setSelectedFY(endYear);
      setMonths(newM);
    }
    // eslint-disable-next-line
  }, [selectedYear]);
  // console.log(months)

  async function demoExcel() {
    try {
      if (demoExcelName) {
        const token = getToken();
        const response = await fetch(`${demoURL}/${productId}/${status}`, {
          headers: {
            authorization: `Bearer${token}`,
          },
        });

        // if (!response.ok) {
        //   throw new Error('Excel file download failed.');
        // }

        const blob = await response.blob();

        // Create a temporary link element
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        // console.log('data',)
        // link.download = `${productName} ${status === "target" ? "Target" : "Actual"}` || 'demo file';
        link.download = demoExcelName;

        // Programmatically click the link to start the download
        link.click();

        // Clean up the URL object after the download
        URL.revokeObjectURL(link.href);
      }
    } catch (err) {
      console.error("Error downloading Excel file:", error);
    }
  }

  // console.log('sdd',showDropDown,'up',upload)

  return (
    // style={{ marginLeft: '280px', marginRight: '10px' }}
    <div style={style}>
      {/* <div className="heading-panel" style={{ textAlign: 'center' }}>
        <h1>Finance Panel</h1>
      </div> */}
      {/* DropDown */}

      <Dropdown
        style={{ display: showDropDown ? "block" : "none" }}
        data={{
          product: productData,
          subProduct: subProductData,
          channel: channelData,
          // status:'add',
        }}
        setProductData={(value) => {
          setProductDataCurrency(value);
        }}
        setSubProductData={(value) => {
          setSubProductDataCurrency(value);
        }}
        setChannelData={(value) => {
          setChannelDataCurrency(value);
        }}
        setError={(errorValue) => {
          setError(errorValue);
        }}
        getProductId={(productId, name) => {
          setProductId(productId);
          setProductName(name);
        }}
        getSubProductId={(subProductId) => {
          setSubProductId(subProductId);
        }}
        getChannelId={(channelId) => {
          setChannelId(channelId);
        }}
        setSelectedYear={(value) => {
          setSelectedYear(value);
        }}
        selectedYear={selectedYear}
        years={years}
      />

      {error && <div className="dropdown-container red">{error}</div>}
      {/* Edit or Add Button */}
      {/* {
        productId && demoURL && <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#a70404",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginTop: "10px",
            marginRight: "10px"
          }}
          // disabled={!editDisabled}
          onClick={() => {
            onEdit()
            // onSave()
          }}
        >
          {editStatus ? "Add" : "Edit"}
        </button>
      } */}

      {/* Download Current Data */}
      {/* {
        editStatus && productId && demoURL && <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#a70404",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginTop: "10px",
            marginRight: "10px"
          }}
          // disabled={!editDisabled}
          onClick={() => {

          }}
        >
          Download Data
        </button>
      } */}

      {/* Demo Excel file */}
      {productId && demoURL && (
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#a70404",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginTop: "10px",
            marginRight: "10px",
          }}
          // className={editDisabled ? "button-disabledStyle": "button-enabledStyle"}
          onClick={() => {
            demoExcel();
          }}
        >
          Demo Excel
        </button>
      )}
      {/* Upload Excel */}
      {productId && upload && (
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#a70404",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginTop: "10px",
          }}
          // onClick={() => {
          //   setModalOpen(true);
          // }}
          onClick={toggleForm}
        >
          Upload Excel
        </button>
      )}
      {/* {
        productId && upload && <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#a70404",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginTop: "10px",
          }}
          onClick={() => {
            setModalOpen(true)
          }}
        >
          Upload Excel
        </button>
      }
      } */}
      {showForm && (
        <div id="form-popup">
          <div className="form-container">
            <h3>Upload Files</h3>
            <div className="drop_box">
              <header>
                <h4>Select File here</h4>
              </header>
              <p>Files Supported: EXCEL FILE(.xlsx)</p>
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={uploadExcel}
                accept=".xlsx"
                id="fileID"
                // style={{ display: "none" }}
              />
              <button onClick={handleChooseFile} className="btn">
                Choose File
              </button>
            </div>
          </div>
        </div>
      )}
      {productId && (
        <h3 style={{ fontWeight: "bold", textAlign: "center" }}>
          {statusToDisplay}
        </h3>
      )}
      {
        // Product Data
        productId && productDataCurrency && (
          <Table data={productDataCurrency} months={months} />
        )
      }
      {
        // Sub Product Data
        // eslint-disable-next-line
        subProductDataCurrency?.length > 0 &&
          subProductDataCurrency.map((sp, index) => {
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
        data &&
          channelDataCurrency &&
          channelDataCurrency.map((ch, index) => {
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
      {/* Edit Button */}
      {/* {
          productId && demoURL && <button
            style={{
              padding: "10px 20px",
              backgroundColor: editDisabled ? "#a70404" : "#8f8383",
              color: "white",
              border: "none",
              cursor: "pointer",
              marginTop: "10px",
              marginRight: "10px",
            }}
            onClick={() => {
              // demoExcel()
            }}
            disabled={!editDisabled}
          >
            Edit
          </button>
        } */}
      {/* Save Button */}
      {!loading && productId && demoURL && (
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: editDisabled ? "#a70404" : "#8f8383",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginTop: "10px",
            marginRight: "10px",
          }}
          disabled={!editDisabled}
          onClick={() => {
            onSave();
          }}
        >
          Save
        </button>
      )}
      {/* Publish Button */}
      {!loading && productId && demoURL && (
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: editDisabled ? "#a70404" : "#8f8383",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginTop: "10px",
            marginRight: "10px",
          }}
          disabled={!editDisabled}
          onClick={() => {
            onPublish();
          }}
        >
          Publish
        </button>
      )}

      {loading && (
        <ReactLoading type={"spin"} color={"blue"} height={90} width={40} />
      )}
    </div>
  );
};

export default TableAndDropdownComponent;


