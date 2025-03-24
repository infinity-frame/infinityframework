<h1>Installation</h1>

## Preqrequisites

- NodeJS 22 or above (& NPM)
- MongoDB 8 deployment

Before using Infinityframework, you should be familiar with the [JSON format structure](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON).

## Downloading pre-compiled builds

Currently, there are no builds of InfinityFramework, so you have to clone the project and build from source.

## Building from source

1. Clone the repository.

```
git clone https://github.com/infinity-frame/infinityframework.git
```

2. Install dependencies.

```
npm install
```

3. Build the project.

```
npm run build
```

4. (Optional) Test the built project.

```
npm run test
```

5. Create a `manifest.json` file in the root directory and fill in the required values.

```
{
	"name": "Awesome app built with infinityframework!",
	"origin": "*",
	"dbUri": "mongodb://localhost:27017",
	"port": 3000
}
```

6. Start up the app.

```
npm run start
```

[Next up – 3 Installing modules]()
