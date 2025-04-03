# Admin system

InfinityFramework provides an administration system complete together with authentication, authorization & simple permissions management. Modules should ship together with their administration system.

## Static files

The modules' administration view is nothing more than an iframe composed of your own custom HTML.

To make these assets available, create an `assets` directory in your module's root. All files within this directory will be made available under the path `/assets/VENDOR/NAME/`.

## Rendering

An `index.html` file within the `assets` directory is loaded to an iframe when the user navigates to the module administration page.
