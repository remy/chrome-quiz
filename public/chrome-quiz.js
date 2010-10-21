// Chrome test game
(function (window, document) {

var completed = false;

window.quiz = (function () {

var tasks = {},
    send = document.getElementById('send'),
    secretPass = (+new Date).toString(32).substr(3).toUpperCase();
    
tasks['1'] = function () {
  var h1 = document.querySelector('h1'),
      comp = document.defaultView.getComputedStyle(h1, null);

  (function checkfontsize(){
    if (comp['font-size'] == '18px') {
       showTask(2);
       return;
    }
    setTimeout(checkfontsize, 200);
  })();
};

tasks['2'] = function () {
  function handler(event) {
    document.removeEventListener('DOMCharacterDataModified', handler, true);
    document.removeEventListener('DOMNodeInserted', handler, true);
    showTask(3);
  }
  
  document.addEventListener('DOMCharacterDataModified', handler, true);
  document.addEventListener('DOMNodeInserted', handler, true);
};

tasks['3'] = function () {
  // should have been done this way
  window.__defineGetter__("secretPass", function() {
    // showTask(4);
    return secretPass;
  });
  
  function complete() {
    if (this.value == secretPass) {
      showTask(4);
      sp.removeEventListener('keyup', complete, false);
    }
  }
  
  var sp = document.getElementById('sp');
  sp.addEventListener('keyup', complete, false);
};

tasks['4'] = function () {
  var xhr = new XMLHttpRequest(),
      docsize = 0;

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      docsize = (this.responseText.length / 1024).toFixed(2);
    }
  };

  // really need to be sync? - I like to think so
  xhr.open("GET", window.location, false);
  xhr.send();
  
  function complete() {
    if (this.value == docsize) {
      showTask(5);
      taskvalue.removeEventListener('keyup', complete, false);
    }
  }
  
  taskvalue = document.getElementById('docsize');
  
  // not using the change event, because the input[type=number] 
  // doesn't increment by 0.10 - but rather integers :(
  taskvalue.addEventListener('keyup', complete, false);
};

tasks['5'] = function () {
  localStorage.setItem('unwanted', 'IE6');

  // should use window.addEventListener('storage', fn, false); - but it don't work properly

  (function checkstorage(){
    if (localStorage.getItem('unwanted') === null) {
       showTask(6);
       return;
    }
    setTimeout(checkstorage, 200);
  })();
};

tasks['6'] = function () {}; // not quite convinced I need this

function showTask(id) {
  if (tasks[id] !== undefined) {
    document.body.className += ' task' + id;
    tasks[id]();
    delete tasks[id];
    
    // last stage
    if (id == 6) {
      send.value = 'Go get your free gift!';
    } else if (id < 4) {
      send.value = 'Just ' + (6-id) + ' tasks to go...';
    } else if (id < 6) {
      send.value = 'Almost there, ' + (6-id) + ' left!';
    }
  }
}

showTask(1);

return function () {
  for (var key in tasks) {
    return false;
  }
  return true;
};

})();

[].forEach.call(document.querySelectorAll('input[data-next]'), function (input) {
  input.addEventListener('keydown', function (event) {
    if (event.which == 13) {
      var next = document.getElementById(this.getAttribute('data-next').substr(1));
      if (next.nodeName === 'INPUT') {
        next.focus();
      } else {
        window.location = '#' + next.id;
      }
      event.preventDefault();
    }
  }, false);
});

document.getElementById('quizForm').addEventListener('submit', function (event) {
  event.preventDefault();

  if (quiz()) {
    if (!completed) {
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          if (this.responseText == '1') {
            // it worked
            document.getElementById('code').innerHTML = secretPass;
            window.location = '#thankyou';
          } else {
            // something went wrong
            console.log('something went wrong...');
          }
        }
      };

      var ua = navigator.userAgent.match(/Chrome\/([\d\.]+)/);

      var params = [];
      params.push('name=' + encodeURIComponent(document.getElementById('name').value));
      params.push('code=' + secretPass.toUpperCase());
      params.push('datetime=' + encodeURIComponent(new Date));
      params.push('chrome=' + (ua === null ? 'false' : ua[1]));

      xhr.open("POST", '/save');
      xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
      xhr.send(params.join('&'));
      
      completed = true;      
    } else {
      window.location = '#thankyou';
    }
  } else {
    console.log('quiz not complete');
  }
}, false);  

})(this, document);
