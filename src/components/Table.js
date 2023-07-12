import React, { useEffect, useState } from "react";

const Table = ({ data, months }) => {

  const [productData, setProductData] = useState(null)
  // console.log('data',data)
  useEffect(() => {
    setProductData(data)
  }, [data])

  // console.log('months',months)
  // const months = ['may']
  // const months = ['april','may','june','july','august','september','october','november','december','january','february','march']
  const headerRow = [
    'Particulars', ...months,
  ]

  const parameters = [
    {
      displayValue: 'Count (Nos.)',
      dataValue: 'count'
    },
    {
      displayValue: 'Volume (₹)',
      dataValue: 'volume'
    },
    {
      displayValue: 'Pay-In (₹)',
      dataValue: 'payIn'
    },
    {
      displayValue: 'Pay-Out (₹)',
      dataValue: 'payOut'
    },
    {
      displayValue: 'Retention (₹)',
      dataValue: 'retention',
    }
  ]

  return productData && <div className="table-container">
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          {
            headerRow.map((hr, index) => {
              return <th key={index}>
                {hr.displayValue?.charAt(0).toUpperCase() + hr.displayValue?.slice(1) || hr}
              </th>
            })
          }
        </tr>
      </thead>
      <tbody>
        {
          parameters.map((p, index) => {
            return (
              <tr key={index}>
                <td>{p.displayValue}</td>
                {
                  months.map((m, index2) => {
                    var roundedString;
                    if (productData[m.value]) {
                      const mynumber = parseFloat(`${productData[m.value][p.dataValue]}`)
                      const roundedNumber = Math.round(mynumber);
                      roundedString = roundedNumber.toString();
                      // console.log('m',`${}`);
                    }
                    return (
                      productData[m.value] ? <td key={index2}>{roundedString}</td> : <td key={index2}></td>
                    );
                  })
                }
              </tr>
            )
          })
        }
      </tbody>
    </table>
  </div>;
};

export default Table;
