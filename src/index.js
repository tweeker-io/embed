import finder from '@medv/finder';
import { PARENT_DOMAIN } from 'babel-dotenv';

const hover = (event) => {
  event.target.style.backgroundColor = 'green';
}

const unhover = (event) => {
  event.target.style.backgroundColor = '';
}

const editElement = (event) => {
  event.preventDefault()

  window.parent.postMessage({
    selector: finder(event.target),
    text: event.target.innerText
  }, PARENT_DOMAIN)
}

document.addEventListener('mouseover', hover)
document.addEventListener('mouseout', unhover)
document.addEventListener('click', editElement)
