function $(e) {
  return document.querySelectorAll(e)[1] === undefined ? document.querySelector(e) : document.querySelectorAll(e)
}

Array.prototype.indexOf0 = function(a) {
  for(let i = 0; i < this.length; i++) {
    if (a == this[i][0]) {
      return i
    }
    return null
  }
}

Array.prototype.shuffle = function(array) {
  let currentIndex = array.length, temporaryValue, randomIndex
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

let cards = []
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
    el.innerHTML = '<span>' + this.numName + this.typeName[1] + '</span><div class="type">' + this.typeName[1] + '</div><span>' + this.numName + this.typeName[1] + '</span>'
    return el
  }
}

function initCards() {
  for (let i = 0; i <= 3; i++) {
    for (let j = 1; j <= 13; j++) {
      allCards.push(new Card(j,i))
    }
  }
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
  for (let i = 1; i < 7; i++) {
    let el = document.createElement("div")
    el.classList.add("stack")
    el.classList.add("stack_" + i)
    el.setAttribute("max", i)
    $('.stacks').appendChild(el)
  }

  for (let i = 0; i < $('.stack').length; i++) {
    let max = $('.stack')[i].getAttribute("max")

    for (let j = 0; j < max; j++) {
      let randNum = Math.floor(Math.random() * 12 + 1)
      let randType = Math.floor(Math.random() * 4)
      let card = new Card(randNum, randType)

      if (cards.indexOf0([randNum, randType]) == null) {
        cards.push([randNum, randType])
        $('.stack')[i].appendChild(card.element())
      } else {
        console.log(card)
        console.log("Exists already")
      }
      
    }

    $('.stack')[i].addEventListener("mouseup", function() {
      drop(this);
    })
  }
}

// Toggle flip

let selected

function initToggle() {
  const cardsEl = $(".card")
  
  for (let i = 0; i < cardsEl.length; i++) {
    cardsEl[i].addEventListener("mousedown", function() {
      selected = this
    })
  }
}

// Drag and drop

function initDragAndDrop() {
  document.body.addEventListener("mouseleave", function() {
    if (selected !== undefined) {
      selected.style.top = "auto"
      selected.style.left = "auto"
      selected = undefined
    }
  })

  document.addEventListener("mouseup", function() {
    selected = undefined
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
      drop(finish[i])
    })
  }
}

function drop(parent) {
  if (selected !== undefined) {
    let element = selected
    element.parentNode.removeChild(selected)
    selected = undefined

    parent.appendChild(element)

    element.style.top = "auto"
    element.style.left = "auto"
  }
}

function viewCanStack(current, card) {
  return (card.num == current.num + 1)
}

// Init

initStacks()
initToggle()
initDragAndDrop()

initCards()

console.table(allCards)