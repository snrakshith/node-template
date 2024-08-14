module.exports = {
  apps: [
    {
      name: "Recanter Backend",
      script: "./dist/index.js",
      watch: ".",
      instances: 1,
      env: {
        NODE_ENV: "dev",
      },
      env_production: {
        NODE_ENV: "prod",
      },
    },
  ],
};
