const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users/'

// DOM節點
const dataPanel = document.querySelector('#data-panel')
const modal = document.querySelector('#modal')

const friends = JSON.parse(localStorage.getItem('friends')) || []

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
                <button type="button" class="btn btn-danger delete-user"  data-id="${item.id}">Delete</button>
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
    })

    // const user = users.find((user) => user.id === id) // or use axios
  } else if (event.target.matches('.delete-user')) {
    const id = Number(event.target.dataset.id)
    const startIndex = friends.findIndex((user) => user.id === id)

    friends.splice(startIndex, 1)
    renderCards(friends)
    localStorage.setItem('friends', JSON.stringify(friends))
  }
}

function initUserList() {
  renderCards(friends)
}

// Start
initUserList()

// 綁定監聽器
dataPanel.addEventListener('click', onDataPanelClicked)

// To-do
// Add delete all
