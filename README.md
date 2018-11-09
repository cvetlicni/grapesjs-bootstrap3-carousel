# GrapesJS Plugin Carousel

## Options

|Option|Description|Default|
|-|-|-
|`prefixName`|Prefix|`bst-carousel`|
|`gridsCategory`|Grids category name|`Extra`|
|`autoplay`|If the carousel begin moving|`true`|
|`interval`|Interval to move the slides in ms|`5000`|


## Usage

```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
<script src="https://unpkg.com/grapesjs"></script>
<script src="path/to/grapesjs-plugin-carousel.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container : '#gjs',
      ...
      plugins: ['grapesjs-plugin-carousel'],
  });
</script>
```





## Development

Clone the repository

```sh
$ git clone https://github.com/omarmd1986/grapesjs-plugin-carousel.git
$ cd grapesjs-plugins-carousel
```

Install dependencies

```sh
$ npm i
```

The plugin relies on GrapesJS via `peerDependencies` so you have to install it manually (without adding it to package.json)

```sh
$ npm i grapesjs --no-save
```

Start the dev server

```sh
$ npm start
```


## License

BSD 3-Clause
