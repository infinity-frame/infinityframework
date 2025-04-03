# Views

Views represent the interaction between your users and your app. They are the webpages that can be browsed and indexed.

For creating views, a server-side rendering language EJS is used by InfinityFramework. This enables you to insert any dynamic content (such as blog posts) provided by your modules at runtime.

## Creating a view

To create a view, firstly create a `views` directory in your app's root.

```
myapp
├── views
```

Then, create a file ending with the suffix `.ejs`.

_view.ejs_

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>Hello world!</h1>
  </body>
</html>
```

As you can see, the EJS language is a superset of HTML and therefore any valid HTML code is also valid EJS code.

[Refer to EJS docs for more information about the EJS language](https://ejs.co/)

## Declaring a view in the Manifest file

After sucessfully creating a view file in the `views` directory, it is time to declare it in your Manifest file like so:

```json
"views": [
    {
        "path": "/page",
        "view": "view.ejs"
    }
]
```

The `path` property specifies the path used and `view` defines the template for to search for in the `views` directory.

## Dynamic content injection

## Dynamic parameters

## Error pages

[Next up – 6 Static files]()
