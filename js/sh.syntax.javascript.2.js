(function() {

  /* Javascript syntax */

  var specialCharacters = { r: /\\([bfnOrtv'"\\]|[dx]\d{2}|u\d{4})/g, c: "#AE81FF" };

  hs.addSyntax({
    lang: 'javascript',
    expressions: [
        // Comments
        { s: "//", e: "\n", c: "#75715E" },
        { s: "/*", e: "*/", c: "#75715E" },
        // Strings
        { s: '"', e: '"', c: "#E6DB74", i : [ specialCharacters ] },
        { s: "'", e: "'", c: "#E6DB74", i : [ specialCharacters ] }
    ]
  });

})(hs);