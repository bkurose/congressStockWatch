fetch('https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json')
.then(res => res.json())
.then(res => {
    let disclosures = (res.filter(item => item['amount'] == '$5,000,001 - $25,000,000' || item['amount'] == '$25,000,001 - $50,000,000' || item['amount'] == '$50,000,000 +'))
    console.log(disclosures)
    // disclosures.forEach(item => renderNavItem(item))
})

// function renderNavItem(item){
//     let navBar = document.querySelector('#navigationBar')
//     let container = document.createElement('div')
//     container.className = 'navItem'
//     let date = document.createElement('h3')
//     let member = document.createElement('h4')
//     let ticker = document.createElement('h4')

//     date.textContent = `Date: ${item.transaction_date}`
//     member.textContent = `${item.representative}`
//     ticker.textContent = `${item.ticker}`

//     container.append(date, member,ticker)
//     navBar.append(container)
// }



// function renderDetails()



// function()


// 

// .amount categories
// '$1,001 - $15,000'
// '$15,001 - $50,000'
// '$250,001 - $500,000'
// '$500,001 - $1,000,000'
// '$1,000,001 - $5,000,000'
// '$5,000,001 - $25,000,000'
// '$25,000,001 - $50,000,000'
// '$50,000,000 +'

