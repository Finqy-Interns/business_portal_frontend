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
          accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMzI4YzYzNTgtNWU3YS00MzYwLTk4NzYtYzkxMDFkNWY1OGE1LyIsImlhdCI6MTY4ODU1NzExMSwibmJmIjoxNjg4NTU3MTExLCJleHAiOjE2ODg1NjE3OTUsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84VEFBQUEvQUlWRzdKNlJMcnBpdS8ycmVJcEJzOVljcTR3TnJqTXI2YlFJcG8xdHNGRFQwc3M2YndRN1hLT0pIQ0JKYWJzIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjU3MzFlM2Q5LTNiZmUtNGIwYS04MzhmLTAyMWQyMTFjNDFhOSIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiRmlucXkiLCJnaXZlbl9uYW1lIjoiUG93ZXJiaSIsImlwYWRkciI6IjExOS4xOC41NC41MSIsIm5hbWUiOiJQb3dlcmJpIEZpbnF5Iiwib2lkIjoiODY4MWIxNTctYzlkYy00NmE1LTkzMWItM2ExNDA3YTEyMGNhIiwicHVpZCI6IjEwMDMyMDAxNUUwOTIyQUUiLCJyaCI6IjAuQVhBQVdHT01NbnBlWUVPWWRza1FIVjlZcFFrQUFBQUFBQUFBd0FBQUFBQUFBQUJ3QUNrLiIsInNjcCI6IkFwcC5SZWFkLkFsbCBDYXBhY2l0eS5SZWFkLkFsbCBDYXBhY2l0eS5SZWFkV3JpdGUuQWxsIENvbnRlbnQuQ3JlYXRlIERhc2hib2FyZC5SZWFkLkFsbCBEYXNoYm9hcmQuUmVhZFdyaXRlLkFsbCBEYXRhZmxvdy5SZWFkLkFsbCBEYXRhZmxvdy5SZWFkV3JpdGUuQWxsIERhdGFzZXQuUmVhZC5BbGwgRGF0YXNldC5SZWFkV3JpdGUuQWxsIEdhdGV3YXkuUmVhZC5BbGwgR2F0ZXdheS5SZWFkV3JpdGUuQWxsIFJlcG9ydC5SZWFkLkFsbCBSZXBvcnQuUmVhZFdyaXRlLkFsbCBTdG9yYWdlQWNjb3VudC5SZWFkLkFsbCBTdG9yYWdlQWNjb3VudC5SZWFkV3JpdGUuQWxsIFdvcmtzcGFjZS5SZWFkLkFsbCBXb3Jrc3BhY2UuUmVhZFdyaXRlLkFsbCIsInN1YiI6IlFFd3d4ZmdCR0xRYnVpckhoMktYOHlQYlJUVnpWcDFhcFNkT3g1V0JFd2ciLCJ0aWQiOiIzMjhjNjM1OC01ZTdhLTQzNjAtOTg3Ni1jOTEwMWQ1ZjU4YTUiLCJ1bmlxdWVfbmFtZSI6InBvd2VyYmlAZmlucXkub25taWNyb3NvZnQuY29tIiwidXBuIjoicG93ZXJiaUBmaW5xeS5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiI3dzEtX1FEZWhFR1B3amxjNG80VkFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJhOWVhODk5Ni0xMjJmLTRjNzQtOTUyMC04ZWRjZDE5MjgyNmMiLCJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3BsIjoiZW4tVVMifQ.YYJHHfagP5Or0EzpxMopPB2XJCwTEk0-hPm2r8lqMZml9b2zCj8V97WntRBS1zCnOQx4nVbNzIn7klZnVd74lVVIFc57Wf-BX80XH8FAaYoCNcj5bBZjlZs1h7k4F5LLo6nYFqwVYHStcO_NKYqBm3eHLI8-whGiSkqjT61-2X6V_juEc8V0VtFS0jLWSl80aYz9KzmfCCs3Tk5jAcBrmYiUL8l4JaSg7_mUDBkJaplTjajKVawsTOVM2TpKt-y26UfS1D5u-X9QuPhAFbAwl1t4jtDEyxs1kL4da3g0LVHeZm8H3vXHnO9ip3tF9CG9AgQsa4KNEUKVqcICWj3aBQ",
          embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=70827c05-4cd2-4f91-b6e2-c3892727de2b',
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
