<h1>Installation</h1>

## Preqrequisites

- NodeJS 22 or above (& NPM)
- MongoDB 8 deployment

Before using Infinityframework, you should be familiar with the [JSON format structure](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON).

## Downloading pre-compiled builds

Currently, there are no builds of InfinityFramework, so you have to clone the project and build from source.

## Building from source

1. Create a directory for your app & cd into it.

```
mkdir myapp && cd myapp
```

2. Clone the repository.

```
git clone https://github.com/infinity-frame/infinityframework.git
```

3. Cd into infinityframework repo & install dependencies.

```
cd infinityframework && npm install
```

4. Build the project.

```
npm run build
```

4. 1. (Optional) Test the built project.

```
npm run test
```

5. Create a `manifest.json` file in the app root directory (`cd ..`) and fill in the required values.

```
{
	"name": "Awesome app built with infinityframework!",
	"origin": "*",
	"dbUri": "mongodb://localhost:27017",
	"port": 3000
}
```

We will learn more about the Manifest file in the next chapter.

6. Start up the app.

```
node infinityframework
```

[Next up – 3 Installing modules]()
