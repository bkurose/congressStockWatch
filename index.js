fetch('https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json')
.then(res => res.json())
.then(res => {
    let disclosures = (res.filter(item => item['amount'] == '$1,000,001 - $5,000,000' || item['amount'] == '$5,000,001 - $25,000,000' || item['amount'] == '$25,000,001 - $50,000,000' || item['amount'] == '$50,000,000 +'))
    disclosures = disclosures.sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
    console.log(disclosures)
    disclosures.forEach(item => renderNavItem(item))
    renderDetails(disclosures[0])
})

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
    container.addEventListener('click', () => renderDetails(item))
}

let itemGlobal;

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

document.querySelector('#favorite').addEventListener('click', (e) => updateFav(e, itemGlobal))

function updateFav(e, item){
    console.log(e)
    item.favorite = !item.favorite;
    renderDetails(item)
}

document.querySelector('#ticker').addEventListener('click', sortByTicker)

function sortByTicker(){
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
        console.log(sortedDisclosures)

        sortedDisclosures.forEach(item => {
            if(item.ticker == itemGlobal.ticker){
                handleUpdateTicker(item)
            }
        })
        


    })
}

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

// .amount categories
// '$1,001 - $15,000'⭐
// '$15,001 - $50,000'
// '$250,001 - $500,000'
// '$500,001 - $1,000,000'
// '$1,000,001 - $5,000,000'
// '$5,000,001 - $25,000,000'
// '$25,000,001 - $50,000,000'
// '$50,000,000 +'