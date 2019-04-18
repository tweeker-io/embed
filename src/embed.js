const hover = (event) => {
  event.target.style.backgroundColor = 'green';
}

const unhover = (event) => {
  event.target.style.backgroundColor = '';
}

const editElement = (event) => {
  event.preventDefault()
  console.log(event.target.innerText)
}

document.addEventListener('mouseover', hover)
document.addEventListener('mouseout', unhover)
document.addEventListener('click', editElement)
