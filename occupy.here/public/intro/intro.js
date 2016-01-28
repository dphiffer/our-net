var scroll = new Fx.Scroll(window);
var colors = ['#222222', '#410832', '#2C1F36', '#502C3E', '#5A0FA5', '#46008B'];
var stepNum = 0;
var currStep;

$(document).addEvent('domready', function() {
  document.body.setStyle('background-color', '#222');
  if ($('email')) {
  $('email').addEvent('submit', function(e) {
    e.stop();
    var email = $('email').getElement('input[name=email]').value;
    if (email) {
      $('email').set('html', 'Saving...');
      new Request({
        url: $('email').get('action'),
        onComplete: function() {
          $('email').set('html', 'Thanks! We’ve got it.');
          document.body.removeClass('form-visible');
          setTimeout(nextStep, 500);
        }
      }).post({
        email: email
      });
    }
  });
  }
  if (Cookie.read('has-seen-intro')) {
    document.body.addClass('has-seen-intro');
    return;
  }
  nextStep();
  var press = isTouchUI() ? 'touchend' : 'click';
  $(document).addEvent(press, function(e) {
    if (e.target.get('id') != 'skip') {
      nextStep();
    }
  });
  if ($('skip_email')) {
  $('skip_email').addEvent('click', function(e) {
    e.stop();
    document.body.removeClass('form-visible');
    $('email').set('html', '(If you change your mind later, just choose Intro from the Menu.)');
    nextStep();
  });
  }
  var down = isTouchUI() ? 'touchstart' : 'mousedown';
  document.addEvent(down, function(e) {
    if (currStep &&
        !currStep.getElement('form') &&
        e.target.get('id') != 'skip') {
      var tapColor = new Color(document.body.getStyle('background-color'));
      var brightness = tapColor.hsb[2];
      tapColor = tapColor.setBrightness(brightness + 25);
      document.body.setStyle('background-color', tapColor);
    }
  });
});

function nextStep() {
  currStep = null;
  if (document.body.hasClass('form-visible')) {
    return;
  }
  $$('.step').each(function(step) {
    if (!step.hasClass('visible') && !currStep) {
      currStep = step;
      step.fade('hide');
      step.addClass('visible');
      step.fade('in');
      if (step.getElement('form')) {
        document.body.addClass('form-visible');
      }
    } else if (step.hasClass('visible')) {
      step.fade(0.5);
    }
  });
  if (!currStep) {
    Cookie.write('has-seen-intro', '1', {
      duration: 365
    });
    window.location = '/forum';
  } else {
    setTimeout(function() {
      scroll.toBottom().chain(function() {
        if (currStep.getElement('form .cover')) {
          currStep.getElement('form .cover').destroy();
        }
      });
    }, 0);
    document.body.setStyle('background-color', colors[(stepNum - 1) % 5]);
    document.body.tween('background-color', colors[stepNum % 5]);
    if (!currStep.getElement('form')) {
      stepNum++;
    }
  }
}

function isTouchUI() {
  return !!('ontouchstart' in window)
         || !!('onmsgesturechange' in window);
}
