document.addEventListener('mouseover', function(event) {
  event.target.style.backgroundColor = 'green';
}, false);

document.addEventListener('click', function(event) {
  event.preventDefault()
  console.log(event.target.innerText)
}, false);

document.addEventListener('mouseout', function(event) {
  event.target.style.backgroundColor = '';
}, false);
