"use strict";

const DEFAULT_DELAY_TIME = 5;
const TEMP_DIRECTRY_PREFIX = 'kirakira';
const temp = require('temp').track();
const fs   = require('fs');
const util  = require('util');
const sprintf = require('sprintf').sprintf
const path = require('path');
const exec = require('child_process').exec;
const gm = require('gm');

let program = require('commander').version('0.0.1')
    .option('-i, --input [path]', 'input file')
    .option('-o, --output [path]', 'output path')
    .option('-d, --delay [time]', 'delay time')
    .parse(process.argv);
const input = program.input;
const output = program.output !== undefined ? program.output : "out.gif";
const delay = program.delay !== undefined ? program.delay : DEFAULT_DELAY_TIME;

const doNothing = function(){};

const createFrames = function(dirPath, cb){
    const frame_num = 10;
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
        const cb = function (err) {
            if(err){
                console.error(err);
                return;
            }
            counter++;
            maybeFinished();
        };
        if(c == 0){
            // convert gif format only if initial frame
            gm(input).write(outputPath, cb);
        } else {
            // change hue value in another frame
            gm(input).modulate(100, 100, Math.floor(c * 360 / (frame_num - 1)))
                .write(outputPath, cb);
        }
    });
};

const onAllocatedTempDirectory = function(err, dirPath) {
    if (err) {
        console.error(err);
        return;
    }
    createFrames(dirPath, function(filePaths){
        let myGm = gm().delay(DEFAULT_DELAY_TIME).loop('0');
        filePaths.forEach(function(path){
            myGm.in(path);
        });
        myGm.write(output, function(err){
            if(err){
                console.log(err);
            }
        })
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
