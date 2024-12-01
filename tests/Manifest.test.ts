const { Manifest } = require("../src/dist/models/Manifest");
const path = require("path");

test("Manifest deserialization: ambiguos path", () => {
  const manifest = new Manifest();
  expect(manifest).toBeInstanceOf(Manifest);
});

test("Manifest deserialization: specified path", () => {
  const manifest = new Manifest(path.resolve("tests/data/mockManifest.json"));
  expect(manifest).toBeInstanceOf(Manifest);
});

test("Manifest deserialization: Invalid JSON", () => {
  expect(() => new Manifest("tests/data/invalidManifest.json")).toThrow();
});
