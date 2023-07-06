import React, { useState, useEffect, useRef } from "react";
// import { PowerBIEmbed } from 'powerbi-client-react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from "powerbi-client";
import "./dashboard.css"

const Dashboard = ({ setActivePage }) => {

  const [accessToken, setAccessToken] = useState('')
  const [error, setError] = useState(null)
  const [embedConfig, setEmbedConfig] = useState(null)
  const [report, setReport] = useState(null)

  async function getAccessToken() {
    try {
      const tokenResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/fetch-powerbi-token`)
      const data = await tokenResponse.json();
      console.log('data', data)
      setAccessToken(data?.accessToken || '')
    }
    catch (err) {
      console.log('error', err)
      setError('Power BI Error Please Contact Tech')
    }
  }

  useEffect(() => {
    setActivePage('dashboard')
    getAccessToken()
  }, [])

  async function updateReportFilters() {
    const filter = {
      $schema: 'http://powerbi.com/product/schema#basic',
      target: {
        table: 'business_portal hierarchies', // Replace with your table name
        column: 'business_portal.products.name' // Replace with your column name
      },
      operator: 'In',
      values: ['Auto Loans'],
      // filterType: models.FilterType.BasicFilter,
    }
    console.log('snake  t', report)
    try {
      const updatedReport = await report.updateFilters(models.FiltersOperations.Add, [filter])
      console.log('updatedReport', updatedReport)
    }
    catch (err) {
      console.log('report err', err)
    }

  }

  useEffect(() => {
    if (report) {
      updateReportFilters()
    }
  }, [report])

  return (
  !error && accessToken && <div className="powerbiContainer">
      <PowerBIEmbed
        cssClassName={
          "powerbiContainer"
        }
        embedConfig={{
          type: 'report',
          accessToken: accessToken,
          embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=70827c05-4cd2-4f91-b6e2-c3892727de2b&groupId=34d737de-5e53-44a7-8c8d-f721004910b1&uid=y1wna',
          id: '70827c05-4cd2-4f91-b6e2-c3892727de2b', // Replace with your report ID
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false
              }
            },
            background: models.BackgroundType.Transparent,
          }
        }}
        eventHandlers={
          new Map([
            ['loaded', function () { console.log('Report loaded'); }],
            ['rendered', function () { console.log('Report rendered'); }],
            ['error', function (event) { console.log(event.detail); }],
            ['visualClicked', () => console.log('visual clicked')],
            ['pageChanged', (event) => console.log(event)],
          ])
        }
        getEmbeddedComponent={(embeddedReport) => {
          console.log('report', embeddedReport)
          setReport(embeddedReport)
        }}

      // style={{ width: '100%', height: '1000px' }}
      />
    </div>
  );
};

export default Dashboard;
