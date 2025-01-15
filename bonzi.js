class Bonzi {
  constructor(data) {
    this.id = data.id;
    this.color = data.color || 'purple';
    this.name = data.name;
    this.room = data.room;

    this.createElements();
    this.setupSprite();
    this.randomPosition();

    // Play intro animation
    this.sprite.gotoAndPlay('surf_intro');
  }

  createElements() {
    const html = `
      <div id='bonzi_${this.id}' class='bonzi'>
        <div class='bonzi_name'>
          <span class='bonzi_username'></span>
          <i class='typing' hidden>(typing)</i>
        </div>
        <div class='bonzi_placeholder'></div>
        <div style='display:none' class='bubble bubble-left'>
          <p class='bubble-content'></p>
        </div>
      </div>
    `;

    $('#content').append(html);

    this.$element = $(`#bonzi_${this.id}`);
    this.$canvas = this.$element.find('.bonzi_placeholder');
    this.$dialog = this.$element.find('.bubble');
    this.$dialogContent = this.$element.find('.bubble-content');
    this.$nametag = this.$element.find('.bonzi_username');
    
    this.$canvas.width(200).height(160);
    this.$nametag.text(this.name);

    // Make draggable
    this.$element.draggable({
      containment: 'parent',
      handle: '.bonzi_placeholder'
    });
  }

  setupSprite() {
    const spriteSheet = new createjs.SpriteSheet({
      images: [`/bonzi/${this.color}.png`],
      frames: {
        width: 200,
        height: 160
      },
      animations: {
        idle: 0,
        surf_intro: {
          frames: Array.from({length: 26}, (_, i) => i + 277),
          next: 'idle'
        },
        surf_away: {
          frames: Array.from({length: 23}, (_, i) => i + 16),
          next: 'gone'
        },
        gone: 39
      }
    });

    this.sprite = new createjs.Sprite(spriteSheet, 'idle');
    
    const stage = new createjs.Stage(this.$canvas[0]);
    stage.addChild(this.sprite);
    createjs.Ticker.framerate = 30;
    createjs.Ticker.addEventListener('tick', stage);
  }

  randomPosition() {
    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 160;
    
    this.$element.css({
      left: Math.random() * maxX + 'px',
      top: Math.random() * maxY + 'px'
    });
  }

  speak(text) {
    this.$dialogContent.text(text);
    this.$dialog.show();
    
    clearTimeout(this.hideDialogTimeout);
    this.hideDialogTimeout = setTimeout(() => {
      this.$dialog.fadeOut();
    }, text.length * 100 + 2000);
  }

  remove() {
    this.sprite.gotoAndPlay('surf_away');
    setTimeout(() => {
      this.$element.remove();
    }, 1000);
  }
}