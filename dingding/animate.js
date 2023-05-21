const playgrounds = document.querySelectorAll(".playground")
const items = document.querySelectorAll('.list-item')
const lists = document.querySelector(".lists")
const icon = document.querySelector(".icon")

function createAnimation(scrollStart, scrollEnd, valueStart, valueEnd) {
  return function (scroll) {
    if (scroll <= scrollStart) {
      return valueStart
    }
    if (scroll >= scrollEnd) {
      return valueEnd
    }
    return valueStart + (valueEnd - valueStart) * ((scroll - scrollStart) / (scrollEnd - scrollStart))
  }
}

/*{
  opacity: function (scroll) {
    return '属性值'
  }
} */

const animationMap = new Map()

function getDomAnimation(scrollStart, scrollEnd, dom, wrapper) {
  const opacityAnimation = createAnimation(scrollStart, scrollEnd, 0, 1)
  const opacity = function (scroll) {
    return opacityAnimation(scroll)
  }

  const scaleAnimation = createAnimation(scrollStart, scrollEnd, 0.5, 1)
  const xAnimation = createAnimation(scrollStart, scrollEnd, wrapper.width / 2 - dom.offsetLeft - dom.clientWidth / 2, 0)
  const yAnimation = createAnimation(scrollStart, scrollEnd, wrapper.height / 2 - dom.offsetTop - dom.clientHeight / 2, 0)

  const transform = function (scroll) {
    return `translate(${xAnimation(scroll)}px, ${yAnimation(scroll)}px) scale(${scaleAnimation(scroll)})`
  }

  return {
    opacity,
    transform
  }
}

function getScroll(playground) {
  const rect = playground.getBoundingClientRect()
  const scrollStart = rect.top + window.scrollY
  const scrollEnd = rect.bottom + window.scrollY - window.innerHeight
  return {
    scrollStart,
    scrollEnd
  }
}

function updateMap() {
  animationMap.clear()
  const { scrollStart: iconScrollStart, scrollEnd: iconScrollEnd } = getScroll(playgrounds[0])
  animationMap.set(icon, getDomAnimation(iconScrollStart, iconScrollEnd, icon, icon.getBoundingClientRect()))

  const listsRect = lists.getBoundingClientRect()
  const { scrollStart: itemScrollStart, scrollEnd: itemScrollEnd } = getScroll(playgrounds[1])
  for (const item of items) {
    const scrollStart = itemScrollStart + item.dataset.order * 200;
    animationMap.set(item, getDomAnimation(scrollStart, itemScrollEnd, item, listsRect))
  }
}

updateMap()

function updateStyles() {
  const scroll = window.scrollY
  console.log(animationMap)
  for (let [dom, value] of animationMap) {
    for (const cssProp in value) {
      dom.style[cssProp] = value[cssProp](scroll)
    }
  }
}

updateStyles()

window.addEventListener('scroll', updateStyles)