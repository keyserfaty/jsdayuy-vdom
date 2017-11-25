
// Crea los elementos
const $input = document.createElement('input')
$input.setAttribute('type', 'text')
$input.setAttribute('value', '')

const $textContainer = document.createElement('div')
$textContainer.setAttribute('class', 'text-container')

const $container = document.createElement('div')
$container.setAttribute('class', 'container')
$container.appendChild($input)
$container.appendChild($textContainer)

// Appendea eventos al input
$input.addEventListener('keyup', function (e) {
  const text = e.target.value
  const $textNode = document.createTextNode(text)
  const $oldTextNode = $textContainer.childNodes[0]

  if (!$oldTextNode) {
    $textContainer.appendChild($textNode)
  } else {
    $textContainer.replaceChild($textNode, $oldTextNode)
  }
}, true)

const $root = document.querySelector('#root')
$root.appendChild($container)

