fetch('https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json')
.then(res => res.json())
.then(res => res.forEach((item)=> {
    if(item['amount'].includes('$1,000,001 - $5,000,000') == true){
        console.log(item)
    }
}))

function populateNavigation

function renderDetails

function 




// .amount categories
// '$1,001 - $15,000'
// '$15,001 - $50,000'
// '$250,001 - $500,000'
// '$500,001 - $1,000,000'
// '$1,000,001 - $5,000,000'
// '$5,000,001 - $25,000,000'
// '$25,000,001 - $50,000,000'
// '$50,000,000 +'

