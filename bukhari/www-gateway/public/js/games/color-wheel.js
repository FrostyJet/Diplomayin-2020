$(function() {
  const levels = [
    {
      sounds: {
        cta: '/st/sounds/records/green-apple.mp3',
      },
      title: 'Գտիր կանաչ խնձորը',
      options: [
        { image: '/st/img/game-icons/apple-red.svg', isCorrect: false },
        { image: '/st/img/game-icons/apple-red.svg', isCorrect: false },
        { image: '/st/img/game-icons/apple-green.svg', isCorrect: true },
      ],
    },
    {
      sounds: {
        cta: '/st/sounds/records/blue-flower.mp3',
      },
      title: 'Գտիր կապույտ ծաղիկը',
      options: [
        { image: '/st/img/game-icons/rose-red.svg', isCorrect: false },
        { image: '/st/img/game-icons/rose-red.svg', isCorrect: false },
        { image: '/st/img/game-icons/rose-blue.svg', isCorrect: true },
      ],
    },
    {
      sounds: {
        cta: '/st/sounds/records/green-tree.mp3',
      },
      title: 'Գտիր կանաչ ծառը',
      options: [
        { image: '/st/img/game-icons/tree-orange.svg', isCorrect: false },
        { image: '/st/img/game-icons/tree-orange.svg', isCorrect: false },
        { image: '/st/img/game-icons/tree-green.svg', isCorrect: true },
      ],
    },
    {
      sounds: {
        cta: '/st/sounds/records/chocolate-cake.mp3',
      },
      title: 'Ո՞րն է շոկոլադե թխվածքը',
      options: [
        { image: '/st/img/game-icons/cake-purple.svg', isCorrect: false },
        { image: '/st/img/game-icons/cake-purple.svg', isCorrect: false },
        { image: '/st/img/game-icons/cake-brown.svg', isCorrect: true },
      ],
    },
    {
      sounds: {
        cta: '/st/sounds/records/blue-hair.mp3',
      },
      title: 'Այս աղջիկներից ո՞վ ունի կապույտ վարսեր',
      options: [
        { image: '/st/img/game-icons/girl-brown.svg', isCorrect: false },
        { image: '/st/img/game-icons/girl-brown.svg', isCorrect: false },
        { image: '/st/img/game-icons/girl-blue.svg', isCorrect: true },
      ],
    },
    {
      sounds: {
        cta: '/st/sounds/records/purple-hat.mp3',
      },
      title: 'Գտիր մանուշակագույն գլխարկը',
      options: [
        { image: '/st/img/game-icons/witch-hat-black.svg', isCorrect: false },
        { image: '/st/img/game-icons/witch-hat-black.svg', isCorrect: false },
        { image: '/st/img/game-icons/witch-hat-purple.svg', isCorrect: true },
      ],
    },
    {
      sounds: {
        cta: '/st/sounds/records/blue-sock.mp3',
      },
      title: 'Գտիր կապույտ գուլպան',
      options: [
        { image: '/st/img/game-icons/christmas-sock-red.svg', isCorrect: false },
        { image: '/st/img/game-icons/christmas-sock-red.svg', isCorrect: false },
        { image: '/st/img/game-icons/christmas-sock-blue.svg', isCorrect: true },
      ],
    },
    {
      sounds: {
        cta: '/st/sounds/records/black-mug.mp3',
      },
      title: 'Գտիր սև բաժակը',
      options: [
        { image: '/st/img/game-icons/mug-red.svg', isCorrect: false },
        { image: '/st/img/game-icons/mug-red.svg', isCorrect: false },
        { image: '/st/img/game-icons/mug-black.svg', isCorrect: true },
      ],
    },
    {
      sounds: {
        cta: '/st/sounds/records/pink-comb.mp3',
      },
      title: 'Գտիր վարդագույն սանրը',
      options: [
        { image: '/st/img/game-icons/comb-purple.svg', isCorrect: false },
        { image: '/st/img/game-icons/comb-purple.svg', isCorrect: false },
        { image: '/st/img/game-icons/comb-pink.svg', isCorrect: true },
      ],
    },
    {
      sounds: {
        cta: '/st/sounds/records/cyan-ring.mp3',
      },
      title: 'Գտիր երկնագույն մատանին',
      options: [
        { image: '/st/img/game-icons/ring-red.svg', isCorrect: false },
        { image: '/st/img/game-icons/ring-red.svg', isCorrect: false },
        { image: '/st/img/game-icons/ring-cyan.svg', isCorrect: true },
      ],
    },
  ];

  const Game = {
    index: 0,
    points: 0,
    session: null,
    refreshStats: function() {
      this.index = 0;
      this.points = 0;

      const shuffled = levels.sort(() => 0.5 - Math.random());
      this.session = shuffled.slice(0, 10);
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

      // Title pronounce
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