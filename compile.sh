#!/usr/bin/env sh

./lint.sh && ./closure/bin/calcdeps.py -i public/js/hllwtml5.js -c compiler.jar -o compiled --output_file=public/js/hllwtml5.min.js
