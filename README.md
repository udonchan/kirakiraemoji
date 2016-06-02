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

Basic usage is following:

```
% kirakiraemoji -i medetai.png -s 150 -o kiramedetai.gif
```

In case of using "--guruguru" option, to enable rotation effect.

| input file  | output file  |
|:-:|:-:|
| ![input](https://raw.githubusercontent.com/udonchan/kirakiraemoji/master/img/medetai.png)  | ![output](https://raw.githubusercontent.com/udonchan/kirakiraemoji/master/img/kiramedetai.gif)  |

```
% kirakiraemoji -r 128 --colors 32 --guruguru --delay 8 --framenum 16 -i hitode909.png -o guruhitode909.gif
```

| input file  | output file  |
|:-:|:-:|
| ![input](https://raw.githubusercontent.com/udonchan/kirakiraemoji/master/img/hitode909.png)  | ![output](https://raw.githubusercontent.com/udonchan/kirakiraemoji/master/img/gurukirahitode909.gif)  |

You can use '--label' option. It will assign or generate a label to an image. If you want to use a multi-byte character, you need use "--font" option to enable specify the font.

```
# to download japanese fonts 
% curl -C- "http://fonts.gstatic.com/ea/notosansjapanese/v6/download.zip" -o noto.zip
% unzip noto.zip 
Archive:  noto.zip
  inflating: NotoSansJP-Black.otf    
  inflating: NotoSansJP-Bold.otf     
  inflating: NotoSansJP-DemiLight.otf  
  inflating: NotoSansJP-Light.otf    
  inflating: NotoSansJP-Medium.otf   
  inflating: NotoSansJP-Regular.otf  
  inflating: NotoSansJP-Thin.otf
% kirakiraemoji --font ./NotoSansJP-Black.otf --label "ダウンロー\nド" -o download.gif
```
| output file  |
|:-:|
| ![output](https://raw.githubusercontent.com/udonchan/kirakiraemoji/master/img/download.gif)  | 
