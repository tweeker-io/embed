import { API_ROOT, SCRIPT_VERSION, NODE_ENV, BUSINESS_ID } from 'babel-dotenv';

window.TweekerData = {};

const run = () => {
  checkIfTweekerFrame()
  fetchVariants()
}

const checkIfTweekerFrame = () => {
  // This means the page is being run in an iframe,
  // Likely the tweeker editor, so don't run the script.
  if (window.location !== window.parent.location) { return; }
}

const fetchVariants = () => {
  return fetch(variantsUrl, {
    method: 'GET',
  }).then(response => response.json()).then(handleVariants)
}

const parseBusinessId = () => {
  if (NODE_ENV === 'development') { return BUSINESS_ID; }
  const script = window.currentScript || document.querySelector(`script[src*="${SCRIPT_VERSION}.js"]`)
  const src = script.src
  const existing = ['http:', 'https:', '', 'localhost:9000', 'cdn.tweeker.io', 'embed', `${SCRIPT_VERSION}.js`, 'latest.js']
  let array = src.split('/')
  const remaining = array.filter(element => !existing.includes(element))
  return remaining[0]
}

const variantsUrl = `${API_ROOT}/v1/tests/embed?url=${encodeURIComponent(window.location.href)}&business_id=${parseBusinessId()}`

const handleVariants = (data) => {
  if (data.variants.length < 1) { return; }
  saveLocally(data)
  bindVariants(data.variants)
  bindGoals(data.goals)
}

const saveLocally = (response) => {
  window.TweekerData = response;
  return response;
}

const bindVariants = (variants) => {
  variants.forEach(variant => {
    const element = document.querySelector(variant.selector);
    element.textContent = variant.text;
  })
}

const bindGoals = (goals) => {
  goals.forEach(goal => {
    const element = document.querySelector(goal.selector)
    const eventType = (goal.category === 'form') ? 'submit' : 'click'
    element.addEventListener(eventType, handleGoal)
    element.setAttribute('data-goalId', goal.id)
  })
}

const handleGoal = (event) => {
  const url = API_ROOT + '/v1/successes';
  const target = event.target;

  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(successData(target))
  })
}

const successData = (target) => {
  return {
    goal_id: target.getAttribute('data-goalId'),
    variant_ids: window.TweekerData.variants.map(variant => variant.id)
  }
}

if (/complete|interactive|loaded/.test(document.readyState)) {
  // In case DOMContentLoaded was already fired.
  run();
} else {
  // In case DOMContentLoaded was not yet fired,
  // use it to run the "start" function when document is read for it.
  document.addEventListener('DOMContentLoaded', run);
}
