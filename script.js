// const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
// const crosURL = 'https://cors-anywhere.herokuapp.com/'
const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users/'

// DOM節點
const dataPanel = document.querySelector('#data-panel')
const modal = document.querySelector('#modal')
const selectform = document.querySelector('#select-form')
const searchform = document.querySelector('#search-form')
const pagination = document.querySelector('#pagination')

const USERS_PER_PAGE = 12
const users = []
let filteredUsers = []

function renderCards(data) {
  dataPanel.innerHTML = data
    .map(
      (item) => ` <div class="col-sm-6 col-md-4 col-lg-3 mb-3">
        <div class="card align-items-center">
          <img class="avatar" src="${item.avatar}">
          <div class="card-body text-center">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">
            </p>
            <button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modal" data-id="${item.id}">More <i
                class="fa-solid fa-circle-info"></i></button>
          </div>
        </div>
      </div>`
    )
    .join('')
}

function renderPagination(amount) {
  // 200 / 12 = 16 ....
  const numberOfPage = Math.ceil(amount / USERS_PER_PAGE)

  let rawHTML = ''
  for (let i = 1; i <= numberOfPage; i++) {
    rawHTML += `
 <li class="page-item"><a class="page-link" data-page="${i}" href="#">${i}</a></li>
`
  }
  pagination.innerHTML = rawHTML
}

function onDataPanelClicked(event) {
  if (event.target.matches('.btn-info')) {
    const modalTitle = document.querySelector('#modal-title')
    const modalBody = document.querySelector('#modal-body')
    const modalFooter = document.querySelector('#modal-footer')

    const id = Number(event.target.dataset.id)

    axios.get(`${INDEX_URL}${id}`).then((res) => {
      const user = res.data

      modalTitle.innerHTML = `<i class="fa-solid fa-user">${user.name}</i>`
      modalBody.innerHTML = `<div><img class="avatar" src="${user.avatar}"></div>
    <ul>
    <li><i class="fa-solid fa-address-card"></i> ID : ${user.id}</li>
    <li><i class="fa-solid fa-face-smile"></i> Surname : ${user.surname}</li>
    <li><i class="fa-solid fa-envelope"></i> Email : ${user.email}</li>
    <li><i class="fa-solid fa-venus-double"></i> Gender : ${user.gender}</li>
    <li><i class="fa-sharp fa-solid fa-flag"></i> Region : ${user.region}</li>
    <li><i class="fa-solid fa-cake-candles"></i> Birthday : ${user.birthday}</li>
    </ul>
    `
      modalFooter.innerHTML = `<button type="button" class="btn btn-primary add-friend"  data-id="${user.id}">Add</button>`
    })

    // const user = users.find((user) => user.id === id) // or use axios
  }
}

function onModalClicked(event) {
  if (event.target.matches('.add-friend')) {
    const id = Number(event.target.dataset.id)

    // localStorage
    const friends = JSON.parse(localStorage.getItem('friends')) || []

    if (friends.some((user) => user.id === id)) {
      alert('已在朋友清單')
      return
    }

    friends.push(users.find((user) => user.id === id))
    console.log(friends)
    localStorage.setItem('friends', JSON.stringify(friends))
  }
}

function onPaginationClicked(event) {
  if (event.target.tagName !== 'A') return
  renderCards(getUsersByPage(event.target.dataset.page))
}

function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USERS_PER_PAGE
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

function searchUser(event) {
  const keyword = event.target.value.toLowerCase().trim()
  if (!keyword.length) return

  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  )

  if (!filteredUsers.length) return alert('找不到資料')

  renderPagination(filteredUsers.length)
  renderCards(getUsersByPage(1))
}

function filterUser(event) {
  if (event.target.value === 'male' || event.target.value === 'female') {
    const gender = event.target.value
    filteredUsers = users.filter((user) => user.gender === gender)
    renderPagination(filteredUsers.length)
    renderCards(getUsersByPage(1))
  } else {
    filteredUsers = []
    renderPagination(users.length)
    renderCards(getUsersByPage(1))
  }
}

function initUserList() {
  axios
    .get(`${INDEX_URL}`)
    .then((response) => {
      users.push(...response.data.results)
      renderPagination(users.length)
      renderCards(getUsersByPage(1))
    })
    .catch(function (error) {
      console.log(error)
    })
}

// Start
initUserList()

// 綁定監聽器
pagination.addEventListener('click', onPaginationClicked)
dataPanel.addEventListener('click', onDataPanelClicked)
modal.addEventListener('click', onModalClicked)
searchform.addEventListener('keyup', searchUser)
selectform.addEventListener('change', filterUser)
