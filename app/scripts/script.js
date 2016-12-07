
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

let Card = function (num, type) {
  this.num = num
  this.type = type
  this.numName = numToName(this.num)
  this.typeName = typeToName(this.type)
  this.element = function () {
    let el = document.createElement('div')
    el.classList.add('card')
    el.classList.add(this.typeName[2])
    el.innerHTML = '<span>' + this.numName + " " + this.typeName[1] + '</span><div class="type">' + this.typeName[1] + '</div><span>' + this.numName + " " + this.typeName[1] + '</span>'
    return el
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

function typeToName (type) {
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
      throw new Error('Card type "' + type + '" does not exist')
  }
}

function numToName (num) {
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
    throw new Error('Num "' + num + '" does not exist')
  }
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
      
      $('.stack')[i].appendChild(randomCard.element())
    }

    $('.stack')[i].addEventListener("mouseup", function() {
      drop(this);
    })
  }

  for (let i = 0; i < allCards.length; i++) {
    $(".full").appendChild(allCards[i].element())
  }
}

// Toggle flip

let selected

function setSelected(el) {
  selected = el
  selected.classList.add("selected")
}

function rmSelected() {
  selected.classList.remove("selected")
  selected = undefined
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
    if (selected !== undefined) {
      selected.style.top = "auto"
      selected.style.left = "auto"
      rmSelected()
    }
  })

  document.addEventListener("mouseup", function() {
    if (selected !== undefined) {
      rmSelected()
    }
  })

  document.addEventListener("mousemove", function() {
    if (selected !== undefined) {
      selected.style.top = event.clientY - selected.offsetHeight / 2 + "px"
      selected.style.left = event.clientX - selected.offsetWidth / 2 + "px"
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
  if (selected !== undefined) {
    selected.parentNode.removeChild(selected)
    let element = selected
    rmSelected()

    parent.appendChild(element)
    console.log(parent);
    console.log(element);

    element.style.top = "auto"
    element.style.left = "auto"
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
