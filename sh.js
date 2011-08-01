// create single global js var
(function() {

  // contains loaded syntax for the page
  var syntaxes = [];

  // Code dependancies on syntax being loaded
  var dependantHighlights = [];

  var originalCode = "";

  function addDependancy(lang, code) {

    var syntax = syntaxes[lang]
    if (!syntax) {

      // this script isn't loaded yet, fetch it
      requestSyntax(lang);

      // add depend when the syntax is returned
      dependantHighlights.push({ lang: lang, code: code });

    } else if (syntax === 1) {
      // a request has been made for the syntax, add dependancy
      dependantHighlights.push({ lang: lang, code: code });
    } else {
      // the syntax is already loaded, press on
      highlight( [ syntaxes[lang] ], code); 
    }

  }

  // load the JS and CSS 
  function requestSyntax(lang) {

    // adds something to the collection to prevent 
    syntaxes[lang] = 1;

    var s = document.getElementsByTagName('script')[0]; 

    var script = document.createElement('script'); 
    script.type = 'text/javascript'; 
    script.async = true;
    script.src = 'sh.syntax.' + lang + '.js';
    s.parentNode.insertBefore(script, s);

    var style  = document.createElement('link');
    style.rel  = 'stylesheet';
    style.type = 'text/css';
    style.href = 'hs.' + lang + '.css';
    style.media = 'all';
    s.parentNode.insertBefore(style, s);
  }

  // The external script has returned, highlight any code that needed it
  function invokeSyntaxLoad(arg) {
    
    // add new syntax
    syntaxes[arg.lang] = arg;

    // Highlight code that uses it
    var l = dependantHighlights.length;
    for(var i=0;i<l;i++) {
      var dependancy = dependantHighlights[i];
      if (dependancy && dependancy.lang === arg.lang) {
        
        // highlight code
        highlight( [ syntaxes[dependancy.lang] ] , dependancy.code);

        // remove dependancy
        dependancy = null;

      }
    }
  }

  function highlight(i_syntaxes, code) {

    var content = document.getElementById('content');

    // apply the regular expressions against the code
    var listOfClasses = '';

    // loop over syntaxes to apply to the code
    var l = i_syntaxes.length;
    for (var i = 0; i < l; i++) {

      var syntax = i_syntaxes[i];

      // combine langs into class list (sets up css)
      listOfClasses += ' ' + syntax.lang;

      // loop through language-specific regular expressions
      var le = syntax.expressions.length;
      for (var j = 0; j < le; j++) {

        var expression = syntax.expressions[j];

        // replace code with highlighted code
        code = code.replace(expression[0], expression[1]);

      }
    }

    // Update page content
    
    if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { // TODO: fix dumb IE detection
      content.outerHTML = '<pre class="content" id="content">' + code + '</pre>';
    } else {
      content.innerHTML = code;
    }
    document.getElementById('code').className += listOfClasses;
  }

  // module pattern | return public methods
  var _hs = {
    addSyntax: function(arg) { invokeSyntaxLoad(arg); },
    highlight: function(lang, code) { addDependancy(lang, code); },
//    getText: function() { return originalCode; }
  }
  window.hs = _hs;

})();


//  // Handle attaching events 
//  function _attachEvent(elem, type, handle) {
//    if (elem.addEventListener) {
//      elem.addEventListener(type, handle, false);
//    } else if (elem.attachEvent) {
//        elem.attachEvent("on" + type, handle);
//    }
//  }
//    _attachEvent(content, "keypress", function (e) {
//      if (e.keyCode==13) return false;
//    });
