# Modules

Modules are an essential part of InfinityFramework, because they extend the functionality of your app beyond just the hosting of static assets.

Modules can be downloaded from any source you see fit - the Manifest file only needs to point to the module's root directory using the `source` property.

## Declaring modules

After downloading a module, point your Manifest file to the parent folder using the `source` property and `name` property to specify the name of the module's folder.

```json
"modules": [
    {
      "source": "node-modules",
      "name": "if-blog"
    }
]
```

This will result in the framework looking for the module's configuration file `modconfig.json` and all subsequent assets in:

```
myapp
├── manifest.json
├── node_modules <- SOURCE POINTS HERE
│   ├── if-blog <- NAME POINTS HERE
│   │   ├── modconfig.json
│   │   ├── index.js
```

For developing InfinityFramework modules, see [module development documentation]()

[Next up – 5 Views](https://github.com/infinity-frame/infinityframework/blob/main/docs/5%20Views.md)
