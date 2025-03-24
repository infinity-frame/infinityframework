# Configuring the Manifest file

The Manifest file is the root of any InfinityFramework app. It defines the **configuration, views and modules** of an application. From this, the InfinityFramework core prepares and launches the app.

## Configuration settings

The Manifest file contains crucial configuration data without which the app **will not start**. Therefore, it is important to know which settings are necessary.

### name

This value is available to all modules during runtime. Currently, it is reserved for future use and can be an empty string.

### origin

This value is used to configure the CORS `Access-Control-Allow-Origin` header.

### dbUri

This value is used for the database connection. The string must be a valid Mongo connection uri.

### port

Specifies the port on which the app will listen for incoming requests.

## Module & view declarations

The Manifest file also contains declarations for the **modules the app should use** and **views it should render**.

We will learn more about modules and views in chapters 4 and 5. For now, it is only important to know that these declarations are stored in the Manifest file.

[Next up – 4 Modules]()
