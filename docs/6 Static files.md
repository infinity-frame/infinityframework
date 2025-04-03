# Static files

InfinityFramework has the ability to host your static assets (such as CSS stylesheets, JS files, images etc.) automatically. To do so, simply create a folder called `public` in your app's root directory.

```
myapp
├── public
│   ├── style.css
```

These assets will then be available at runtime under the `/static` route. So the stylesheet seen above will be acessible under:

`/static/style.css`
