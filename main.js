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
program.option('-l --label <string>', 'label string');
program.option('-o, --output <path>', 'output path');
program.option('-s, --saturation <percent value>', 'saturation value');
program.option('-p, --plain', 'Do NOT Kirakira effect', returnTrue, 0);
program.option('-r  --resize <geometry>', 'resize the image');
program.option('--colors <value>', 'preferred number of colors in the image', parseInt);
program.option('--delay <time>', 'delay time', parseInt);
program.option('--fill <color>', 'color to use when filling a charactors primitive');
program.option('--font <font_file>', 'font file for label');
program.option('--framenum <integer>', 'frame number', parseInt);
program.option('--guruguru', 'enable guruguru effect', returnTrue, 0);
program.option('--reverse', 'Invert the effect time', returnTrue, 0);
program.parse(process.argv);
let input = program.input;
const label = program.label;
const fill = program.fill;
const font = program.font;
const output = program.output !== undefined ? program.output : "out";
const delay = program.delay !== undefined ? program.delay : DEFAULT_DELAY_TIME;
const frame_num  = program.framenum !== undefined ? program.framenum : DEFAULT_FRAME_NUM;

const doNothing = function(){};

const generateAnimatedGIF = function(filePaths){
    const ext = filePaths.length > 1 ? 'gif' : 'png';
    let imArgs = ['-dispose', 'Background',
                  '-delay', delay,
                  '-loop', '0'].concat(filePaths);
    imArgs.push(output.match(new RegExp("\\." + ext + "$")) === null ? output + "." + ext : output);
    im.convert(imArgs, function(err, stdout){
        if(err){
            console.error(err);
            return;
        }
    });
};

const onCompleteValidInput = function(input, workingDir){
    const options = {
        reverse: program.reverse,
        frame_num: program.framenum,
        saturation: program.saturation,
        resize: program.resize,
        shining: program.plain === undefined,
        colors: program.colors,
        rotation: program.guruguru !== undefined
    };
    phaseImageEffecter.createFrames(input, workingDir, frame_num, options, generateAnimatedGIF);
};

const generateLayerImage = function(images, outputPath, cb){
    // TODO: generate label on input image
    cb(images[0]);
};

const random24bitHex = function(){
    return Math.floor(Math.random()*16777216).toString(16);
};

const generateLabelImage = function(label, outputPath, cb){
    var pathname = path.join(outputPath, 'label.png');
    let imArgs = font !== undefined ? ['-font', font] : [];
    imArgs = imArgs.concat(['-pointsize', '128',
                            '-fill', (fill !== undefined? fill : '#' + random24bitHex()),
                            '-background', 'none',
                            'label:' + label +'',
                            '-geometry', '128x128!',
                            pathname
    ]);
    im.convert(imArgs, function(err, stdout){
        if(err){
            console.error(err);
            return;
        }
        cb(pathname);
    });
};

const varidateInputFile = function(input_file, cb){
    // TODO: check valid image format
    fs.open(input_file, 'r', function(err, fd){
        if(err){
            console.error(err);
            return;
        }
        cb();
        fs.close(fd);
    });
};

const onAllocatedTempDirectory = function(err, tempDirPath) {
    if (err) {
        // fail allocate temp working dir
        console.error(err);
        return;
    }
    if(label !== undefined){
        // if label exists create label image
        generateLabelImage(label, tempDirPath, function(labelImage){
            if(input === undefined){
                onCompleteValidInput(labelImage, tempDirPath);
            } else {
                varidateInputFile(input, function(){
                    generateLayerImage([input, label], tempDirPath, function(path){
                        onCompleteValidInput(path, tempDirPath);
                    });
                });
            }
        });
    } else {
        varidateInputFile(input, function(){
            onCompleteValidInput(input, tempDirPath);
        });
    }
};

module.exports = function(){
    if(input === undefined && label === undefined){
        console.error('input file or label is required');
        return;
    }
    // create temp working dir
    temp.mkdir(TEMP_DIRECTRY_PREFIX, onAllocatedTempDirectory);
};
