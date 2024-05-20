## transferControlToOffscreen vs OffscreenCanvas

You cannot transfer control from a canvas that has a rendering context.
Instead of this:
```
var canvas = document.createElement('canvas');
var offscreen = canvas.transferControlToOffscreen();
var ctx = offscreen.getContext('2d');
```

do this (wich is the same):
```
const canvas = new OffscreenCanvas(100, 1);
const ctx = canvas.getContext('2d');
```

At the end of all you transferToImageBitmap:
```
var bitmap = offscreen.transferToImageBitmap();
```

## Install server
```
npm install -g local-web-server
ws

// OR

ws --spa index.html
```
