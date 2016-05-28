# kirakiraemoji

This program is a Kirakira Animated GIF generaor. It is dependent on the ImageMagick.

## Usage

First download and install ImageMagick. In Mac OS X, you can simply use Homebrew or MacPorts. Then clone this repo:

```
$ git clone https://github.com/udonchan/kirakiraemoji.git

```

Enabling the command is run the following in repo directry:


```
$ npm install
$ npm link
```

## Example

```
% kirakiraemoji -i medetai.png -s 150 -o kiramedetai.gif
```

| input file  | output file  |
|:-:|:-:|
| ![input](https://raw.githubusercontent.com/udonchan/kirakiraemoji/master/img/medetai.png)  | ![output](https://raw.githubusercontent.com/udonchan/kirakiraemoji/master/img/kiramedetai.gif)  |

```
% kirakiraemoji -r 128 --colors 32 --guruguru --delay 8 --framenum 16 -i hitode909.png -o guruhitode909.gif
```

| input file  | output file  |
|:-:|:-:|
| ![input](https://raw.githubusercontent.com/udonchan/kirakiraemoji/master/img/hitode909.png)  | ![output](https://raw.githubusercontent.com/udonchan/kirakiraemoji/master/img/gurukirahitode909.gif)  |
