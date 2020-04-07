const localStorageKey = '_tweeker_variant_data'
const url = window.location.href
const variantsUrl = `${process.env.API_ROOT}/v1/embed?url=` +
  encodeURIComponent(url) +
  `&business_id=${TweekerSettings.businessId}`
const pageViewsUrl = `${process.env.API_ROOT}/v1/page_views`

const getAllLocalData = () => (
  window.localStorage.getItem(localStorageKey)
)

const localData = () => {
  const json = getAllLocalData()
  const parsed = JSON.parse(json) || {}
  return parsed[url]
}

const run = () => {
  checkIfTweekerFrame()
  !!localData() ? useLocalData() : fetchVariants()
}

const checkIfTweekerFrame = () => {
  // This means the page is being run in an iframe,
  // Likely the tweeker editor, so don't run the script.
  if (window.location !== window.parent.location) { return; }
}

const saveLocally = (data) => {
  const newData = { [url]: data }
  const existing = getAllLocalData() || {}
  const json = JSON.stringify({ ...existing, ...newData })
  window.localStorage.setItem(localStorageKey, json)
}

const useLocalData = () => {
  bindVariants()
  bindGoals()
  registerPageView()
}

const fetchVariants = () => {
  return fetch(variantsUrl, {
    method: 'GET',
  }).then(response => response.json()).then(handleVariants)
}

const registerPageView = () => {
  return post(pageViewsUrl, pageViewParams())
}

const pageViewParams = () => {
  return {
    url,
    variant_ids: variantIdsParam()
  }
}

const variantIdsParam = () => {
  const variants = localData().variants
  return variants.map(variant => variant.id)
}

const handleVariants = (data) => {
  if (data.variants.length < 1) { return }
  saveLocally(data)
  bindVariants()
  bindGoals()
}

const bindVariants = () => {
  const variants = localData().variants

  variants.forEach(variant => {
    const element = document.querySelector(variant.selector);

    if (!!element) {
      element.textContent = variant.text;
    } else {
      console.warn(`Tweeker variant with the css selector ${variant.selector} not present on this page.`)
    }
  })
}

const bindGoals = () => {
  const goals = localData().goals

  goals.forEach(goal => {
    const element = document.querySelector(goal.selector)
    const eventType = (goal.category === 'form') ? 'submit' : 'click'

    if(!!element) {
      element.addEventListener(eventType, handleGoal)
      element.setAttribute('data-goal-id', goal.id)
    } else {
      console.warn(`Tweeker goal with the css selector ${goal.selector} not present on this page.`)
    }
  })
}

const handleGoal = (event) => {
  const url = process.env.API_ROOT + '/v1/successes';
  const target = event.target;
  event.target.removeEventListener('click', handleGoal)

  return post(url, successData(target))
}

const successData = (target) => {
  return {
    goal_id: target.getAttribute('data-goal-id'),
    variant_ids: variantIdsParam()
  }
}

const post = (url, data) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...data,
      business_id: TweekerSettings.businessId
    })
  })
}

if (/complete|interactive|loaded/.test(document.readyState)) {
  // In case DOMContentLoaded was already fired.
  run();
} else {
  // In case DOMContentLoaded was not yet fired,
  // use it to run the "start" function when document is read for it.
  document.addEventListener('DOMContentLoaded', run);
}
