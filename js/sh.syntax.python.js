(function() {

  /* Python syntax */

  hs.addSyntax({
    lang: 'python',
    expressions: [
        [/(^\s*#.*)?([><])/mg, function($0, $1) { return $1 ? $0 : $1.replace('>', '&gt;').replace('<', '&tl;') } ],
        [/^(\s*#.*)$/mg, '<span class=comment>$1</span>'],

        [/(\([^\)]*?|,\s*)([\w\d_]+)(\b\s*=[^=])/g, '$1<span class=param>$2</span>$3'],

        [/(?:("""[\s\S]*?"""|"[^"\n\r]*"|'[^'\n\r]*')|(\b\d+(?:\.\d*)?\b|\b(?:None|False|True|NotImplemented)\b))/g, function ($0, $1, $2) {
          return $1
            ? '<span class=string>' +
                $1.replace(/\d/g, function(c) { return '&#' + c.charCodeAt(0) + ';' })
                  .replace(/(\\[\\'"abfnNrtuUvx\d]\d*|%(?:\([\w\d#]+\))?\d*[%diouxXeEfFgGcrs])/g, function($0, $1) {
                    return '<span class=string-op>' + $1.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/%/g, '&#37;') + '</span>';
                  }).replace(/'/g, '&#39;').replace(/"/g, '&quot;') + '</span>'
            : '<span class=string-op>' + $2 + '</span>'
        } ],

        // operators
        [/(^\s*#.*)?(\b(?:Ellipsis|__debug__|and|as|assert|break|continue|del|elif|else|except|finally|for|from|global|if|import|in|is|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b|(?:%|\+|=|~|\/\/|\^|\||&gt;(?:&gt;|=)?|&lt;(?:&lt;|=)?|!=|-)|[\b\s]\*[\b\s])(?!([^<]+)?>)/mg, function ($0, $1, $2) {
            return $1 ? $0 : '<span class=keyword>' + $2 + '</span>'
        } ],

        // objects & STL
        [/(^\s*#.*)?\b(def|ValueError|Exception|__init__|lambda|class|abs|divmod|input|open|staticmethod|all|enumerate|int|ord|str|any|eval|isinstance|pow|sum|basestring|execfile|issubclass|print|super|bin|file|iter|property|tuple|bool|filter|len|range|type|bytearray|float|list|raw_input|unichr|callable|format|locals|reduce|unicode|chr|frozenset|long|reload|vars|classmethod|getattr|map|repr|xrange|cmp|globals|max|reversed|zip|compile|hasattr|memoryview|round|__import__|complex|hash|min|set|apply|delattr|help|next|setattr|buffer|dict|hex|object|slice|coerce|dir|id|oct|sorted|intern|apply|buffer|coerce|intern|quit|exit|copyright|credits|license)\b(?!([^<]+)?>)/mg, function ($0, $1, $2) {
            return $1 ? $0 : '<span class=type>' + $2 + '</span>' 
        } ]
    ]
  });

})(hs);