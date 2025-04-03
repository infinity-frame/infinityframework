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

To inject dynamic content into your view, you'll first need a module that exports methods called contexts.

You should find the list of all contexts and their usage in the module's documentation. Alternatively, you may locate in the `index.js` file of the module and the `context` property in the object being returned by the `ModuleInitializer` function.

To inject the context into a view, you must declare it in the Manifest file using the syntax:

`VENDOR.MODULE.CONTEXT`

The `VENDOR` and `MODULE` parts are declared in the `modconfig.json` file of the module.

For example:

```json
"views": [
    {
        "path": "/page",
        "view": "view.ejs",
        "context": ["infinityframe.blog.posts"]
    }
]
```

During a render, the property will become available under the `context.VENDOR.MODULE.CONTEXT` property. Following up on the declaration above, we can use the `posts` objects as such in our view template:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>My awesome blog app</h1>
    <% context.infinityframe.blog.posts.forEach(post => { %>
    <article>
      <h2><%= post.title %></h2>
      <p><%= post.content %></p>
    </article>
    <% }) %>
  </body>
</html>
```

The rendered result:

![Rendered view](TODO)

## Dynamic parameters & other routing options

Some contexts may require a dynamic parameter in the query and/or path. To define a dynamic parameter in a path, follow the express path declaration:

`/some/path/:dynamicparam/view`

For more information about the option the path declaration has, refer to the [expressJS docs](https://expressjs.com/en/guide/routing.html).

## Error pages

If a view that is requested by the user doesn't exist or an error occurs during the render pipeline, a fallback 404 or 500 page is rendered.

To declare these custom error view templates, create `404.ejs` and `500.ejs` in the `views/errors`. These will be rendered when 404 and 500 errors occur respectively.

```
views
├── errors
│   ├── 404.ejs
│   ├── 500.ejs
```

[Next up – 6 Static files]()
