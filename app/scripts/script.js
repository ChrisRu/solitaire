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
  if (num >= 0 && num <= 13) {
    switch (num) {
      case 0:
        return 'A'
      case 11:
        return 'B'
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

let cards = [new Card(4, 1), new Card(1, 2), new Card(5, 0), new Card(11, 3)]
for (let card of cards) {
  document.getElementsByClassName('stacks')[0].appendChild(card.element())
}

// const full = document.getElementsByClassName('full')[0]


/*

=============================================================================
=============================================================================
=============================================================================
=============================================================================
=============================================================================

*/

const cardsEl = document.getElementsByClassName("card");
let selected;
let interval;

for (let i = 0; i < cardsEl.length; i++) {
  cardsEl[i].addEventListener("mousedown", function() {
    selected = this;
  });
}

document.addEventListener("mouseup", function() {
  selected = undefined;
});

document.addEventListener("mousemove", function() {
  if (selected !== undefined) {
    selected.style.top = event.clientY - selected.offsetHeight / 2 + "px";
    selected.style.left = event.clientX - selected.offsetWidth / 2 + "px";
  }
});