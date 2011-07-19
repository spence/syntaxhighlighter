// create single global js var
(function() {

  // contains loaded syntax for the page
  var syntaxes = [];

  function _highlight(code) {

    // apply the regular expressions against the code
    var listOfClasses = '';
    while(syntaxes.length) {
      var s = syntaxes.pop();
      listOfClasses += ' ' + s.lang;
      var l = s.syntax.length;
      for(var i = 0; i < l; i++) {
        code = code.replace(s.syntax[i][0], s.syntax[i][1]);
      }
    }

    // Update page content
    var _content = document.getElementById('content');
    if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { // TODO: fix dumb IE detection
      _content.outerHTML = '<pre class="content" id="content">' + code + '</pre>';
    } else {
      _content.innerHTML = code;
    }
    document.getElementById('code').className += listOfClasses;
  }

  // module pattern | return public methods
  var _hs = {
    addSyntax: function(arg) { syntaxes.push(arg); },
    highlight: function(code) { _highlight(code); }
  }
  window.hs = _hs;

})();