$(function() {

  const animals = [
    { id: 'cat', image: '/st/img/game-icons/cat.svg', sound: '/st/sounds/cat.mp3' },
    { id: 'dog', image: '/st/img/game-icons/dog.svg', sound: '/st/sounds/dog.mp3' },
    { id: 'dolphin', image: '/st/img/game-icons/dolphin.svg', sound: '/st/sounds/dolphin.mp3' },
    { id: 'elephant', image: '/st/img/game-icons/elephant.svg', sound: '/st/sounds/elephant.mp3' },
    { id: 'hen', image: '/st/img/game-icons/hen.svg', sound: '/st/sounds/hen.mp3' },
    { id: 'horse', image: '/st/img/game-icons/horse.svg', sound: '/st/sounds/horse.mp3' },
    { id: 'lion', image: '/st/img/game-icons/lion.svg', sound: '/st/sounds/lion.mp3' },
    { id: 'monkey', image: '/st/img/game-icons/monkey.svg', sound: '/st/sounds/monkey.mp3' },
    { id: 'parrot', image: '/st/img/game-icons/parrot.svg', sound: '/st/sounds/parrot.mp3' },
    { id: 'pig', image: '/st/img/game-icons/pig.svg', sound: '/st/sounds/pig.mp3' },
    { id: 'cow', image: '/st/img/game-icons/cow.svg', sound: '/st/sounds/cow.mp3' },
    { id: 'sheep', image: '/st/img/game-icons/sheep.svg', sound: '/st/sounds/sheep.mp3' },
    { id: 'tiger', image: '/st/img/game-icons/tiger.svg', sound: '/st/sounds/tiger.mp3' },
  ];

  const levels = [];

  const Game = {
    index: 0,
    points: 0,
    session: null,
    refreshStats: function() {
      this.index = 0;
      this.points = 0;

      const shuffled = animals.sort(() => 0.5 - Math.random());
      const _animals = shuffled.slice(0, 10);

      const session = [];
      _animals.forEach(animal => {
        const obj = {
          sounds: {
            cta: animal.sound,
          },
          title: 'Ո՞ր կենդանին է սա',
          options: [
            { isCorrect: true, ...animal },
          ],
        };

        const __animals = _animals.filter(item => item.id != animal.id);
        const alternative = __animals[Math.floor(Math.random() * __animals.length)];

        obj.options.push({ isCorrect: false, ...alternative });

        session.push(obj);
      });

      this.session = session;
    },
    setupLevel: function() {
      const _this = this;
      const level = this.session[this.index];
      if (!level) return _this.displayFinish();
      const snd = new Audio(level.sounds.cta);

      $('#game').fadeIn();

      $('.title h4').html(level.title);

      $('#game content').fadeOut();

      // Display Choices
      $('.choices').empty();
      level.options.sort(() => 0.5 - Math.random()).forEach(option => {
        let cls = `choice p-6 border-4 cursor-pointer hover:bg-yellow-100 border-black rounded-lg`;
        if (option.isCorrect) cls += ' rt';

        const elm = $(`<li class="${cls}" />`);
        elm.append(`<img src="${option.image}" />`);

        $('.choices').append(elm);
      });

      $('#game content').fadeIn();

      $('.cta button').off('click').on('click', function() {
        snd.pause();
        snd.currentTime = 0;
        snd.play();
      });

      $('.cta button').trigger('click');

      // Choice clicks
      $('.choice').click(function() {
        if ($(this).hasClass('rt')) {
          SOUNDS.answerCorrect.play();
          _this.points++;
        } else {
          SOUNDS.answerIncorrect.play();
        }

        _this.index++;
        _this.setupLevel();
      });

      $('#currentPoints').html(this.points);
      $('#currentStep').html(this.index);
    },
    displayFinish: function() {
      const _this = this;

      $('#game').fadeOut(300, function() {
        // Display Result Layout
        if (_this.points >= 1) {
          $('#game-final h4').html(`Կեցցե՛ս, դու հավաքեցիր ${_this.points}/10 միավոր`);

          const randomImage = WIN_IMAGES[Math.floor(Math.random() * WIN_IMAGES.length)];
          $('#game-final img').attr('src', randomImage);
        } else {
          $('#game-final h4').html('Ոչինչ, կրկին փորձի՛ր։ Այս անգամ հաստատ կստացվի');

          const randomImage = LOSE_IMAGES[Math.floor(Math.random() * LOSE_IMAGES.length)];
          $('#game-final img').attr('src', randomImage);
        }

        $('#game-final').fadeIn();

        // Replay button click
        $('#game-final button').off('click').click(function() {
          _this.refreshStats();

          $('#game-final').fadeOut(300, function() {
            _this.setupLevel();
          });
        });
      });
    },
  };

  $(document).ready(function() {

    Game.refreshStats();

    $('#game-intro button').click(function() {
      $('#game-intro').hide();
      $('main').removeClass('bg-white');

      Game.setupLevel();
    });
  });
});