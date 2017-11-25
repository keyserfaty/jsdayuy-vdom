(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _store = require('./store');

// 1. Crear el árbol de elementos
/**
 * { type: 'div', props: { className: 'danger' }, children: [] }
 * @param type
 * @param props
 * @param children
 */
var h = function h(type, props) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    type: type,
    props: props,
    children: children
  };
};

// 2. Crear función que tranforma este elemento en DOM elements
var isEventProp = function isEventProp(prop) {
  return (/^on/.test(prop)
  );
};

var extractName = function extractName(name) {
  return name.slice(2).toLowerCase();
};

var setProp = function setProp($el, name, value) {
  if (isEventProp(name)) {
    return;
  } else if (name === 'className') {
    $el.setAttribute('class', value);
  } else {
    $el.setAttribute(name, value);
  }
};

var setProps = function setProps($el, props) {
  Object.keys(props).forEach(function (prop) {
    return setProp($el, prop, props[prop]);
  });
};

var setEvent = function setEvent($el, name, value) {
  $el.addEventListener(extractName(name), value);
};

var setEvents = function setEvents($el, props) {
  Object.keys(props).forEach(function (prop) {
    return isEventProp(prop) ? setEvent($el, prop, props[prop]) : null;
  });
};

var createElement = function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  var $el = document.createElement(node.type);
  setProps($el, node.props);
  setEvents($el, node.props);

  node.children.map(function (child) {
    return createElement(child);
  }).forEach(function (childNode) {
    return $el.appendChild(childNode);
  });

  return $el;
};

// 3. Manejar cambios en los nodos.

var nodeChanged = function nodeChanged(node1, node2) {
  return (typeof node1 === 'undefined' ? 'undefined' : _typeof(node1)) !== (typeof node2 === 'undefined' ? 'undefined' : _typeof(node2)) || typeof node1 === 'string' && node1 !== node2 || node1.type !== !node2.type;
};

var updateElement = function updateElement($parent, newNode, oldNode) {
  var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  if (!oldNode) {
    $parent.appendChild(createElement(newNode));
  } else if (!newNode) {
    $parent.removeChild($parent.childNodes[index]);
  } else if (nodeChanged(newNode, oldNode)) {
    $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
  } else if (newNode.type) {
    var newLength = newNode.children.length;
    var oldLength = oldNode.childNodes.length;

    for (var i = 0; i < newLength || i < oldLength; i++) {
      updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
    }
  }
};

// 4. Agregar state para manejar cambios
var initialState = {
  text: 'This text should change'
};

var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case 'UPDATE_TEXT':
      {
        return _extends({}, state, {
          text: action.payload.text
        });
      }

    default:
      return state;
  }
};

var store = (0, _store.createStore)(reducer);

var updateText = function updateText(e) {
  store.dispatch({ type: 'UPDATE_TEXT', payload: { text: e.target.value } });
};

var element = function element(props) {
  return h('div', { className: 'container' }, h('input', { type: 'text', onKeyUp: updateText }), h('div', { className: 'text-container' }, props.text));
};

//** DOM
var $root = document.querySelector('#root');

var initialElement = element(store.getState());
updateElement($root, initialElement);

store.subscribe(function () {
  var nextElement = element(store.getState());
  updateElement($root, nextElement, initialElement);
});

},{"./store":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var createStore = exports.createStore = function createStoreFn(reducer) {
  var state = void 0;
  var subscribers = [];
  var store = {
    dispatch: function dispatch(action) {
      state = reducer(state, action);
      console.log(state, action);
      subscribers.forEach(function (handler) {
        return handler();
      });
    },
    getState: function getState() {
      return state;
    },
    subscribe: function subscribe(handler) {
      subscribers.push(handler);
      return function () {
        var index = subscribers.indexOf(handler);
        if (index > 0) {
          subscribers.splice(index, 1);
        }
      };
    }
  };
  store.dispatch({ type: '@@redux/INIT' });
  return store;
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL3N0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUE7O0FBRUE7QUFDQTs7Ozs7O0FBTUEsSUFBTSxJQUFJLFNBQUosQ0FBSSxDQUFDLElBQUQsRUFBTyxLQUFQO0FBQUEsb0NBQWlCLFFBQWpCO0FBQWlCLFlBQWpCO0FBQUE7O0FBQUEsU0FBK0I7QUFDdkMsY0FEdUM7QUFFdkMsZ0JBRnVDO0FBR3ZDO0FBSHVDLEdBQS9CO0FBQUEsQ0FBVjs7QUFNQTtBQUNBLElBQU0sY0FBYyxTQUFkLFdBQWM7QUFBQSxTQUNsQixPQUFNLElBQU4sQ0FBVyxJQUFYO0FBRGtCO0FBQUEsQ0FBcEI7O0FBR0EsSUFBTSxjQUFjLFNBQWQsV0FBYztBQUFBLFNBQ2xCLEtBQUssS0FBTCxDQUFXLENBQVgsRUFBYyxXQUFkLEVBRGtCO0FBQUEsQ0FBcEI7O0FBR0EsSUFBTSxVQUFVLFNBQVYsT0FBVSxDQUFDLEdBQUQsRUFBTSxJQUFOLEVBQVksS0FBWixFQUFzQjtBQUNwQyxNQUFJLFlBQVksSUFBWixDQUFKLEVBQXVCO0FBQ3JCO0FBQ0QsR0FGRCxNQUVPLElBQUksU0FBUyxXQUFiLEVBQTBCO0FBQy9CLFFBQUksWUFBSixDQUFpQixPQUFqQixFQUEwQixLQUExQjtBQUNELEdBRk0sTUFFQTtBQUNMLFFBQUksWUFBSixDQUFpQixJQUFqQixFQUF1QixLQUF2QjtBQUNEO0FBQ0YsQ0FSRDs7QUFVQSxJQUFNLFdBQVcsU0FBWCxRQUFXLENBQUMsR0FBRCxFQUFNLEtBQU4sRUFBZ0I7QUFDL0IsU0FBTyxJQUFQLENBQVksS0FBWixFQUNDLE9BREQsQ0FDUztBQUFBLFdBQVEsUUFBUSxHQUFSLEVBQWEsSUFBYixFQUFtQixNQUFNLElBQU4sQ0FBbkIsQ0FBUjtBQUFBLEdBRFQ7QUFFRCxDQUhEOztBQUtBLElBQU0sV0FBVyxTQUFYLFFBQVcsQ0FB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LGNBQVU7QUFBQSxhQUFNLEtBQU47QUFBQSxLQU5FO0FBT1osZUFBVyw0QkFBVztBQUNwQixrQkFBWSxJQUFaLENBQWlCLE9BQWpCO0FBQ0EsYUFBTyxZQUFNO0FBQ1gsWUFBTSxRQUFRLFlBQVksT0FBWixDQUFvQixPQUFwQixDQUFkO0FBQ0EsWUFBSSxRQUFRLENBQVosRUFBZTtBQUNiLHNCQUFZLE1BQVosQ0FBbUIsS0FBbkIsRUFBMEIsQ0FBMUI7QUFDRDtBQUNGLE9BTEQ7QUFNRDtBQWZXLEdBQWQ7QUFpQkEsUUFBTSxRQUFOLENBQWUsRUFBQyxNQUFNLGNBQVAsRUFBZjtBQUNBLFNBQU8sS0FBUDtBQUNELENBdEJNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7IGNyZWF0ZVN0b3JlIH0gZnJvbSAnLi9zdG9yZSdcblxuLy8gMS4gQ3JlYXIgZWwgw6FyYm9sIGRlIGVsZW1lbnRvc1xuLyoqXG4gKiB7IHR5cGU6ICdkaXYnLCBwcm9wczogeyBjbGFzc05hbWU6ICdkYW5nZXInIH0sIGNoaWxkcmVuOiBbXSB9XG4gKiBAcGFyYW0gdHlwZVxuICogQHBhcmFtIHByb3BzXG4gKiBAcGFyYW0gY2hpbGRyZW5cbiAqL1xuY29uc3QgaCA9ICh0eXBlLCBwcm9wcywgLi4uY2hpbGRyZW4pID0+ICh7XG4gIHR5cGUsXG4gIHByb3BzLFxuICBjaGlsZHJlblxufSlcblxuLy8gMi4gQ3JlYXIgZnVuY2nDs24gcXVlIHRyYW5mb3JtYSBlc3RlIGVsZW1lbnRvIGVuIERPTSBlbGVtZW50c1xuY29uc3QgaXNFdmVudFByb3AgPSBwcm9wID0+XG4gIC9eb24vLnRlc3QocHJvcClcblxuY29uc3QgZXh0cmFjdE5hbWUgPSBuYW1lID0+XG4gIG5hbWUuc2xpY2UoMikudG9Mb3dlckNhc2UoKVxuXG5jb25zdCBzZXRQcm9wID0gKCRlbCwgbmFtZSwgdmFsdWUpID0+IHtcbiAgaWYgKGlzRXZlbnRQcm9wKG5hbWUpKSB7XG4gICAgcmV0dXJuXG4gIH0gZWxzZSBpZiAobmFtZSA9PT0gJ2NsYXNzTmFtZScpIHtcbiAgICAkZWwuc2V0QXR0cmlidXRlKCdjbGFzcycsIHZhbHVlKVxuICB9IGVsc2Uge1xuICAgICRlbC5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpXG4gIH1cbn1cblxuY29uc3Qgc2V0UHJvcHMgPSAoJGVsLCBwcm9wcykgPT4ge1xuICBPYmplY3Qua2V5cyhwcm9wcylcbiAgLmZvckVhY2gocHJvcCA9PiBzZXRQcm9wKCRlbCwgcHJvcCwgcHJvcHNbcHJvcF0pKVxufVxuXG5jb25zdCBzZXRFdmVudCA9ICgkZWwsIG5hbWUsIHZhbHVlKSA9PiB7XG4gICRlbC5hZGRFdmVudExpc3RlbmVyKGV4dHJhY3ROYW1lKG5hbWUpLCB2YWx1ZSlcbn1cblxuY29uc3Qgc2V0RXZlbnRzID0gKCRlbCwgcHJvcHMpID0+IHtcbiAgT2JqZWN0LmtleXMocHJvcHMpXG4gICAgLmZvckVhY2gocHJvcCA9PiBpc0V2ZW50UHJvcChwcm9wKSA/IHNldEV2ZW50KCRlbCwgcHJvcCwgcHJvcHNbcHJvcF0pIDogbnVsbClcbn1cblxuY29uc3QgY3JlYXRlRWxlbWVudCA9IG5vZGUgPT4ge1xuICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5vZGUpXG4gIH1cblxuICBjb25zdCAkZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGUudHlwZSlcbiAgc2V0UHJvcHMoJGVsLCBub2RlLnByb3BzKVxuICBzZXRFdmVudHMoJGVsLCBub2RlLnByb3BzKVxuXG4gIG5vZGUuY2hpbGRyZW5cbiAgICAubWFwKGNoaWxkID0+IGNyZWF0ZUVsZW1lbnQoY2hpbGQpKVxuICAgIC5mb3JFYWNoKGNoaWxkTm9kZSA9PiAkZWwuYXBwZW5kQ2hpbGQoY2hpbGROb2RlKSlcblxuICByZXR1cm4gJGVsXG59XG5cbi8vIDMuIE1hbmVqYXIgY2FtYmlvcyBlbiBsb3Mgbm9kb3MuXG5cbmNvbnN0IG5vZGVDaGFuZ2VkID0gKG5vZGUxLCBub2RlMikgPT5cbiAgdHlwZW9mIG5vZGUxICE9PSB0eXBlb2Ygbm9kZTIgfHxcbiAgdHlwZW9mIG5vZGUxID09PSAnc3RyaW5nJyAmJiBub2RlMSAhPT0gbm9kZTIgfHxcbiAgbm9kZTEudHlwZSAhPT0gIW5vZGUyLnR5cGVcblxuY29uc3QgdXBkYXRlRWxlbWVudCA9ICgkcGFyZW50LCBuZXdOb2RlLCBvbGROb2RlLCBpbmRleCA9IDApID0+IHtcbiAgaWYgKCFvbGROb2RlKSB7XG4gICAgJHBhcmVudC5hcHBlbmRDaGlsZChjcmVhdGVFbGVtZW50KG5ld05vZGUpKVxuICB9IGVsc2UgaWYgKCFuZXdOb2RlKSB7XG4gICAgJHBhcmVudC5yZW1vdmVDaGlsZCgkcGFyZW50LmNoaWxkTm9kZXNbaW5kZXhdKVxuICB9IGVsc2UgaWYgKG5vZGVDaGFuZ2VkKG5ld05vZGUsIG9sZE5vZGUpKSB7XG4gICAgJHBhcmVudC5yZXBsYWNlQ2hpbGQoY3JlYXRlRWxlbWVudChuZXdOb2RlKSwgJHBhcmVudC5jaGlsZE5vZGVzW2luZGV4XSlcbiAgfSBlbHNlIGlmIChuZXdOb2RlLnR5cGUpIHtcbiAgICBjb25zdCBuZXdMZW5ndGggPSBuZXdOb2RlLmNoaWxkcmVuLmxlbmd0aFxuICAgIGNvbnN0IG9sZExlbmd0aCA9IG9sZE5vZGUuY2hpbGROb2Rlcy5sZW5ndGhcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3TGVuZ3RoIHx8IGkgPCBvbGRMZW5ndGg7IGkrKykge1xuICAgICAgdXBkYXRlRWxlbWVudCgkcGFyZW50LmNoaWxkTm9kZXNbaW5kZXhdLCBuZXdOb2RlLmNoaWxkcmVuW2ldLCBvbGROb2RlLmNoaWxkcmVuW2ldLCBpKVxuICAgIH1cbiAgfVxufVxuXG4vLyA0LiBBZ3JlZ2FyIHN0YXRlIHBhcmEgbWFuZWphciBjYW1iaW9zXG5jb25zdCBpbml0aWFsU3RhdGUgPSB7XG4gIHRleHQ6ICdUaGlzIHRleHQgc2hvdWxkIGNoYW5nZSdcbn1cblxuY29uc3QgcmVkdWNlciA9IChzdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlICdVUERBVEVfVEVYVCc6IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICB0ZXh0OiBhY3Rpb24ucGF5bG9hZC50ZXh0XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBzdGF0ZVxuICB9XG59XG5cbmNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUocmVkdWNlcilcblxuY29uc3QgdXBkYXRlVGV4dCA9IChlKSA9PiB7XG4gIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogJ1VQREFURV9URVhUJywgcGF5bG9hZDogeyB0ZXh0OiBlLnRhcmdldC52YWx1ZSB9IH0pXG59XG5cbmNvbnN0IGVsZW1lbnQgPSBwcm9wcyA9PiAoXG4gIGgoJ2RpdicsIHsgY2xhc3NOYW1lOiAnY29udGFpbmVyJyB9LFxuICAgIGgoJ2lucHV0JywgeyB0eXBlOiAndGV4dCcsIG9uS2V5VXA6IHVwZGF0ZVRleHQgfSksXG4gICAgaCgnZGl2JywgeyBjbGFzc05hbWU6ICd0ZXh0LWNvbnRhaW5lcicgfSwgcHJvcHMudGV4dClcbiAgKVxuKVxuXG4vLyoqIERPTVxuY29uc3QgJHJvb3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcm9vdCcpXG5cbmNvbnN0IGluaXRpYWxFbGVtZW50ID0gZWxlbWVudChzdG9yZS5nZXRTdGF0ZSgpKVxudXBkYXRlRWxlbWVudCgkcm9vdCwgaW5pdGlhbEVsZW1lbnQpXG5cbnN0b3JlLnN1YnNjcmliZSgoKSA9PiB7XG4gIGNvbnN0IG5leHRFbGVtZW50ID0gZWxlbWVudChzdG9yZS5nZXRTdGF0ZSgpKVxuICB1cGRhdGVFbGVtZW50KCRyb290LCBuZXh0RWxlbWVudCwgaW5pdGlhbEVsZW1lbnQpXG59KVxuIiwiZXhwb3J0IGNvbnN0IGNyZWF0ZVN0b3JlID0gZnVuY3Rpb24gY3JlYXRlU3RvcmVGbiAocmVkdWNlcikge1xuICBsZXQgc3RhdGVcbiAgY29uc3Qgc3Vic2NyaWJlcnMgPSBbXVxuICBjb25zdCBzdG9yZSA9IHtcbiAgICBkaXNwYXRjaDogYWN0aW9uID0+IHtcbiAgICAgIHN0YXRlID0gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKVxuICAgICAgY29uc29sZS5sb2coc3RhdGUsIGFjdGlvbilcbiAgICAgIHN1YnNjcmliZXJzLmZvckVhY2goaGFuZGxlciA9PiBoYW5kbGVyKCkpXG4gICAgfSxcbiAgICBnZXRTdGF0ZTogKCkgPT4gc3RhdGUsXG4gICAgc3Vic2NyaWJlOiBoYW5kbGVyID0+IHtcbiAgICAgIHN1YnNjcmliZXJzLnB1c2goaGFuZGxlcilcbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyKVxuICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgc3Vic2NyaWJlcnMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHN0b3JlLmRpc3BhdGNoKHt0eXBlOiAnQEByZWR1eC9JTklUJ30pXG4gIHJldHVybiBzdG9yZVxufSJdfQ==
