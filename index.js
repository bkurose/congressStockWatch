//Get request, refines & sorts the dataset, populates Nav and first details
fetch('https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json')
.then(res => res.json())
.then(res => {
    let disclosures = (res.filter(item => item['amount'] == '$1,000,001 - $5,000,000' || item['amount'] == '$5,000,001 - $25,000,000' || item['amount'] == '$25,000,001 - $50,000,000' || item['amount'] == '$50,000,000 +'))
    disclosures = disclosures.sort((transaction1, transaction2) => new Date(transaction2.transaction_date).getTime() - new Date(transaction1.transaction_date).getTime())
    console.log(disclosures)
    disclosures.forEach((item, i) => {
        item.id = i++
        renderNavItem(item)
    })
    renderDetails(disclosures[0])
    renderChartData()
})

//populates Navigation Bar
function renderNavItem(item){
    let navBar = document.querySelector('#navigationBar')
    let container = document.createElement('div')
    container.className = 'navItem'
    let date = document.createElement('h3')
    let member = document.createElement('h3')
    let ticker = document.createElement('h4')
    let favoriteStar = document.createElement('p')

    item.favorite = false

    favoriteStar.className = 'hidden'
    favoriteStar.textContent = '⭐'
    favoriteStar.id =`a${item.id}`
    
    date.textContent = `${new Date(item.transaction_date).toLocaleDateString('en-us', {month:"short", day:"numeric", year:"numeric", })}`
    let name = nameFix(item)
    member.textContent = `${name}`

    if(item.ticker == '--'){ticker.textContent = `Not Publicly Traded`}
    else{ticker.innerText = `${item.ticker}`}

    container.append(favoriteStar, ticker, member, date)
    navBar.append(container)
    container.addEventListener('click', () => {
        renderDetails(item)
        renderChartData()
        let containerDiv = document.querySelector('#transactionsList')
        containerDiv.classList = 'hidden'
    })
}

function nameFix(item){
    if(item.representative.includes('Dr ')){
        let honTrim = item.representative.replace('Hon. ', '')
        let drTrim = honTrim.replace('Dr ', '')
        let trimFinal = 'Dr. ' + drTrim
        return trimFinal.toString()
    }
    else{
        let honTrim = item.representative.replace('Hon. ', '')
        return honTrim.toString()
    }
}

//allows global access to the particular item in the details section
let itemGlobal;

//renders the details from the clicked navigation element into the details section
function renderDetails(item){
    itemGlobal = item
    let tranDate = document.querySelector('#tranDate')
    let disDate = document.querySelector('#disDate')
    let member = document.querySelector('#member')
    let description = document.querySelector('#description')
    let amount = document.querySelector('#amount')
    let ticker = document.querySelector('#ticker')
    let favorite = document.querySelector('#favorite')

    tranDate.innerText = `${new Date(item.transaction_date).toLocaleDateString('en-us', {month:"short", day:"numeric", year:"numeric", })}`
    disDate.innerText = `${new Date(item.disclosure_date).toLocaleDateString('en-us', {month:"short", day:"numeric", year:"numeric", })}`

    let name = nameFix(item)
    member.innerText = `${name}`
    description.innerText = `Description: ${item.asset_description}`
    amount.innerText = `Amount: ${item.amount}`
    
    if(item.ticker == '--'){ticker.textContent = `Not Publicly Traded`}
    else{ticker.innerText = `${item.ticker}`}

    item.favorite ? favorite.innerText = 'Favorite ⭐' : favorite.innerText = 'Favorite ☆'

}

//adds favorite button
document.querySelector('#favorite').addEventListener('click', (e) => {
    updateFav(e, itemGlobal)
    document.querySelector
})


//updates favorite status
function updateFav(e, item){
    item.favorite = !item.favorite;
    let navFav = document.querySelector(`#a${item.id}`);
    navFav.classList.toggle('hidden');
    renderDetails(item);
}

//add sorting clickable
document.querySelector('#ticker').addEventListener('click', updateTicker)

document.querySelector('#member').addEventListener('click', updateMember)

document.querySelector('#tranDate').addEventListener('click', updateTranDate)

document.querySelector('#disDate').addEventListener('click', updateDisDate)

//GET request, clears last request, sort and refine dataset, displays new data
function updateTicker(){
    fetch('https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json')
    .then(res => res.json())
    .then(res => {
        let oldList = document.querySelector('#transactionsUl')
        oldList.remove()

        let containerDiv = document.querySelector('#transactionsList')
        containerDiv.classList = false

        let header = document.querySelector('#transactionsHeader')
        header.textContent = itemGlobal.ticker == '--' ? `Recent Congressional Transactions on Other Assets:` : `Recent Congressional Transactions for ${itemGlobal.ticker}:`

        let transactionsUl = document.createElement('ul')
        transactionsUl.id = 'transactionsUl'
        containerDiv.append(transactionsUl)

        let sortedDisclosures = res.sort((transaction1, transaction2) => new Date(transaction2.transaction_date).getTime() - new Date(transaction1.transaction_date).getTime());
        // console.log(sortedDisclosures)

        sortedDisclosures.forEach(item => {
            if(item.ticker == itemGlobal.ticker){
                handleUpdateTicker(item)
            }
        })
    })
}

function updateMember(){
    fetch('https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json')
    .then(res => res.json())
    .then(res => {
        let oldList = document.querySelector('#transactionsUl')
        oldList.remove()

        let containerDiv = document.querySelector('#transactionsList')
        containerDiv.classList = false

        let header = document.querySelector('#transactionsHeader')
        let name = nameFix(itemGlobal)
        header.textContent = `Recent Transactions by ${name}:`

        let transactionsUl = document.createElement('ul')
        transactionsUl.id = 'transactionsUl'
        containerDiv.append(transactionsUl)

        let sortedDisclosures = res.sort((transaction1, transaction2) => new Date(transaction2.transaction_date).getTime() - new Date(transaction1.transaction_date).getTime());
        // console.log(sortedDisclosures)

        sortedDisclosures.forEach(item => {
            if(item.representative == itemGlobal.representative){
                handleUpdateMember(item)
            }
        })
    })
}

function updateTranDate(){
    fetch('https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json')
    .then(res => res.json())
    .then(res => {
        let oldList = document.querySelector('#transactionsUl')
        oldList.remove()

        let containerDiv = document.querySelector('#transactionsList')
        containerDiv.classList = false

        let header = document.querySelector('#transactionsHeader')
        header.textContent = `Congressional Transactions on ${new Date(itemGlobal.transaction_date).toLocaleDateString('en-us', {month:"short", day:"numeric", year:"numeric", })}:`

        let transactionsUl = document.createElement('ul')
        transactionsUl.id = 'transactionsUl'
        containerDiv.append(transactionsUl)

        let sortedDisclosures = res.sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
        // console.log(sortedDisclosures)

        sortedDisclosures.forEach(item => {
            if(item.transaction_date == itemGlobal.transaction_date){
                handleUpdateTranDate(item)
            }
        })
    })
}

function updateDisDate(){
    fetch('https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json')
    .then(res => res.json())
    .then(res => {
        let oldList = document.querySelector('#transactionsUl')
        oldList.remove()

        let containerDiv = document.querySelector('#transactionsList')
        containerDiv.classList = false

        let header = document.querySelector('#transactionsHeader')
        header.textContent = `Congressional Transactions Disclosed on ${new Date(itemGlobal.disclosure_date).toLocaleDateString('en-us', {month:"short", day:"numeric", year:"numeric", })}:`

        let transactionsUl = document.createElement('ul')
        transactionsUl.id = 'transactionsUl'
        containerDiv.append(transactionsUl)

        let sortedDisclosures = res.sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
        // console.log(sortedDisclosures)

        sortedDisclosures.forEach(item => {
            if(item.disclosure_date == itemGlobal.disclosure_date){
                handleUpdateDisDate(item)
            }
        })
    })
}

//handles updating new data for display
function handleUpdateTicker(item){
    let transactionsUl = document.querySelector('#transactionsUl')
    let transactionLi = document.createElement('li')
    let date = document.createElement('h7')
    let member = document.createElement('p')
    let description = document.createElement('p')
    let amount = document.createElement('p')

    date.textContent = `Transaction Date: ${new Date(item.transaction_date).toLocaleDateString('en-us', {month:"short", day:"numeric", year:"numeric", })}`
    let name = nameFix(item)
    member.textContent = `Congress Member: ${name}`
    description.textContent = `Description: ${item.asset_description}`
    amount.textContent = `Amount: ${item.amount}`

    transactionLi.append(date, member, description, amount)
    transactionsUl.append(transactionLi)
}

function handleUpdateMember(item){
    let transactionsUl = document.querySelector('#transactionsUl')
    let transactionLi = document.createElement('li')
    let date = document.createElement('h7')
    let ticker = document.createElement('p')
    let description = document.createElement('p')
    let amount = document.createElement('p')

    date.textContent = `Transaction Date: ${new Date(item.transaction_date).toLocaleDateString('en-us', {month:"short", day:"numeric", year:"numeric", })}`
    ticker.textContent = item.ticker == '--' ? `Other Assets` : `Ticker: ${item.ticker}`
    description.textContent = `Description: ${item.asset_description}`
    amount.textContent = `Amount: ${item.amount}`

    transactionLi.append(ticker, date, description, amount)
    transactionsUl.append(transactionLi)
}

function handleUpdateTranDate(item){
    let transactionsUl = document.querySelector('#transactionsUl')
    let transactionLi = document.createElement('li')
    let ticker = document.createElement('h7')
    let member = document.createElement('p')
    let description = document.createElement('p')
    let amount = document.createElement('p')

    ticker.textContent = item.ticker == '--' ? `Other Assets` : `Ticker: ${item.ticker}`
    let name = nameFix(item)
    member.textContent = `Congress Member: ${name}`
    description.textContent = `Description: ${item.asset_description}`
    amount.textContent = `Amount: ${item.amount}`

    transactionLi.append(ticker, member, description, amount)
    transactionsUl.append(transactionLi)
}

function handleUpdateDisDate(item){
    let transactionsUl = document.querySelector('#transactionsUl')
    let transactionLi = document.createElement('li')
    let ticker = document.createElement('h7')
    let member = document.createElement('p')
    let description = document.createElement('p')
    let amount = document.createElement('p')

    ticker.textContent = item.ticker == '--' ? `Other Assets` : `Ticker: ${item.ticker}`
    let name = nameFix(item)
    member.textContent = `Congress Member: ${name}`
    description.textContent = `Description: ${item.asset_description}`
    amount.textContent = `Amount: ${item.amount}`

    transactionLi.append(ticker, member, description, amount)
    transactionsUl.append(transactionLi)
}

//get chart data:
function renderChartData(){
    fetch('https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json')
    .then(res => res.json())
    .then(res => {
        let oldCanvas = document.querySelector('canvas')
        oldCanvas.remove()
        let tickerSorted = res.filter(item => item.ticker == itemGlobal.ticker);
        let timeSorted = tickerSorted.filter(item => 31536000000 > new Date().getTime() - new Date(item.transaction_date).getTime())
        
        let jan = 0
        let janTransactions = timeSorted.filter(item => new Date(item.transaction_date).getMonth() == 0)
        jan = janTransactions.length
        
        let feb = 0
        let febTransactions = timeSorted.filter(item => new Date(item.transaction_date).getMonth() == 1)
        feb = febTransactions.length
        
        let mar = 0
        let marTransactions = timeSorted.filter(item => new Date(item.transaction_date).getMonth() == 2)
        mar = marTransactions.length
        
        let apr = 0
        let aprTransactions = timeSorted.filter(item => new Date(item.transaction_date).getMonth() == 3)
        apr = aprTransactions.length
        
        let may = 0
        let mayTransactions = timeSorted.filter(item => new Date(item.transaction_date).getMonth() == 4)
        may = mayTransactions.length
        
        let jun = 0
        let junTransactions = timeSorted.filter(item => new Date(item.transaction_date).getMonth() == 5)
        jun = junTransactions.length
        
        let jul = 0
        let julTransactions = timeSorted.filter(item => new Date(item.transaction_date).getMonth() == 6)
        jul = julTransactions.length
        
        let aug = 0
        let augTransactions = timeSorted.filter(item => new Date(item.transaction_date).getMonth() == 7)
        aug = augTransactions.length
        
        let sep = 0
        let sepTransactions = timeSorted.filter(item => new Date(item.transaction_date).getMonth() == 8)
        sep = sepTransactions.length
        
        let oct = 0
        let octTransactions = timeSorted.filter(item => new Date(item.transaction_date).getMonth() == 9)
        oct = octTransactions.length
        
        let nov = 0
        let novTransactions = timeSorted.filter(item => new Date(item.transaction_date).getMonth() == 10)
        nov = novTransactions.length
        
        let dec = 0
        let decTransactions = timeSorted.filter(item => new Date(item.transaction_date).getMonth() == 11)
        dec = decTransactions.length

        let currentMonth = new Date().getMonth()
        let monthData = [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
        let monthStart = monthData.splice(currentMonth + 1) 
        let monthEnd = monthData.splice(0, currentMonth + 1)
        let monthDataSorted = monthStart.concat(monthEnd)

        let monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        let monthLabelStart = monthLabels.splice(currentMonth + 1)
        let monthLabelEnd = monthLabels.splice(0, currentMonth + 1)
        let monthLabelSorted = monthLabelStart.concat(monthLabelEnd)

        let canvas = document.createElement('canvas')
        canvas.id = 'chart';
        document.querySelector('#chartContainer').append(canvas)

        let chart = document.querySelector('#chart').getContext('2d');
        
        let title = itemGlobal.ticker == '--' ? `Number of Congressional Transactions Over Past Year on Other Assets` : `Number of Congressional Transactions on ${itemGlobal.ticker} Over Past Year`

        let data = {
            labels: monthLabelSorted,
            datasets: [{
                label: title,
                data: monthDataSorted,
                fill: false,
                borderColor: 'red',
                tension: 0.1
            }],  
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 20
                            }
                        }
                    }
                }
            }
        };
            
        new Chart(chart, config)
        
    })
}




//chart setup
// let chart = document.querySelector('#chart').getContext('2d');

// let labels = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
// let title =  `Number of Congressional Transactions on TICKER Over Past Year`

// let data = {
//     labels: labels,
//     datasets: [{
//         label: title,
//         data: [65, 59, 80, 81, 56, 55, 40],
//         fill: false,
//         borderColor: '',
//         tension: 0.1
//     }],  
// };

// const config = {
//     type: 'line',
//     data: data,
//     options: {
//         plugins: {
//             legend: {
//                 labels: {
//                     font: {
//                         size: 20
//                     }
//                 }
//             }
//         }
//     }
// };
    
// new Chart(chart, config)

// .amount categories:
// '$1,001 - $15,000'
// '$15,001 - $50,000'
// '$250,001 - $500,000'
// '$500,001 - $1,000,000'
// '$1,000,001 - $5,000,000'
// '$5,000,001 - $25,000,000'
// '$25,000,001 - $50,000,000'
// '$50,000,000 +'
//⭐
//☆