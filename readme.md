# Intense Images

A stand alone javascript library for viewing images on the full, full screen. [Here's a demo](http://tholman.com/intense-images)!

### Instructions

Intense images is a stand alone library, so usage is pretty straight forward. All styling of image elements is up to the user, ```Intense.js``` only handles the creation, styling and management of the image viewer, loader and captions.

#### HTML

There aren't many restrictions for the `html` elements you want to use to activate the Intense image viewer, the one manditory attribute is either a `src` or a `data-highres`, which needs to point to an image file.

```html
<img src="./img/awesome-source.jpg" />

<!-- OR -->

<div class="anything" data-highres="./img/awesome-source.jpg" />
```

You can also pass through titles, and subcaptions, which will appear at the bottom right of the viewer. To do this, you use the `data-title` and `data-caption` attributes.

```html
<img src="./img/awesome-source.jpg" data-title="My beach adventure" data-caption="Thanks Sam, for the great picture"/>
```

#### JS

Intense.js is fairly robust when it comes to assigning elements to be used, its as simple as passing them to the ```Intense``` function, once they have been rendered. You can do this with `document.querySelector` finding your elements however you like.

```html
<img src="./img/awesome-source.jpg" />

<script>
window.onload = function() {
	// Intensify all images on the page.
    var element = document.querySelector( 'img' );
	Intense( element );
}
</script>
```

Or doing multiple at once, with a classname.

```html
<img src="./img/awesome-source.jpg" class="intense" />
<img src="./img/awesome-source.jpg" class="intense" />

<script>
window.onload = function() {
	// Intensify all images with the 'intense' classname.
    var elements = document.querySelectorAll( '.intense' );
	Intense( elements );
}
</script>
```

#### CSS
There aren't any css restrictions. Although you'll want to avoid tainting the js files css with anything else (editing the base h1 tag, for instance), unless of course, thats what you want to customize.

 __Also__, If you wish to use the ```+``` cursor, you can fine the image in the demo folder, here's the css snippet.

```css
.intense {
	cursor: url('./you-image-directory/plus_cursor.png') 25 25, auto;
}
```

#### Image/Example

Here's a quick screenshot of Intense.js in action. You should really look at the [demo](http://tholman.com/intense-images) though, to get a full feel for the interactions.

![Intense.js in action](http://i.imgur.com/C98D6tw.png "Image Viewer")

### License

The MIT License (MIT)

Copyright (c) 2014 ~ [Tim Holman](http://tholman.com) ~ timothy.w.holman@gmail.com

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