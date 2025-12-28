module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    // 🔥 FIX WINDOWS CRLF
    "linebreak-style": "off",

    // 🔥 GA PERLU JSDOC DI SEMUA FUNCTION
    "require-jsdoc": "off",

    // 🔥 BIAR GA RIBUT PANJANG BARIS
    "max-len": "off",

    // 🔥 BIAR LEBIH FLEKSIBEL
    "comma-dangle": "off",
    "object-curly-spacing": "off",
    "indent": "off",
    "quotes": ["error", "double", { allowTemplateLiterals: true }],
    "new-cap": "off",
    "semi": "off",

    // 🔥 TETAP JAGA KEAMANAN
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
};
