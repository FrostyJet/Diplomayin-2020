const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard;
let secondCard;
let count = 0;

(function shuffle() {
  cards.forEach(card => {
    let random = Math.floor(Math.random() * 12);
    card.style.order = random;
  });
})();

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  this.classList.add('flip');
  if (!hasFlippedCard) {
    // First Card
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
  // Second Card
  secondCard = this;
  checkForMatch();
  win();
}

function checkForMatch() {
  (firstCard.dataset.card === secondCard.dataset.card) ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
  count++;
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function win() {
  if (count === 10) {
    setTimeout(() => {
      $('.memory-game').hide();
      document.getElementById('youWin').style.display = 'block';
    }, 300);
  }
}

cards.forEach(card => card.addEventListener('click', flipCard));