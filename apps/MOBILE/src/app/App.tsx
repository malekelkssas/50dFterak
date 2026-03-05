import "../../global.css";
import React from 'react';
import { View, Text, StatusBar } from 'react-native';

export const App = () => {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <StatusBar barStyle="light-content" />

      <View className="mb-8 rounded-2xl bg-slate-800 p-8 shadow-xl">
        <Text className="text-center text-4xl font-extrabold tracking-tight text-white mb-2">
          Tailwind is Working! 🎉
        </Text>
        <Text className="text-center text-lg font-medium text-slate-400">
          Built with NativeWind v4 & Nx
        </Text>
      </View>

      <View className="flex-row space-x-4 mt-6">
        <View className="rounded-full bg-emerald-500/20 px-6 py-3 border border-emerald-500/30">
          <Text className="font-semibold text-emerald-400">Fast</Text>
        </View>
        <View className="rounded-full bg-blue-500/20 px-6 py-3 border border-blue-500/30">
          <Text className="font-semibold text-blue-400">Simple</Text>
        </View>
        <View className="rounded-full bg-purple-500/20 px-6 py-3 border border-purple-500/30">
          <Text className="font-semibold text-purple-400">Beautiful</Text>
        </View>
      </View>
    </View>
  );
};

export default App;
