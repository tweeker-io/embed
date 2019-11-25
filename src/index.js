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

const variantsUrl = `${process.env.API_ROOT}/v1/tests/embed?url=${encodeURIComponent(window.location.href)}&business_id=${TweekerSettings.businessId}`

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
    element.setAttribute('data-goal-id', goal.id)
  })
}

const handleGoal = (event) => {
  const url = process.env.API_ROOT + '/v1/successes';
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
    goal_id: target.getAttribute('data-goal-id'),
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
