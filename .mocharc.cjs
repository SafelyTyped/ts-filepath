module.exports = {
    "extensions": ["ts", "tsx"],
    "require": "ts-node/register",
    // "loader": "ts-node/esm",
    "spec": [
      "src/**/*.spec.ts"
    ],
    "watch-files": [
      "src"
    ]
}