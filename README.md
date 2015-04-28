# Logo Background Plugin

This plugin is inspired by [Brian Gonzalez's adaptative background jquery plugin](https://github.com/briangonzalez/jquery.adaptive-backgrounds.js/) (even though the aproach is different).


## How it works:

### The problem:
Have you ever let users to upload their company logo to a platform?... as you may have noticed it's quite hard to explain people what an alpha background means.

![The problem](http://i.imgur.com/djUaXXq.png "Client logos")

So if you are a little obesive about design and colors, this plugin is for you!

### The solution:
[Brian Gonzalez's](https://github.com/briangonzalez) makes a great aproach to the solution, giving us a good plugin to change the background of an image container. This plugin solution is quite different since the aim is to make the logo look like it's contained on the page by making the background look like the border of the logo, and not like the dominant colour.

![The solution](http://i.imgur.com/TId9Kar.png "Logo Background Plugin")

### Algorithm scheme
![The solution](http://i.imgur.com/sLDdZ9R.jpg "")


## Use:

### Basic usage:
```html
<script src="jquery.min.js"></script>
<script src="logoBackground.js"></script>

<script>
    $(function() {
        $('.logo').logoBackground();
    });
</script>
```

### Parameters:
| parameter  | default value  | description |
|------------|----------------|-------------|
| borderSize |              5 | Size of the border of the image that will be used to calculate the border colours (in pixels)
| variance   |             .2 | The border colours will be grouped and the biggest group will be used to calculate the background colour. The variance parameter indicate the maximum colour difference between colours in the same group (.2 is 20%)

## TODO:

 * Cross Origin errors documentation
 * npm / bower packages
 * ....
