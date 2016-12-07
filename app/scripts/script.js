function $(e) {
  return document.querySelectorAll(e)[1] === undefined ? document.querySelector(e) : document.querySelectorAll(e);
}

Array.prototype.indexOf0 = function(a) {
  for(let i = 0; i < this.length; i++) {
    if (a == this[i][0]) {
      return i;
    }
    return null;
  };
}

let cards = [];

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
    let el = document.createElement("div");
    el.classList.add("stack");
    el.classList.add("stack_" + i);
    el.setAttribute("max", i);
    $('.stacks').appendChild(el);
  }

  for (let i = 0; i < $('.stack').length; i++) {
    let max = $('.stack')[i].getAttribute("max");

    for (let j = 0; j < max; j++) {
      let randNum = Math.floor(Math.random() * 12 + 1);
      let randType = Math.floor(Math.random() * 4);
      let card = new Card(randNum, randType);

      if (cards.indexOf0([randNum, randType]) == null) {
        cards.push([randNum, randType]);
        $('.stack')[i].appendChild(card.element());
      } else {
        console.log(card);
        console.log("Exists already");
      }
      
    }
  }
}

// Toggle flip

let selected;

function initToggle() {
  const cardsEl = $(".card");
  
  for (let i = 0; i < cardsEl.length; i++) {
    cardsEl[i].addEventListener("mousedown", function() {
      selected = this;
      this.classList.toggle("open");
    });
  }
}

// Drag and drop

function initDragAndDrop() {
  document.addEventListener("mouseup", function() {
    selected = undefined;
  });

  document.addEventListener("mousemove", function() {
    if (selected !== undefined) {
      selected.style.top = event.clientY - selected.offsetHeight / 2 + "px";
      selected.style.left = event.clientX - selected.offsetWidth / 2 + "px";
    }
  });

  const finish = $(".finish .empty");
  for (let i = 0; i < finish.length; i++) {
    finish[i].addEventListener("mouseup", function() {
      if (selected !== undefined && !finish[i].contains(selected)) {
        let element = selected;
        element.parentNode.removeChild(selected);
        selected = undefined;

        finish[i].appendChild(element);

        element.style.top = "auto";
        element.style.left = "auto";
        
        console.log(element);
      }
    });
  }
}

// Init

initStacks();
initToggle();
initDragAndDrop();