# Mi Radio
Inspired by https://github.com/sfedotoff/miwifiradio

![](http://xiaomi-mi.com/uploads/CatalogueImage/pvm_xiaomi-mi-internet-radio-white-01_14110_1476950820.jpg)

[Xiaomi Mi radio](http://xiaomi-mi.com/smart-home/xiaomi-mi-internet-radio-white) is a cheap and best quality WIFI radio device, but it's only restricted to play the radio stations those Xiaomi provided, what this application does is redirect all domain routes from `xiaomi` to the local server and stream your favorited radio live stream to Mi Radio

## Requirements
- Node v6.3.0
- ffmpeg with libfdk_aac
```
$brew install ffmpeg --with-fdk-aac --with-ffplay --with-freetype --with-libass --with-libquvi --with-libvorbis --with-libvpx --with-opus --with-x265
```

## Run
* First at all, setting the DNS in your router with the local machine IP eg: `192.168.1.29`.
* Assign the environment variable `RADIO_URL` to your desire radio playlist(m3u8) or audio(mp3, aac)
```
$export RADIO_URL="http://stream-redirect.hktoolbar.com/radio-HTTP/cr2-hd.3gp/playlist.m3u8"
```
* Start it! (For running DNS and HTTP servers on privileged ports, must run with root permission)
```
$sudo -E node index.js
```
* Please wait around 30sec, then check console, should showing:
```
rewrite live.xmcdn.com 192.168.1.29
playlist: /live/1065/24.m3u8
```
if not, please try to switching the orange button on the device upward or downward and check the console until showing `playlist: /**/*.m3u8`


## Todos
Add UI interface to let user specify the radio url
