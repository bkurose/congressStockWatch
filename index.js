//Get request, refines & sorts the dataset, populates Nav and first details
fetch('https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json')
.then(res => res.json())
.then(res => {
    let disclosures = (res.filter(item => item['amount'] == '$1,000,001 - $5,000,000' || item['amount'] == '$5,000,001 - $25,000,000' || item['amount'] == '$25,000,001 - $50,000,000' || item['amount'] == '$50,000,000 +'))
    disclosures = disclosures.sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
    // console.log(disclosures)
    disclosures.forEach(item => renderNavItem(item))
    renderDetails(disclosures[0])
    renderChartData()
})

//populates Navigation Bar
function renderNavItem(item){
    let navBar = document.querySelector('#navigationBar')
    let container = document.createElement('div')
    container.className = 'navItem'
    let date = document.createElement('h3')
    let member = document.createElement('h4')
    let ticker = document.createElement('h4')

    item.favorite = false

    date.textContent = `${item.transaction_date}`
    member.textContent = `${item.representative}`

    if(item.ticker == '--'){ticker.textContent = `Not Publicly Traded`}
    else{ticker.innerText = `${item.ticker}`}

    container.append(date, member,ticker)
    navBar.append(container)
    container.addEventListener('click', () => {
        renderDetails(item)
        renderChartData()
    })
}

//allows global access to the particular item in the details section
let itemGlobal;

//renders the details from the clicked navigation element into the details section
function renderDetails(item){
    itemGlobal = item
    let date = document.querySelector('#date')
    let member = document.querySelector('#member')
    let description = document.querySelector('#description')
    let amount = document.querySelector('#amount')
    let ticker = document.querySelector('#ticker')
    let favorite = document.querySelector('#favorite')

    date.innerText = `Transaction Date: ${item.transaction_date}`
    member.innerText = `Congress Member: ${item.representative}`
    description.innerText = `Description: ${item.asset_description}`
    amount.innerText = `Amount: ${item.amount}`
    
    if(item.ticker == '--'){ticker.textContent = `Not Publicly Traded`}
    else{ticker.innerText = `${item.ticker}`}

    item.favorite ? favorite.innerText = 'Favorite ⭐' : favorite.innerText = 'Favorite ☆'
}

//adds favorite button
document.querySelector('#favorite').addEventListener('click', (e) => updateFav(e, itemGlobal))

//updates favorite status
function updateFav(e, item){
    // console.log(e)
    item.favorite = !item.favorite;
    renderDetails(item)
}

//add sorting clickable
document.querySelector('#ticker').addEventListener('click', updateTicker)

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
        header.textContent = `Recent Congressional Transactions for ${itemGlobal.ticker}:`

        let transactionsUl = document.createElement('ul')
        transactionsUl.id = 'transactionsUl'
        containerDiv.append(transactionsUl)

        let sortedDisclosures = res.sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
        // console.log(sortedDisclosures)

        sortedDisclosures.forEach(item => {
            if(item.ticker == itemGlobal.ticker){
                handleUpdateTicker(item)
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

    date.textContent = `Date: ${item.transaction_date}`
    member.textContent = `Congress Member: ${item.representative}`
    description.textContent = `Description: ${item.asset_description}`
    amount.textContent = `Amount: ${item.amount}`

    transactionLi.append(date, member, description, amount)
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
        
        let title =  `Number of Congressional Transactions on ${itemGlobal.ticker} Over Past Year`

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