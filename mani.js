const loginWindow = document.querySelector('.login-container')
const registrationWindow = document.querySelector('.registration-container')
const formLogin = loginWindow.querySelector('.form-login')
const formRegistration = registrationWindow.querySelector('.form-registration')
const loginLink = loginWindow.querySelector('.create-acount-btn')
const main = document.querySelector('.main')
const logeOut = document.querySelector('.btn-loge-out')
const formTask = document.querySelector('.form-to-do-list')
const list = document.querySelector('.list')
let tasks = JSON.parse(localStorage.getItem('tasks')) || []

document.addEventListener('DOMContentLoaded', () => {
	const tasksData = JSON.parse(localStorage.getItem('tasks'))
	const isAuth = localStorage.getItem('auth')

	if (isAuth === 'true') {
		loginWindow.classList.add('login-container-hidden')
		main.classList.remove('whole')
	}
	if (!Array.isArray(tasks)) {
		tasks = []
	}
	if (tasksData) {
		tasks = tasksData
		tasks.forEach(tasks => {
			createTask(tasks)
		})
	}
})

loginLink.addEventListener('click', () => {
	loginWindow.classList.add('login-container-hidden')
	registrationWindow.classList.remove('registration-container-hidden')
})

formRegistration.addEventListener('submit', evt => {
	evt.preventDefault()
	const formData = new FormData(evt.target)
	const isValid =
		Array.from(formData).length ===
		Array.from(formData).filter(([, el]) => Boolean(el.trim())).length

	if (!isValid) {
		return
	}

	const obj = Array.from(formData).reduce((acc, el) => {
		acc[el[0]] = el[1]
		return acc
	}, {})

	localStorage.setItem('data', JSON.stringify(obj))
	loginWindow.classList.remove('login-container-hidden')
	registrationWindow.classList.add('registration-container-hidden')
})

formLogin.addEventListener('submit', evt => {
	evt.preventDefault()
	const returnObj = JSON.parse(localStorage.getItem('data'))
	const formData = Array.from(new FormData(evt.target))
	if (
		formData[0][1] === returnObj['login'] &&
		formData[1][1] === returnObj['password']
	) {
		loginWindow.classList.add('login-container-hidden')
		main.classList.remove('whole')
	}

	localStorage.setItem('auth', 'true')
})

logeOut.addEventListener('click', () => {
	main.classList.add('whole')
	loginWindow.classList.remove('login-container-hidden')
	registrationWindow.classList.add('registration-container-hidden')
	formLogin.reset()
	localStorage.removeItem('auth')
})

formTask.addEventListener('submit', evt => {
	evt.preventDefault()
	let value = document.querySelector('.task').value
	if (value.trim() === '') {
		return
	}
	addTask(value)
})

function addTask(value) {
	const info = {
		id: Date.now(),
		text: value,
	}

	tasks.push(info)
	localStorage.setItem('tasks', JSON.stringify(tasks))
	createTask(info)
}

list.addEventListener('click', deleteTask)

function deleteTask(event) {
	console.log(event.target.id)
	if (event.target.dataset.action !== 'delete') return
	const parentNode = event.target.closest('.list-item')
	const id = Number(parentNode.id)
	parentNode.remove()
	const index = tasks.findIndex(task => task.id === id)
	tasks.splice(index, 1)
}

list.addEventListener('click', doneBtn)

function doneBtn(event) {
	console.log(event.target.parentNode)
	if (!event.target.parentNode) {
		return
	}
	const parentNode = event.target.closest('.list-item')
	const id = Number(parentNode.id)
	// const index = tasks.find((task) => task.id === id);

	const taskTitle = parentNode.querySelector('.task-title')
	taskTitle.classList.toggle('cross')
}

const getTemplate = item => {
	console.log(item)
	return `
  <li class="list-item" id = '${item.id}'>
  
  <p class = 'task-title'>${item.text}</p>
  <div class = 'wraper-btn'>
  <button  data-action = 'delete' class="delete-btn">delete</button>
  <button data-action = 'done' class  = 'done-btn' ><img src = 'https://cdn-icons-png.flaticon.com/512/190/190411.png?w=1380&t=st=1691603185~exp=1691603785~hmac=77df1ff140a74a4053be02654745d89900251b73fb49cae0e76b0d9429cbfb1b'></button> 
  </div>
  </li> `
}

const createTask = task => {
	list.insertAdjacentHTML('beforeend', getTemplate(task))
	document.querySelector('.task').value = ''
}
