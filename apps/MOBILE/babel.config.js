module.exports = function (api) {
  api.cache(true);

  const plugins = [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@mobile': '.',
          '@': '.',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
    'react-native-reanimated/plugin',
  ];

  if (
    process.env.NX_TASK_TARGET_TARGET === 'build' ||
    process.env.NX_TASK_TARGET_TARGET?.includes('storybook')
  ) {
    return {
      presets: [
        [
          '@nx/react/babel',
          {
            runtime: 'automatic',
          },
        ],
      ],
      plugins,
    };
  }

  return {
    presets: [
      ['@react-native/babel-preset', { useTransformReactJSX: true }],
      'nativewind/babel',
    ],
    plugins,
  };
};
