import React, { useState, useEffect, useRef } from "react";
// import { PowerBIEmbed } from 'powerbi-client-react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from "powerbi-client";
import "./dashboard.css"
import axios from "axios";
import { getToken } from  "../../utils/token.utils"

const Dashboard = ({ setActivePage }) => {

  const [accessToken, setAccessToken] = useState('')
  const [error, setError] = useState(null)
  const [report, setReport] = useState(null)
  const [products, setProducts] = useState([]);

  async function getAccessToken() {
    try {
      const tokenResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/fetch-powerbi-token`)
      const data = await tokenResponse.json();
      // console.log('data Token', data)
      setAccessToken(data?.accessToken || '')
    }
    catch (err) {
      console.log('error', err)
      setError('Power BI Error Please Contact Tech')
    }
  }

  async function getProducts(){
    try{
      const token = getToken()
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/user/hierarchy`, {
        headers: {
          authorization: `Bearer${token}`, // Replace with your actual token
        },
      })

      const productsArray = response?.data?.data;

      if(productsArray){
        const productNames = productsArray
      .map(item => item.product.name);
      setProducts(productNames)
      }
    }
    catch(err){
      console.log('err fetching products',err)
    }
  }

  useEffect(() => {
    setActivePage('dashboard')
    getProducts()
    getAccessToken()
  }, [])

  return (
    !error && accessToken && products && <div className="powerbiContainer">
      <PowerBIEmbed
        cssClassName={
          "powerbiContainer"
        }
        embedConfig={{
          type: 'report',
          accessToken: accessToken,
          embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=70827c05-4cd2-4f91-b6e2-c3892727de2b&groupId=34d737de-5e53-44a7-8c8d-f721004910b1&uid=y1wna',
          id: '70827c05-4cd2-4f91-b6e2-c3892727de2b',
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: true
              },
            },
            background: models.BackgroundType.Transparent,
          }
        }}
        eventHandlers={
          new Map([
            ['loaded', async function (event, report) {
              if (report && products) {
                const filter = {
                  $schema: 'http://powerbi.com/product/schema#basic',
                  target: {
                    table: 'business_portal hierarchies', // Replace with your table name
                    column: 'business_portal.products.name' // Replace with your column name
                  },
                  operator: 'In',
                  values: products,
                  filterType: models.FilterType.BasicFilter,
                }
                try {
                  await report.setFilters([filter])
                  console.log('report updated sucessfully')
                }
                catch (err) {
                  console.log('report err', err)
                }
              }
            }],
            ['rendered', function () { console.log('Report rendered'); }],
            ['error', function (event) { console.log(event.detail); }],
            ['visualClicked', () => console.log('visual clicked')],
            ['pageChanged', (event) => console.log(event)],
          ])
        }
        getEmbeddedComponent={(embeddedReport) => {
          setReport(embeddedReport)
        }}

      // style={{ width: '100%', height: '1000px' }}
      />
    </div>
  );
};

export default Dashboard;
