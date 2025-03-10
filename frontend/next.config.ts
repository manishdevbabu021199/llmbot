const nextConfig = {
  webpack: (config, { isServer }) => {
    // Disable minification
    config.optimization.minimize = false;
    return config;
  },
};

module.exports = nextConfig;