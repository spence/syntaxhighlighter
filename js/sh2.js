// create single global js var
(function() {

    // contains loaded syntax for the page
    var hs = {
        syntaxes: [],
        codes: [],
        windowLoaded: false,
        verion: 2
    }

    /**
     * 
     * @param {!Element} element Code block.
     * @param {!Array.<string>} langs Languages to use during highlighting
     */
    var addCode = function(element, syntaxes) {
        var code = {
            element: element,
            syntaxes: []
        };
        hs.codes.push(code);

        for (var i = 0; i < syntaxes.length; i++) {
            var lang = syntaxes[i];
            // Add dependancy
            var syntax = hs.syntaxes[lang];
            if (!syntax) {
                requestSyntax(lang, code)
            }
            code.syntaxes.push(syntax);
            syntax.codes.push(code);
        }
    };

    // load the JS and CSS 
    var requestSyntax = function(lang) {

        var syntax = hs.syntaxes[lang];
        if (!syntax) {

            // this script isn't loaded yet, fetch it

            // adds something to the collection to prevent 
            // duplicate loading
            hs.syntaxes[lang] = {
                loaded: false,
                codes: []
            };

            var escapedLang = escape(lang);

            var s = document.getElementsByTagName('script')[0]; 

            var script = document.createElement('script'); 
            script.type = 'text/javascript'; 
            script.async = true;
            script.src = 'js/sh.syntax.' + escapedLang + '.' + hs.verion + '.js';
            s.parentNode.insertBefore(script, s);

            var style  = document.createElement('link');
            style.rel  = 'stylesheet';
            style.type = 'text/css';
            style.href = 'css/hs.' + escapedLang + '.' + hs.verion + '.css';
            style.media = 'all';
            s.parentNode.insertBefore(style, s);

            console.log("Request syntax: " + lang);
        }
    };

    // The external script has returned, highlight any code that needed it
    var syntaxLoadCallback = function (arg) {

        console.log("Syntax returned: " + arg.lang);

        // Only if the syntax was requested
        var syntax = hs.syntaxes[arg.lang];
        if (syntax && syntax.codes) {
            
            // mark the syntax as loaded
            syntax.loaded = true;
            syntax.expressions = arg.expressions;

            // Highlight code that uses it
            for (var i = 0; i < syntax.codes.length; i++) {
                var code = syntax.codes[i];
                if (code.syntaxes.length) {
                    
                    var syntaxesLoaded = true;
                    for (var l = 0; l < code.syntaxes.length; l++) {
                        if (!code.syntaxes[l].loaded) {
                            syntaxesLoaded = false;
                            break;
                        }
                    }

                    if (syntaxesLoaded) {
                        highlight(code);
                    }
                }
            }
        }
    }

    var highlight = function(code) {
        code.element.style.border = '2px solid red';

        // Pull HTML from <pre>
        code.original_text = code.element.innerHTML;
        if (code.original_text) {

            code.original_text = unescapeHTML(code.original_text);

            // TODO: remove leading and trailing space
            // TODO: ?Remove HTML in code (dis/allows embedded HTML?)

            code.updated_text = processExpressions(code.original_text, code.syntaxes[0].expressions);
            if (code.original_text !== code.updated_text) {
                // Replace element's text
                code.element.innerHTML = code.updated_text
            }
        }

    };

    var processExpressions = function(text, expressions) {
        
        // TODO: replace whitespace++ with whitespace char: &nbsp;

        var updated_text = "";

        // iterate over text
        for (var i = 0, ilen = text.length; i < ilen;) {

            var text_matched = false;

            // iterate over expressions
            for (var j = 0, jlen = expressions.length; j < jlen; j++) {
                var expression = expressions[j];

                // find matches for expression
                var args;
                while ((args = mapExpressionMatches(text, i, ilen, expression, function(match) {
                    
                    console.log(expressions[j].s);

                    // recuse inner expressions
                    if (expression.i) {
                        match = processExpressions(match, expression.i);
                    } else {
                        match = escapeHTML(match);
                    }

                    // apply color
                    return applyColor(match, expression.c);

                }))) {
                    text_matched = true;
                    // increment text
                    updated_text += args[0];
                    i += args[1];
                }
            }

            // Iterate text by 1 character
            if (!text_matched) {
                updated_text += escapeHTML(text[i]);
                i++;
            }
        }

        return updated_text;
    };

    var escapeHTML = function(text) {
        // possibily use escape() or decodeURI() to generate
        // more likely, use RegExp
        return text;
    };

    var unescapeHTML = function(text) {
        return text;
    };

    var mapExpressionMatches = function(text, istart, iend, expression, fn) {

        if (expression.r) {
            
            // var myRe = /ab*/g;
            // var str = "abbcdefabh";
            // var myArray;
            // while ((myArray = myRe.exec(str)) != null) {
            //     var msg = "Found " + myArray[0] + ".  ";
            //     msg += "Next match starts at " + myRe.lastIndex;
            //     print(msg);
            // }

        } else if (expression.s) {
        
            // ensure expression end (defaults to new line)
            expression.e = expression.e || "\n";

            var slen = expression.s.length,
                elen = expression.e.length;
        
            // Ensure there is room for matching
            if (slen + elen < iend - istart) {

                // Locate start match
                if ((slen === 1 && text[istart] === expression.s) || 
                    (slen > 1 && text.substr(istart, slen) === expression.s)) {

                    // locate end match
                    for (var i = istart + slen + 1, ilen = iend - elen + 1; i < ilen; i++) {
                        if ((elen === 1 && text[i] === expression.e) ||
                            (elen > 1 && text.substr(i, elen) === expression.s)) {
                            return [
                                fn(text.substr(istart, i + elen)), 
                                istart + i + elen
                            ];
                        }
                    }
                }
            }
        }

        return null;
    };

    var applyColor = function(text, color) {
        return "<span style=\"color:" + color + "\">" + text + "</span>";
    };

    var init = function() {
        // find all <pre> with lang
        var elements = document.getElementsByTagName("pre");
        for (var i = 0, len = elements.length; i < len; i++) {
            var element = elements[i];

            // find languages
            var langStr = element.getAttribute("lang").toString();
            if (langStr) {

                // Request languages
                var langs = langStr.split(" ");
                for (var j = 0; j < langs.length; j++) {
                    requestSyntax(langs[j], element);
                }

                // Setup handlers for code block
                if (!element.sh && (hs.windowLoaded || elementIsDoneLoading(element))) {
                    // unique mark on DOM so element is not double processed
                    element.sh = true;
                    addCode(element, langs);   
                }
            }
        }
    };

    var runAfterLoad = function(fn) {
        var runOnce = function() {
            if (!hs.windowLoaded) {
                hs.windowLoaded = true;
                fn();
            }
        };
        if (document.readyState === "complete") {
            runOnce();
        } else if (window.addEventListener) {
            document.addEventListener("DOMContentLoaded", function(){ 
                console.log("runAfterLoad: DOMContentLoaded"); 
                document.removeEventListener("DOMContentLoaded", arguments.callee, false);
                runOnce(); 
            }, false);
            window.addEventListener("load", function(){ console.log("runAfterLoad: load"); runOnce(); }, false);
        } else if (window.attachEvent) {
            document.attachEvent("onreadystatechange", function(){ 
                if (document.readyState === "complete") {
                    // can be called multiple times
                    console.log("runAfterLoad: onreadystatechange"); 
                    document.detachEvent("onreadystatechange", arguments.callee);
                    runOnce(); 
                }
            });
            window.attachEvent("onload", function(){ console.log("runAfterLoad: onload"); runOnce(); });
            // http://javascript.nwbox.com/IEContentLoaded/
            (function () {
                if (!hs.windowLoaded) {
                    try {
                        window.document.documentElement.doScroll('left');
                        console.log("runAfterLoad: doScroll");
                        runOnce();
                    } catch (e) {
                        window.setTimeout(arguments.callee, 50);
                    }
                }
            })();
        } 
    };

    /**
     * Checks to see if the node is the last node on the page. If it is, 
     * then it might not have loaded fully yet.
     * @param {!Element} element Element to check.
     * @return {boolean}
     */
    var elementIsDoneLoading = function(element) {
        if (element.nextSibling) {
            return true;
        } else if (element.parentNode && element.parentNode.nodeType == 1) {
            // No sibling, check parent's siblings
            return elementIsDoneLoading(element.parentNode);
        } else {
            // Reached root or still loading
            // This element will be parsed later
            return false;
        }
    };

    // And again after load
    runAfterLoad(init);

    // Run now
    init();

    // setup subscriber method for syntax to call back into
    hs.addSyntax = function(arg) { syntaxLoadCallback(arg); };

    window.hs = hs;

})();