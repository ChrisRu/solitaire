
/* --------------------

   GENERAL FUNCTIONS   

-------------------- */

function $(e) {
  return document.querySelectorAll(e)[1] === undefined ? document.querySelector(e) : document.querySelectorAll(e)
}

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
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
        return ['Diamonds', '♦', 'red']
      case 2:
        return ['Clubs', '♣', 'black']
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
  allCards = shuffle(allCards);
}


function initStacks() {
  for (let i = 1; i < 8; i++) {
    let el = document.createElement("div")
    el.classList.add("stack")
    el.classList.add("stack_" + i)
    el.setAttribute("data-max", i)
    $('.stacks').appendChild(el)
  }

  for (let i = 0; i < $('.stack').length; i++) {
    let max = $('.stack')[i].getAttribute("data-max")

    for (let j = 0; j < max; j++) {
      let randomCard = allCards[Math.floor(Math.random() * allCards.length)]
      allCards.shift(randomCard)
      
      $('.stack')[i].appendChild(randomCard.element)
    }

    $('.stack')[i].addEventListener("mouseup", function() {
      drop(this);
    })
  }

  for (let i = 0; i < allCards.length; i++) {
    $(".full").appendChild(allCards[i].element)
  }
}

// Toggle flip

let selected = []

function setSelected(el) {
  el.classList.add("selected")
  selected.push(el)
}

function rmSelected() {
  for (let el of selected) {
    el.classList.remove("selected")
  }
  selected = [];
}

function initDraggable() {
  const cardsEl = $(".card")
  
  for (let i = 0; i < cardsEl.length; i++) {
    cardsEl[i].addEventListener("mousedown", function() {
      setSelected(this)
    })
  }
}

// Drag and drop

function initDragAndDrop() {
  document.body.addEventListener("mouseleave", function() {
    if (selected[0]) {
      for (let el of selected) {
        el.style.top = "auto"
        el.style.left = "auto"
      }
      rmSelected()
    }
  })

  document.addEventListener("mouseup", function() {
    if (selected[0]) {
      rmSelected()
    }
  })

  document.addEventListener("mousemove", function() {
    
    if (selected[0]) {
      console.log('sup')
      for (let el of selected) {
        el.style.top = event.clientY - el.offsetHeight / 2 + "px"
        el.style.left = event.clientX - el.offsetWidth / 2 + "px"
      }
    }
  })
  
  const finish = $(".finish .empty");
  for (let i = 0; i < finish.length; i++) {
    finish[i].addEventListener("mouseup", function() {
      drop(this)
    })
  }
}

function drop(parent) {
  if (selected[0]) {
    for (let el of selected) {
      el.parentNode.removeChild(el)
      let element = el
      rmSelected()

      parent.appendChild(element)
      console.log(parent);
      console.log(element);

      element.style.top = "auto"
      element.style.left = "auto"
    }
    
  }
}

function viewCanStack(current, card) {
  return (card.num == current.num + 1)
}

// Init

initCards()
initStacks()
initDraggable()
initDragAndDrop()
