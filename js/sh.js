// create single global js var
(function() {

  // contains loaded syntax for the page
  var syntaxes = [];

  // Code dependancies on syntax being loaded
  var dependantHighlights = [];

  var originalCode = "";

  function addDependancy(elem, lang, code) {

    var syntax = syntaxes[lang]
    if (!syntax) {

      // this script isn't loaded yet, fetch it
      requestSyntax(lang);

      // add depend when the syntax is returned
      dependantHighlights.push({ elem:elem, lang: lang, code: code });

    } else if (syntax === 1) {
      // a request has been made for the syntax, add dependancy
      dependantHighlights.push({ elem:elem, lang: lang, code: code });
    } else {
      // the syntax is already loaded, press on
      highlight( elem, [ syntaxes[lang] ], code); 
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
    script.src = 'js/sh.syntax.' + lang + '.js';
    s.parentNode.insertBefore(script, s);

    var style  = document.createElement('link');
    style.rel  = 'stylesheet';
    style.type = 'text/css';
    style.href = 'css/hs.' + lang + '.css';
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
        highlight( dependancy.elem, [ syntaxes[dependancy.lang] ] , dependancy.code);

        // remove dependancy
        dependancy = null;

      }
    }
  }

  function highlight(elem, i_syntaxes, code) {

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
    var div_code = document.createElement('div');
    var div_lines = document.createElement('div');
    var div_thou = document.createElement('div');
    var div_hund = document.createElement('div');
    var div_tens = document.createElement('div');
    var div_ones = document.createElement('div');
    var pre_content = document.createElement('pre');

    div_code.className += listOfClasses;
    div_lines.className = 'lines';
    div_thou.className = 'thou';
    div_hund.className = 'hund';
    div_tens.className = 'tens';
    div_ones.className = 'ones';

    div_code.appendChild(div_lines);
    div_lines.appendChild(div_thou);
    div_lines.appendChild(div_hund);
    div_lines.appendChild(div_tens);
    div_lines.appendChild(div_ones);
    div_code.appendChild(pre_content);

    elem.parentNode.insertBefore(div_code, elem);
    elem.parentNode.removeChild(elem);

    if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { // TODO: fix dumb IE detection
      pre_content.outerHTML = '<pre class="content">' + code + '</pre>';
    } else {
      pre_content.className = 'content';
      pre_content.innerHTML = code;
    }
  }

  // module pattern | return public methods
  var _hs = {
    loadSyntax: function(lang) { requestSyntax(lang); },
    addSyntax: function(arg) { invokeSyntaxLoad(arg); },
    highlight: function(elem, lang, code) { addDependancy(elem, lang, code); }
  }
  window.hs = _hs;

})();

//if (parent.insertAdjacentElement){
//   parent.insertAdjacentElement('beforeEnd', child);
//}
//else if (parent.appendChild) {
//   parent.appendChild(child);
//}


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
