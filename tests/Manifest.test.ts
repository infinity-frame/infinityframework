import { IFError } from "../src/dist/models/IFError";

const { Manifest } = require("../src/dist/models/Manifest");
const path = require("path");
const mockManifest = {
  name: "Awesome app built with infinityframework!",
  modules: {
    local: {
      "if.blog": {},
    },
  },
};

test("Manifest deserialization: ambiguos path", () => {
  const manifest = new Manifest();
  expect(manifest).toMatchObject({});
});

test("Manifest deserialization: specified path", () => {
  const manifest = new Manifest(path.resolve("tests/data/mockManifest.json"));
  expect(manifest).toMatchObject(mockManifest);
});

test("Manifest deserialization: Invalid JSON", () => {
  expect(() => new Manifest("tests/data/invalidManifest.json")).toThrow();
});
