
/* --------------------

   GENERAL FUNCTIONS   

-------------------- */

function $(e) {
  return document.querySelectorAll(e)[1] === undefined ? document.querySelector(e) : document.querySelectorAll(e)
}

Array.prototype.shuffle = function() {
    for (let i = this.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [this[i - 1], this[j]] = [this[j], this[i - 1]]
    }
}

/* --------------------

    GLOBAL VARIABLES

-------------------- */

let allCards = []
let selectedElements = []
let offsetX = 0
let offsetY = 0

/* --------------------

         CARDS

-------------------- */

class Card {
  constructor(num, type) {
    this.num = num
    this.type = type
  }
  
  get numName() {
    return this._numToName(this.num)
  }

  get typeName() {
    return this._typeToName(this.type)
  }

  get element() {
    let el = document.createElement('div')
    el.classList.add('card')
    el.classList.add(this.typeName[2])
    el.setAttribute("data-num", this.num)
    el.setAttribute("data-type", this.type)
    const span = `<span>${this.numName} ${this.typeName[1]}</span>`
    el.innerHTML = `${span}<div class="type">${this.typeName[1]}</div>${span}`
    return el
  }

  _numToName(num) {
    if (num >= 1 && num <= 13) {
      switch (num) {
        case 1:
          return 'A'
        case 11:
          return 'J'
        case 12:
          return 'Q'
        case 13:
          return 'K'
        default:
          return num
      }
    } else {
      throw new Error(`Num '${this.num}' does not exist`)
    }
  }

  _typeToName(type) {
    switch (type) {
      case 0:
        return ['Hearts', '♥', 'red']
      case 1:
        return ['Clubs', '♣', 'black']
      case 2:
        return ['Diamonds', '♦', 'red']
      case 3:
        return ['Spades', '♠', 'black']
      default:
        throw new Error(`Card type '${type}' does not exist`)
    }
  }
}

function createCards() {
  for (let i = 0; i <= 3; i++) {
    for (let j = 1; j <= 13; j++) {
      allCards.push(new Card(j,i))
    }
  }
  allCards.shuffle();
}

function initStacks() {
  for (let i = 1; i < 8; i++) {
    let el = document.createElement("div")
    el.classList.add("stack")
    el.classList.add("stack_" + i)
    el.setAttribute("data-max", i)
    $('.stacks').appendChild(el)
  }

  for (let el of $(".stack")) {
    let max = el.getAttribute("data-max")

    for (let j = 0; j < max; j++) {
      let card = allCards[0]
      allCards.splice(0, 1)
      let newEl = card.element
      if (j == max - 1) {
        newEl.classList.add("open")
      }
      el.appendChild(newEl)
    }

    el.addEventListener("mouseup", function() {
      if (typeof selectedElements[0] !== "undefined") {
        onDrop(this)
      }
    })
  }

  for (let card of allCards) {
    $(".full").appendChild(card.element)
  }
}

/* --------------------

    HELPER FUNCTIONS

-------------------- */

function _addSelectedElement(el) {
  el.classList.add("selected")
  selectedElements.push(el)
}

function _rmSelectedElements() {
  if (typeof selectedElements[0] !== undefined) {
    for (let el of selectedElements) {
      el.classList.remove("selected")
    }
    selectedElements = []
  }
}

function _moveElement(element, toParent, toFront = false) {
  let element2 = element
  element.parentNode.removeChild(element)
  if (toFront) {
    toParent.insertBefore(element2, toParent.firstChild)
  } else {
    toParent.appendChild(element2)
  }
}

/* --------------------

     DRAG AND DROP

-------------------- */

function initDragAndDrop() {
  for (let cardsEl of $(".card")) {
    cardsEl.addEventListener("mousedown", function(e) {
      offsetX = e.offsetX
      offsetY = e.offsetY
      if (this.parentNode.lastChild == this) {
        this.classList.add("open")
      }
      if (this.classList.contains("open")) {
        let sibling = this
        while(sibling) {
          _addSelectedElement(sibling)
          sibling = sibling.nextElementSibling
        }
      }
      for (let el of selectedElements) {
        el.style.top = event.clientY - offsetY + "px"
        el.style.left = event.clientX - offsetX + "px"
      }
    })
  }

  document.addEventListener("dblclick", autoMove)

  document.addEventListener("mouseup", function() {
    if (typeof selectedElements[0] !== undefined) {
      for (let el of selectedElements) {
        el.style.top = "auto"
        el.style.left = "auto"
      }
    }
    _rmSelectedElements()
  })

  document.addEventListener("mousemove", function() {
    if (typeof selectedElements[0] !== undefined) {
      for (let el of selectedElements) {
        el.style.top = event.clientY - offsetY + "px"
        el.style.left = event.clientX - offsetX + "px"
      }
    }
  })
  
  for (let el of $(".foundations")) {
    el.addEventListener("mouseup", function() {
      onDrop(this)
    })
  }

  $(".full").addEventListener("click", function() {
    if (this.childNodes.length > 0) {
      this.lastChild.classList.add("open")
      _moveElement(this.lastChild, $(".view"))
    } else {
      for (let card of $(".view .card")) {
        card.classList.remove("open")
        _moveElement(card, $(".full"), true)
      }
    }
  })
}

function onDrop(parent) {
  if (typeof selectedElements[0] !== undefined) {
    if (selectedElements.length + parent.childNodes.length <= 13) {
      if (parent.classList.contains("foundations")) {
        if (foundationCanStack(parent)) {
          allowDrop(parent)
        }
      }
      if (parent.classList.contains("stack")) {
        if (stacksCanStack(parent)) {
          allowDrop(parent)
        }
      }
    }
  }
}

function allowDrop(parent) {
  for (let el of selectedElements) {
    let element = el
    el.parentNode.removeChild(el)

    parent.appendChild(element)

    element.style.top = "auto"
    element.style.left = "auto"
  }
  _rmSelectedElements()
}

function foundationCanStack(parent) {
  if (parent.childNodes.length === 0) {
    return (parseInt(selectedElements[0].getAttribute("data-num")) === 1)
  }

  if (selectedElements.length > 1) {
    return false
  }

  if (parseInt(parent.lastChild.getAttribute("data-type")) === parseInt(selectedElements[0].getAttribute("data-type"))) {
    const num1 = parseInt(parent.lastChild.getAttribute("data-num"))
    const num2 = parseInt(selectedElements[0].getAttribute("data-num"))
    return (num1 + 1 === num2)
  }
}

function stacksCanStack(parent) {
  if (parent.childNodes.length === 0) {
    return (parseInt(selectedElements[0].getAttribute("data-num")) === 13)
  }

  if (parseInt(parent.lastChild.getAttribute("data-num")) - 1 === parseInt(selectedElements[0].getAttribute("data-num"))) {
    const type1 = parseInt(parent.lastChild.getAttribute("data-type")) % 2
    const type2 = parseInt(selectedElements[0].getAttribute("data-type")) % 2
    return (type1 !== type2)
  }
}

function autoMove() {
  for (let stack of $('.stack')) {
    for (let foundation of $(".foundations")) {
      if (stack.childNodes.length > 0) {
        if (foundation.childNodes.length > 0) {
          if (stack.lastChild.getAttribute("data-type") === foundation.lastChild.getAttribute("data-type")) {
            if (parseInt(stack.lastChild.getAttribute("data-num")) === parseInt(foundation.lastChild.getAttribute("data-num")) + 1) {
              _moveElement(stack.lastChild, foundation)
            }
          }
        } else {
          if (stack.lastChild.getAttribute("data-num") == 1) {
            _moveElement(stack.lastChild, foundation)
          }
        }
      }
    }
  }
}

/* --------------------

         INIT

-------------------- */

createCards()
initStacks()
initDragAndDrop()
