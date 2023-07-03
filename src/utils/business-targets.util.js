const months = ['april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'january', 'february', 'march']


function addCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function convertAmount(amount, currency) {
    if (currency === "crores") {
        const crore = amount / 10000000;
        return addCommas(crore.toFixed(2)) + " Cr";
    } else if (currency === "lakhs") {
        const lakh = amount / 100000;
        return addCommas(lakh.toFixed(2)) + " L";
    } else if (currency === "absolute") {
        return addCommas(amount.toString());
    } else {
        return ""; // Return empty string for unsupported currency
    }
}

function setAmountData(data, currency) {
    var temp = JSON.parse(JSON.stringify(data));
    const arr = ['volume', 'payIn', 'payOut', 'retention']
    for (var i = 0; i < months.length; i++) {
        const res = temp[months[i]];
        // eslint-disable-next-line array-callback-return
        arr.map(a => {
            if (res) {
                const amount = convertAmount(res[a], currency)
                res[a] = amount;
            }
        })
        temp[months[i]] = res
    }
    return temp;
}

export function setAmount(currency, data, setProductData, setSubProductData, setChannelData) {
    const { product, subProduct, channel } = data
    if(product){
        var productData = setAmountData(product, currency)
        setProductData(productData)
    }
    var subpArr = []
    if (subProduct) {
        for (var i = 0; i < subProduct.length; i++) {
            subpArr.push(setAmountData(subProduct[i], currency))
        }
        setSubProductData(subpArr)
    }
    subpArr = []
    if (channel) {
        for (i = 0; i < channel.length; i++) {
            subpArr.push(setAmountData(channel[i], currency))
        }
        setChannelData(subpArr)
    }
}


export function getMonths(status) {
  if (status === "actual") {
    // Get the current date
    const currentDate = new Date();

    // Get the current month and year
    const currentMonth = currentDate.getMonth();

    // Calculate the previous month
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    // Get the name of the previous month
    const arr = [
      { displayValue: 'jan', value: 'january' },
      { displayValue: 'feb', value: 'february' },
      { displayValue: 'mar', value: 'march' },
      { displayValue: 'apr', value: 'april' },
      { displayValue: 'may', value: 'may' },
      { displayValue: 'jun', value: 'june' },
      { displayValue: 'jul', value: 'july' },
      { displayValue: 'aug', value: 'august' },
      { displayValue: 'sep', value: 'september' },
      { displayValue: 'oct', value: 'october' },
      { displayValue: 'nov', value: 'november' },
      { displayValue: 'dec', value: 'december' }
    ];
    const previousMonthName = arr[previousMonth];

    return [previousMonthName]
  }
  else {
    return [
      { displayValue: 'apr', value: 'april' },
      { displayValue: 'may', value: 'may' },
      { displayValue: 'jun', value: 'june' },
      { displayValue: 'jul', value: 'july' },
      { displayValue: 'aug', value: 'august' },
      { displayValue: 'sep', value: 'september' },
      { displayValue: 'oct', value: 'october' },
      { displayValue: 'nov', value: 'november' },
      { displayValue: 'dec', value: 'december' },
      { displayValue: 'jan', value: 'january' },
      { displayValue: 'feb', value: 'february' },
      { displayValue: 'mar', value: 'march' }
    ]
  }
}

export function getColumnHeaders(months,selectedYear) {
    if (selectedYear !== 'select') {
      const [startYear, endYear] = selectedYear.split(' ')[1].split('-');
      const formattedMonths = months.map((month, index) => {
        let yearSuffix = startYear;
        if (index < 9) {
          yearSuffix = startYear.slice(-2);
        } else {
          yearSuffix = endYear.slice(-2);
        }
        return {
          displayValue: `${month.displayValue}-${yearSuffix}`,
          value: month.value
        };
      });
      return [formattedMonths, endYear];
    }
  };

