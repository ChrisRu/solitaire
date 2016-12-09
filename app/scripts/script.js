
/* --------------------

   GENERAL FUNCTIONS   

-------------------- */

function $(e) {
  return document.querySelectorAll(e)[1] === undefined ? document.querySelector(e) : document.querySelectorAll(e)
}

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

/* --------------------

         CARDS

-------------------- */

let allCards = []

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

function initCards() {
  for (let i = 0; i <= 3; i++) {
    for (let j = 1; j <= 13; j++) {
      allCards.push(new Card(j,i))
    }
  }
  shuffle(allCards)
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
      console.log("sup");
      if (typeof selected[0] !== "undefined") {
        drop(this)
      }
    })
  }

  for (let card of allCards) {
    $(".full").appendChild(card.element)
  }
}

// Toggle flip

let selected = []
let offsetX = 0
let offsetY = 0

function setSelected(el) {
  el.classList.add("selected")
  selected.push(el)
}

function rmSelected() {
  if (typeof selected[0] !== undefined) {
    for (let el of selected) {
      el.classList.remove("selected")
    }
    selected = [];
  }
}

function initDraggable() {
  const cardsEl = $(".card")
  
  for (let i = 0; i < cardsEl.length; i++) {
    cardsEl[i].addEventListener("mousedown", function(e) {
      offsetX = e.offsetX
      offsetY = e.offsetY
      if (this.parentNode.lastChild == this) {
        this.classList.add("open");
      }
      if (this.classList.contains("open")) {
        let sibling = this
        while(sibling) {
          setSelected(sibling)
          sibling = sibling.nextElementSibling
        }
      }
      for (let el of selected) {
        el.style.top = event.clientY - offsetY + "px"
        el.style.left = event.clientX - offsetX + "px"
      }
    })
  }
}

// Drag and drop

function initDragAndDrop() {
  document.addEventListener("mouseup", function() {
    if (typeof selected[0] !== undefined) {
      for (let el of selected) {
        el.style.top = "auto"
        el.style.left = "auto"
      }
    }
    
    rmSelected();
  })

  document.addEventListener("mousemove", function() {
    if (typeof selected[0] !== undefined) {
      for (let el of selected) {
        el.style.top = event.clientY - offsetY + "px"
        el.style.left = event.clientX - offsetX + "px"
      }
    }
  })
  
  const foundations = $(".foundations");
  for (let el of foundations) {
    el.addEventListener("mouseup", function() {
      drop(this)
    })
  }

  const full = $(".full")
  full.addEventListener("click", function() {
    if (this.childNodes.length > 0) {
      // Move to view stack
      let current = this.lastChild
      this.removeChild(this.lastChild)
      current.classList.add("open")
      $(".view").appendChild(current)
    } else {
      // Reset full stack
      for (let card of $(".view .card")) {
        let current = card
        $(".view").removeChild(card)
        current.classList.remove("open")
        $(".full").insertBefore(current, $(".full").firstChild)
      }
    }
  })
}

function drop(parent) {
  if (typeof selected[0] !== undefined) {
    if (selected.length + parent.childNodes.length <= 13) {
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
  for (let el of selected) {
    let element = el
    el.parentNode.removeChild(el)

    parent.appendChild(element)

    element.style.top = "auto"
    element.style.left = "auto"
  }
  rmSelected()
}

function foundationCanStack(parent) {
  if (parent.childNodes.length === 0) {
    return (parseInt(selected[0].getAttribute("data-num")) === 1)
  }

  if (parent.childNodes.length > 1) {
    return false
  }

  if (parseInt(parent.lastChild.getAttribute("data-type")) === parseInt(selected[0].getAttribute("data-type"))) {
    const num1 = parseInt(parent.lastChild.getAttribute("data-num"))
    const num2 = parseInt(selected[0].getAttribute("data-num"))
    return (num1 + 1 === num2)
  }
}

function stacksCanStack(parent) {
  if (parent.childNodes.length === 0) {
    return (parseInt(selected[0].getAttribute("data-num")) === 13)
  }

  if (parseInt(parent.lastChild.getAttribute("data-num")) - 1 === parseInt(selected[0].getAttribute("data-num"))) {
    const type1 = parseInt(parent.lastChild.getAttribute("data-type")) % 2
    const type2 = parseInt(selected[0].getAttribute("data-type")) % 2
    return (type1 !== type2)
  }
}

// Init

initCards()
initStacks()
initDraggable()
initDragAndDrop()
