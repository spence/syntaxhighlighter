(function() {

  /* Python syntax */

  hs.addSyntax({
    lang: 'python',
    syntax: [
        [/(^\s*#.*)?>/mg, function($0, $1) { return $1 ? $0 : '&gt;' } ],
        [/(^\s*#.*)?</mg, function($0, $1) { return $1 ? $0 : '&lt;' } ],
        [/^(\s*#.*)$/mg, '<span class=comment>$1</span>'],
        [/(\([^\)]*?|,\s*)([\w\d_]+)(\b\s*=)/g, '$1<span class=param>$2</span>$3'],
        [/(?:("""[\s\S]*?"""|"[^"\n\r]*"|'[^'\n\r]*')|(\d+(?:\.\d*)?))/g, function($0, $1, $2) {
          return $1
            ? '<span class=string>' +
                $1.replace(/\d/g, function(c) { return '&#' + c.charCodeAt(0) + ';' })
                  .replace(/(\\[\\'"abfnNrtuUvx\d]\d*|%(?:\([\w\d#]+\))?\d*[%diouxXeEfFgGcrs])/g, function($0, $1) {
                    return '<span class=string-op>' + $1.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/%/g, '&#37;') + '</span>';
                  }).replace(/'/g, '&#39;').replace(/"/g, '&quot;') + '</span>'
            : '<span class=string-op>' + $2 + '</span>'
        } ],
        [/(^\s*#.*)?(\b(?:print|False|None|True|and|as|assert|break|class|continue|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b|(?:%|\+|==|=|~|\/\/|\^|\||\*\*|\*|&gt;(?:&gt;|=)?|&lt;(?:&lt;|=)?|!=|-))(?!([^<]+)?>)/mg, function($0, $1, $2) { return $1 ? $0 : '<span class=keyword>' + $2 + '</span>' } ],
        [/(^\s*#.*)?\b(open|def|frozenset|ValueError|len|float|cmp|sum|int)\b(?!([^<]+)?>)/mg, function($0, $1, $2) { return $1 ? $0 : '<span class=type>' + $2 + '</span>' } ]
    ]
  });

})(hs);