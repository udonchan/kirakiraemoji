"use strict";

const DEFAULT_DELAY_TIME = 5;
const DEFAULT_FRAME_NUM = 10

const TEMP_DIRECTRY_PREFIX = 'kirakira';
const temp = require('temp').track();
const fs   = require('fs');
const util  = require('util');
const path = require('path');
const im = require('imagemagick');
const returnTrue = function(){return true};
const phaseImageEffecter = require('./phaseImageEffecter');

let program = require('commander');
program.version('0.0.1');
program.usage('-i <input file> [options]');
program.option('-i, --input <path>', 'input file');
program.option('-o, --output <path>', 'output path');
program.option('-s, --saturation <percent value>', 'saturation value');
program.option('-p, --plain', 'Do NOT Kirakira effect', returnTrue, 0);
program.option('-r  --resize <geometry>', 'resize the image');
program.option('--colors <value>', 'preferred number of colors in the image', parseInt);
program.option('--delay <time>', 'delay time', parseInt);
program.option('--framenum <integer>', 'frame number', parseInt);
program.option('--guruguru', 'enable guruguru effect', returnTrue, 0);
program.option('--reverse', 'Invert the effect time', returnTrue, 0);
program.parse(process.argv);
let input = program.input;
const output = program.output !== undefined ? program.output : "out.gif";
const delay = program.delay !== undefined ? program.delay : DEFAULT_DELAY_TIME;
const frame_num  = program.frame_num !== undefined ? options.frame_num : DEFAULT_FRAME_NUM;

const doNothing = function(){};

const generateAnimatedGIF = function(filePaths){
    let imArgs = ['-dispose', 'Background',
                  '-delay', delay,
                  '-loop', '0'].concat(filePaths);
    imArgs.push(output.match(/\.gif$/) === null ? output + ".gif" : output);
        im.convert(imArgs, function(err, stdout){
            if(err){
                console.error(err);
                return;
            }
        });
};

const onAllocatedTempDirectory = function(err, dirPath) {
    if (err) {
        console.error(err);
        return;
    }
    const options = {
        reverse: program.reverse,
        frame_num: program.framenum,
        saturation: program.saturation,
        resize: program.resize,
        shining: program.plain === undefined,
        colors: program.colors,
        rotation: program.guruguru !== undefined
    };
    phaseImageEffecter.createFrames(input, dirPath, frame_num, options, generateAnimatedGIF);
};

module.exports = function(){
    if(input === undefined){
        console.error('input file is required');
        return;
    }
    // file exists?
    fs.open(input, 'r', function(err, fd){
        if(err){
            console.error(err);
            return;
        }
        // create temp working dir if file exists
        temp.mkdir(TEMP_DIRECTRY_PREFIX, onAllocatedTempDirectory);
        fs.close(fd);
    });
};
