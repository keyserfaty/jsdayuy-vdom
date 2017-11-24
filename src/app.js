import { createStore } from './store'

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

// 3. Manejar cambios en los nodos.

const nodeChanged = (node1, node2) =>
  typeof node1 !== typeof node2 ||
  typeof node1 === 'string' && node1 !== node2 ||
  node1.type !== !node2.type

const updateElement = ($parent, newNode, oldNode, index = 0) => {
  if (!oldNode) {
    $parent.appendChild(createElement(newNode))
  } else if (!newNode) {
    $parent.removeChild($parent.childNodes[index])
  } else if (nodeChanged(newNode, oldNode)) {
    $parent.replaceChild(createElement(newNode), $parent.childNodes[index])
  } else if (newNode.type) {
    const newLength = newNode.children.length
    const oldLength = oldNode.childNodes.length

    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i)
    }
  }
}

// 4. Agregar state para manejar cambios
const initialState = {
  text: 'This text should change'
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TEXT': {
      return {
        ...state,
        text: action.payload.text
      }
    }

    default:
      return state
  }
}

const store = createStore(reducer)

const updateText = () => {
  store.dispatch({ type: 'UPDATE_TEXT', payload: { text: 'Changed!' } })
}

const element = (props) =>
  h('div', { className: 'container' },
    h('button', { className: 'button', onClick: updateText }, 'Click me to update text'),
    h('div', { className: 'box' }, props.text)
  )

//** DOM
const $root = document.getElementById('root');

const initialElement = element(store.getState())
updateElement($root, initialElement)

store.subscribe(() => {
  const nextElement = element(store.getState())
  updateElement($root, nextElement, initialElement)
})
