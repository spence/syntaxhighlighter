setTimeout(function() { hs.highlight('#!/usr/bin/env python\n' +
'# This program adds up integers in the command line\n' +
'import sys\n' +
'try:\n' +
'    total = sum(int(arg) for arg in sys.argv[1:])\n' +
'    print \'sum =\', total\n' +
'except ValueError:\n' +
'    print \'Please supply integer arguments\'\n'); }, 0);