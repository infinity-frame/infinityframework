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

## Module initializer

Your module must contain an `index.js` file. This file will be dynamically imported by the framework during its initialization.

The framework expects the `index.js` file to have a default export (ESM exports!) of a ModuleInitializer function.

If you are developing your module with TypeScript (which is highly encouraged), make sure to install the `if-types` from NPM. It contains types that come very handy when working on a module.

## Module initialization context

When the ModuleInitializer function is called by the framework during initialization, context is supplied as a parameter. This context contains information about the app, other modules, their exported methods and more.

Below is a list of the most important properties and notes about this context. For a full list of properties, refer to the `if-types` package containing type information about the ModuleSetupContext.

### `collections`

Collections contain MongoDB collection objects that you can use to interact with the database. They are declared using the `modconfig.json` file.

### `logger`

Contains a Pino Logger object. It is recommended you use this object to log info, warning and error messages instead of the regular `console.log` method, since it attaches information about your module when logging.

### Modules context

To access methods and information exported by other modules, you can access the `modules` array on the AppContext `app` property in the initialization context. Beware that the `modules` array is initially empty until all modules are initialized, therefore you must wait for the `initialized` event to fire before accessing any other modules.

```ts
const moduleInitializer: ModuleInitializer = async (context) => {
  // Prints an empty array []
  context.logger.info(context.app.modules);

  context.app.events.addListener("initialized", () => {
    // Prints correctly
    context.logger.info(context.app.modules);
  });
};
```

## Module exports

Your ModuleInitializer function must return a valid ModuleExports object. Because the framework doesn't apply any runtime type checking of your exports, it is crucial that you follow the type declaration provided by the `if-types` package.

### Router

Router is an express router that you can use to mount your custom endpoints to the app. These routes can then be utilized by the administration environment with the valid credentials, since all your routes are protected by authorization.

These routes will be mounted on the path `/api/VENDOR/NAME/`.

### Methods

Methods is an object exporting all methods that will be made available to other modules during runtime.

### Contexts

Contexts is an object exporting all methods that can then be used in view templates to render pages with dynamic content.

It is recommended that you create a comprehensive documentation for all contexts & their parameters.

## Example of a ModuleInitializer function

```ts
import express, { NextFunction, Request, Response } from "express";
import { ModuleInitializer } from "if-types";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";

const moduleInitializer: ModuleInitializer = async (context) => {
  const router = express.Router();
  router.use(express.json());

  router.get(
    "/posts",
    async (req: Request, res: Response, next: NextFunction) => {
      res.json(await context.collections.posts.find({}).toArray());
    }
  );

  context.app.events.addListener("initialized", () => {
    if (
      context.app.modules.find((m) => {
        m.config.vendor === "infinityframe" && m.config.name === "calendar";
      })
    ) {
      // Calendar module is present, do some intresting stuff
    }
  });

  return {
    router,
    methods: {
      async posts() {
        return await context.collections.posts.find({});
      },
    },
    contexts: {
      async post(req: Request) {
        const postId = new ObjectId(req.params.postId);
        const post = await context.collections.posts
          .find({ _id: postId })
          .toArray();

        if (post === null) {
          throw createHttpError(404);
        }

        return post;
      },
    },
  };
};

export default moduleInitializer;
```
