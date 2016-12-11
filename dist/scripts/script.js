'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* --------------------

   GENERAL FUNCTIONS   

-------------------- */

function $(e) {
  return document.querySelectorAll(e)[1] === undefined ? document.querySelector(e) : document.querySelectorAll(e);
}

Array.prototype.shuffle = function () {
  for (var i = this.length; i; i--) {
    var j = Math.floor(Math.random() * i);
    var _ref = [this[j], this[i - 1]];
    this[i - 1] = _ref[0];
    this[j] = _ref[1];
  }
};

/* --------------------

    GLOBAL VARIABLES

-------------------- */

var offsetX = 0;
var offsetY = 0;

/* --------------------

         CARDS

-------------------- */

var Card = function () {
  function Card(type, num) {
    _classCallCheck(this, Card);

    this.type = type;
    this.num = num;
  }

  _createClass(Card, [{
    key: '_typeToName',
    value: function _typeToName(type) {
      switch (type) {
        case 0:
          return ['Hearts', '♥', 'red'];
        case 1:
          return ['Clubs', '♣', 'black'];
        case 2:
          return ['Diamonds', '♦', 'red'];
        case 3:
          return ['Spades', '♠', 'black'];
        default:
          throw new Error('Card type \'' + type + '\' does not exist');
      }
    }
  }, {
    key: '_numToName',
    value: function _numToName(num) {
      if (num >= 1 && num <= 13) {
        switch (num) {
          case 1:
            return 'A';
          case 11:
            return 'J';
          case 12:
            return 'Q';
          case 13:
            return 'K';
          default:
            return num;
        }
      } else {
        throw new Error('Num \'' + this.num + '\' does not exist');
      }
    }
  }, {
    key: 'typeName',
    get: function get() {
      return this._typeToName(this.type);
    }
  }, {
    key: 'numName',
    get: function get() {
      return this._numToName(this.num);
    }
  }, {
    key: 'element',
    get: function get() {
      var el = document.createElement('div');
      el.classList.add('card', this.typeName[2]);

      var span = '<span>' + this.numName + ' ' + this.typeName[1] + '</span>';
      el.innerHTML = span + '<div class="type">' + this.typeName[1] + '</div>' + span;
      el.addEventListener("mousedown", function (e) {
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        if (this.parentNode.lastChild == this) {
          this.classList.add("open");
        }
        if (this.classList.contains("open")) {
          var sibling = this;
          while (sibling) {
            _addSelectedElement(sibling);
            sibling = sibling.nextElementSibling;
          }
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = selectedElements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _el = _step.value;

            _el.style.top = event.clientY - offsetY + "px";
            _el.style.left = event.clientX - offsetX + "px";
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      });
      return el;
    }
  }]);

  return Card;
}();

var Stack = function () {
  function Stack(cards) {
    _classCallCheck(this, Stack);

    this.cards = cards;
  }

  _createClass(Stack, [{
    key: 'allCards',
    get: function get() {
      console.log(this.cards);
      return this.cards;
    }
  }, {
    key: 'addCard',
    set: function set(card) {
      this.cards.push(card);
    }
  }, {
    key: 'removeCard',
    set: function set(card) {
      this.cards.splice(this.cards.indexOf(card), 1);
    }
  }]);

  return Stack;
}();

var FoundationStack = function (_Stack) {
  _inherits(FoundationStack, _Stack);

  function FoundationStack() {
    _classCallCheck(this, FoundationStack);

    return _possibleConstructorReturn(this, (FoundationStack.__proto__ || Object.getPrototypeOf(FoundationStack)).apply(this, arguments));
  }

  return FoundationStack;
}(Stack);

var TableauStack = function (_Stack2) {
  _inherits(TableauStack, _Stack2);

  function TableauStack() {
    _classCallCheck(this, TableauStack);

    return _possibleConstructorReturn(this, (TableauStack.__proto__ || Object.getPrototypeOf(TableauStack)).apply(this, arguments));
  }

  return TableauStack;
}(Stack);

var Board = function () {
  function Board() {
    _classCallCheck(this, Board);

    this.cards = [];
    this.stacks = {
      tableau: [],
      foundation: []
    };
    this.selected = [];

    // Create cards
    for (var i = 0; i < 4; i++) {
      for (var j = 1; j <= 13; j++) {
        this.cards.push(new Card(i, j));
      }
    }

    // Randomize cards
    this.cards.shuffle();

    // Tableau Stacks
    for (var _i = 0; _i < 7; _i++) {
      var cards = [];
      for (var _j = 1; _j <= _i + 1; _j++) {
        cards.push(this.cards[0]);
        this.cards.shift();
      }
      var stack = new TableauStack(cards);
      this.stacks.tableau.push(stack);
    }

    // Foundation Stacks
    for (var _i2 = 0; _i2 < 4; _i2++) {
      this.stacks.foundation.push(new FoundationStack());
    }
  }

  _createClass(Board, [{
    key: 'render',
    value: function render(stack) {
      var element = $(".stack" + String(stack.length));
      while (element.hasChildNodes()) {
        element.removeChild(element.lastChild);
      }
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = stack[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var card = _step2.value;

          element.appendChild(card.element);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }]);

  return Board;
}();

var board = new Board();

console.log(board);
for (var i = 0; i < $(".stack").length; i++) {
  board.render(board.stacks.tableau[i].cards);
}

/* --------------------

     DRAG AND DROP

-------------------- 

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

 --------------------

         INIT

-------------------- 

initDragAndDrop()
*/