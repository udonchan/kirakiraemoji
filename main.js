"use strict";

const DEFAULT_DELAY_TIME = 5;
const TEMP_DIRECTRY_PREFIX = 'kirakira';
const temp = require('temp').track();
const fs   = require('fs');
const util  = require('util');
const sprintf = require('sprintf').sprintf
const path = require('path');
const im = require('imagemagick');
const returnTrue = function(){return true};

let program = require('commander');
program.version('0.0.1');
program.usage('-i <input file> [options]');
program.option('-i, --input <path>', 'input file');
program.option('-o, --output <path>', 'output path');
program.option('-s, --saturation <percent value>]', 'saturation value');
program.option('-p, --plain', 'Do NOT Kirakira effect', returnTrue, 0);
program.option('-r  --resize <geometry?', 'resize the image');
program.option('--colors <value>', 'preferred number of colors in the image', parseInt);
program.option('--delay <time>', 'delay time', parseInt);
program.option('--framenum <integer>', 'frame number', parseInt);
program.option('--guruguru', 'enable guruguru effect', returnTrue, 0);
program.option('--reverse', 'Invert the effect time', returnTrue, 0);
program.parse(process.argv);
const input = program.input;
const output = program.output !== undefined ? program.output : "out.gif";
const delay = program.delay !== undefined ? program.delay : DEFAULT_DELAY_TIME;
const saturation = program.saturation !== undefined ? program.saturation : 100;
const frame_num = program.framenum !== undefined ? program.framenum : 10;

const doNothing = function(){};

const createFrames = function(dirPath, cb){
    let counter = 0;

    const filePaths = Array.apply(null, new Array(frame_num)).map(function(v, c){
        const filename = sprintf("%03d.gif", c);
        const filepath = path.join(dirPath, filename);
        return filepath;
    });

    const maybeFinished = function(){
        if(counter < frame_num){
            return;
        }
        cb(filePaths);
    };
    filePaths.forEach(function(outputPath, c){
        let imArgs = [input];
        const rotatenum = (program.reverse?-1:1) * Math.floor(c * 360 / frame_num);
        if(program.resize !== undefined){
            imArgs = imArgs.concat(['-resize', program.resize]);
        }
        if(!program.plain){
            imArgs = imArgs.concat(['-modulate', 
                                    ['100', saturation, rotatenum].join(',')]);
        }
        if(program.colors !== undefined){
            imArgs = imArgs.concat(['-colors', program.colors]);
        }
        if(program.guruguru !== undefined){
            imArgs = imArgs.concat(['-distort', 'SRT', rotatenum]);
        }
        imArgs.push(outputPath);
        im.convert(imArgs, function(err, stdout){
            if(err){
                console.log(stdout.trim());
                console.error(err);
                return;
            }
            counter++;
           maybeFinished();
        });
    });
};

const onAllocatedTempDirectory = function(err, dirPath) {
    if (err) {
        console.error(err);
        return;
    }
    createFrames(dirPath, function(filePaths){
        let imArgs = ['-dispose', 'Background',
                      '-delay', delay,
                      '-loop', '0'].concat(filePaths);
        imArgs.push(output)
        im.convert(imArgs, function(err, stdout){
            if(err){
                console.error(err);
                return;
            }
        });
    });
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
