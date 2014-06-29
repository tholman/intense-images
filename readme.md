# Intense Images

A stand alone javascript library for viewing images on the full, full screen. [Here's a demo](http://tholman.com/intense-images)!

## Instructions

Intense images is a stand alone library, so usage is pretty straight forward. All styling of image elements is up to the user, ```Intense.js``` only handles the creation, styling and management of the image viewer, loader and captions.

#### HTML

There aren't many restrictions for the ```html``` elements you want to use to activate the Intense image viewer, the one manditory attribute is either a ```src``` or a ```data-highres```, which needs to point to an image file.

[HTML EXAMPLES HERE]

You can also pass through captions, which will appear at the bottom right of the viewer

[HTML CAPTION EXAMPLES HERE]

#### JS

Intense.js is fairly robust when it comes to assigning elements to be used, its as simple as passing them to the intense function.

[JS EXAMPLES HERE]

#### CSS
There aren't any css restrictions. Although you'll want to avoid tainting the js files css with anything else (editing the base h1 tag, for instance). __Also__, If you wish to use the ```+``` cursor, you can fine the image in the demo folder.

#### IMAGES

Here's a quick screenshot of Intense.js in action, just for records sake.

### License

The MIT License (MIT)

Copyright (c) 2014 ~ [Tim Holman](http://tholman.com) ~ Timothy.w.holman@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.