// Explicit packageName: Gradle autolinking cache only watches package.json / lockfiles, not namespace in build.gradle.
module.exports = {
  project: {
    android: {
      packageName: 'com.fterak50d.blackwhite',
    },
  },
};
