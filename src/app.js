
// 1. Crear el árbol de elementos
/**
 * { type: 'div', props: { className: 'danger' }, children: [] }
 * @param type
 * @param props
 * @param children
 */
const h = (type, props, ...children) => ({
  type,
  props,
  children
})

const element =
  h('div', { className: 'danger' },
    h('div', { className:'danger-child', onClick: () => console.log('holi') }, 'some child with just text'),
    h('div', { className:'danger-child' }, 'other child with text')
  )

// 2. Crear función que tranforma este elemento en DOM elements
const isEventProp = prop =>
  /^on/.test(prop)

const extractName = name =>
  name.slice(2).toLowerCase()

const setProp = ($el, name, value) => {
  if (isEventProp(name)) {
    return
  } else if (name === 'className') {
    $el.setAttribute('class', value)
  } else {
    $el.setAttribute(name, value)
  }
}

const setProps = ($el, props) => {
  Object.keys(props)
  .forEach(prop => setProp($el, prop, props[prop]))
}

const setEvent = ($el, name, value) => {
  $el.addEventListener(extractName(name), value)
}

const setEvents = ($el, props) => {
  Object.keys(props)
    .forEach(prop => isEventProp(prop) ? setEvent($el, prop, props[prop]) : null)
}

const createElement = node => {
  if (typeof node === 'string') {
    return document.createTextNode(node)
  }

  const $el = document.createElement(node.type)
  setProps($el, node.props)
  setEvents($el, node.props)

  node.children
    .map(child => createElement(child))
    .forEach(childNode => $el.appendChild(childNode))

  return $el
}

const root = document.querySelector('#root')
root.appendChild(createElement(element))
