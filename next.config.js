/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ["react-hook-mousetrap"],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    const FilterWarningsPlugin = require("webpack-filter-warnings-plugin");
    config.plugins.push(
      // TypeORM produces lots of warnings, many relating to db engines that aren't used in this project
      new FilterWarningsPlugin({
        exclude: [
          /mongodb/,
          /mssql/,
          /mysql/,
          /mysql2/,
          /oracledb/,
          /redis/,
          /sqlite3/,
          /sql.js/,
          /react-native-sqlite-storage/,
          /@google-cloud/,
          /@sap/,
          /hdb-pool/,
          /pg/,
          /typeorm-aurora-data-api-driver/,
          /Critical dependency: the request of a dependency is an expression/,
          /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
        ],
      })
    );
    return config;
  },
};

module.exports = nextConfig;
