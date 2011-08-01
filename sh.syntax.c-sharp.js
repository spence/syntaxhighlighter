(function() {

  /* C# syntax */

  hs.addSyntax({
    lang: 'c-sharp',
    expressions: [
        [/\\([\\tnr\d'"abfvx])/mg, function($0, $1) { return '&#92;' + $1.replace('"', '&quot;').replace("'", '&#39;'); } ],
        [/("[^\r\n"]*)?(\/\/[^\r\n"]*(?:"|'|\/\*|\*\/).*)/g, function($0, $1, $2) { return $1 ? $0 : $2.replace(/"/g, '&quot;').replace(/'/g, '&#39;') } ],
        [/(^\s*\/\/.*)?>/mg, function($0, $1) { return $1 ? $0 : '&gt;' } ],
        [/(^\s*\/\/.*)?</mg, function($0, $1) { return $1 ? $0 : '&lt;<br>' } ],
        [/(\/\*[\s\S]*?\*\/)/mg, function($0, $1) { return '<span class=comment>' + $1.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/\//g, '&#47;') + '</span>' } ],
        [/("[^"]*"|'[^']*')/g, function($0, $1) { return '<span class=string>' + $1.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/\//g, '&#47;') + '</span>' } ],
        [/(\/\/.*)?((?:[\w\d_]+\.)*)([\w\d_]+)(\s*&lt;<br>[,\w\d\.\s;&<>]+&gt;)?(\s+[\w\d_]+\s*(?:(?:&lt;<br>[,\w\d\.\s;&<>]+&gt;)?\(|{))/mg, function($0, $1, $2, $3, $4, $5) { return $1 ? $0 : $2 + '<span class=type>' + $3 + '</span>' + ($4 ? $4 : '') + $5 } ],
        [/(\/\/.*)?((?:{|;|,|:|[\w\s]*?(?:\bclass\s|\benum\s|\bstruct\s)|^|(?:using|catch)\s+\()\s*)((?:[\w\d_]+\.)*)([\w\d_]+)(\s*(?:\s[\w_]|:|{|&lt;))/mg, function($0, $1, $2, $3, $4, $5) { return $1 ? $0 : $2 + $3 + '<span class=type>' + $4 + '</span>' + $5 } ],
        [/(\/\/.*)?((?:\s+|\()(?:as|is|new)\s+|(?:typeof\(|&lt;<br>|[=(]\s*\(|:)\s*)((?:[\w\d_]+\.)*)([\w\d_]+)(\s*(?:;|\)|\(|&lt;|&gt;|,|{))/mg, function($0, $1, $2, $3, $4, $5) { return $1 ? $0 : $2 + $3 + '<span class=type>' + $4 + '</span>' + $5 } ],
        [/(\/\/.*)?(\b|#)(region|endregion|abstract|as|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|goto|if|endif|implicit|in|int|interface|internal|is|lock|long|namespace|new|null|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|virtual|void|volatile|while|add|alias|ascending|descending|dynamic|from|get|global|group|into|join|let|orderby|partial|remove|select|set|value|var|where|yield)\b(?!([^<]+)?>)/mg, function($0, $1, $2, $3) { return $1 ? $0 : '<span class=keyword>' + $2 + $3 + '</span>' } ],
        [/(?:(\/{3})|(\/{2}))(\s*<\/?[^>\r\n]+>)?([^<\n\r]*)(<[^\n\r]+)?/mg,
            function($0, $1, $2, $3, $4, $5) {
              return ($1 ? '<span class=doc-comment>' + $1 + '</span>' : '<span class=comment>' + $2 + '</span>') +
                ($3 ? '<span class=doc-comment>' + $3.replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</span>' : '') +
                ($4 ? '<span class=comment>' + $4 + '</span>' : '') +
                ($5 ? '<span class=doc-comment>' + $5.replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</span>' : '');
            } ]
    ]
  });

})(hs);