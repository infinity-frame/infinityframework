# Module development

For fully taking advantage of InfinityFramework, you'll want to develop your own custom modules that introduce new functionality into your app.

## Module config file

The `modconfig.json` file should be contained within the module's root directory. It contains basic information about the module, which is later used for referencing the module in Manifest and in other modules.

Make sure to define all properties listed below. Otherwise, the module configuration will be invalid and fail during initialization.

### `name`

Identifies the module. It is recommended it be in kebab-case to avoid casing mistakes during referencing.

### `vendor`

Identifies the vendor of the module. It is recommended it be in kebab-case to avoid casing mistakes during referencing.

### `version`

Contains a valid version number as per the semantic versioning standard. Currently unused and reserved for future use.

### `collections`

Defines an array of names of MongoDB collections which should be made available to the module at runtime. After definition, they will become available in the initialization context.

### Example of a `modconfig.json` file

```json
{
  "name": "blog",
  "vendor": "infinityframe",
  "version": "1.1.1",
  "collections": ["posts"]
}
```

## Module initializer & initialization context

## Module exports

### Router

### Contexts

### Methods
