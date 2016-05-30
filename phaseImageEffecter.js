"use strict";

const path = require('path');
const sprintf = require('sprintf').sprintf;
const im = require('imagemagick');

const addColors = function(args, colors){
    return colors !== undefined ? args.concat(['-colors', colors]) : args;
};
const addDistort = function(args, type, value){
    return type !== undefined && value !== undefined ?
                                           args.concat(['-distort', type, value]) : args;
};
const addModulate = function(args, modulate){
    return modulate !== undefined ? args.concat(['-modulate', modulate]) : args;
};
const addResize = function(args, resize){
    return resize !== undefined ? args.concat(['-resize', resize]) : args;
};

const parseOptions = function(options, phase){
    const rotatenum = (options.reverse ? -1 : 1) * phase;
    const saturation = options.saturation !== undefined ? options.saturation : 100;

    let imArgs = [];

    if(options.shining === true){
        imArgs = addModulate(imArgs, ['100', saturation, rotatenum].join(','));
    }
    if(options.rotation === true){
        imArgs = addDistort(imArgs, 'SRT', rotatenum);
    }
    imArgs = addResize(imArgs, options.resize);
    imArgs = addColors(imArgs, options.colors);

    return imArgs;
};

const createFrames = function(input, outputDirPath, frame_num, options, cb){
    let file_completed_counter = 0;

    const maybeFinished = function(){
        if(file_completed_counter < frame_num){
            // in case of no completed all
            return;
        }
        cb(filePaths);
    };

    const imExecCb = function(err, stdout){
        if(err){
            console.log(stdout.trim());
            console.error(err);
            return;
        }
        file_completed_counter++;
        maybeFinished();
    };
    
    const filePaths = Array.apply(null, new Array(frame_num)).map(function(v, c){
        const filename = sprintf("%03d.gif", c);
        const filepath = path.join(outputDirPath, filename);
        return filepath;
    });

    filePaths.forEach(function(outputPath, c){
        const phase = Math.floor(c * 360 / frame_num);
        const imArgs = parseOptions(options, phase).concat([input, outputPath]);
        im.convert(imArgs, imExecCb);
    });
};

module.exports.createFrames = createFrames;
