# Intense Images

A stand alone javascript library for viewing images on the full, full screen. Using the touch/mouse position for panning. [Here's a demo](http://tholman.com/intense-images)! You can also play with the code [live on CodePen](http://codepen.io/tholman/pen/mlDiK).

### Instructions

Intense images is a stand alone library (no jquery, or the likes) so usage is pretty straight forward. All styling of image elements is up to the user, ```Intense.js``` only handles the creation, styling and management of the image viewer and captions.

#### HTML

There aren't many restrictions for the `html` elements you want to use to activate the Intense image viewer, the one mandatory attribute is either a `src`, `data-image` or a `href`, which needs to point to an image file. You can use `data-image` if you want to load in a different version of the image to the original source (higher resolution, for example).

```html
<img src="./img/awesome-source.jpg" />

<!-- OR -->

<div class="anything" data-image="./img/awesome-source.jpg" />
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

If you wish to use the `+` cursor, you can find the image in the demo folder, here's the css snippet.

```css
.your-image-class {
	cursor: url('./you-image-directory/plus_cursor.png') 25 25, auto;
}
```

#### Image/Example

Here's a quick screenshot of Intense.js in action. You should really look at the [demo](http://tholman.com/intense-images) though, to get a full feel for the interactions.

![Intense.js in action](http://i.imgur.com/C98D6tw.png "Image Viewer")

###Browser support

Intense has been tested in the latest stable builds of Safari, Chrome and Firefox. It "should work" in Internet Explorer 9 and up as well.

### License

The MIT License (MIT)

Copyright (C) 2014 ~ [Tim Holman](http://tholman.com) ~ timothy.w.holman@gmail.com
