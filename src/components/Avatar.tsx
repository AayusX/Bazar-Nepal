import React, { useState } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

type AvatarProps = {
  uri?: string | null;
  name?: string;
  size?: number;
};

export default function Avatar({ uri, name, size = 44 }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const hasSource = !!uri && !failed;

  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
      {hasSource ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          onError={() => setFailed(true)}
        />
      ) : (
        <Text style={[styles.initial, { fontSize: size * 0.4 }]}>
          {(name || '?').charAt(0).toUpperCase()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.brandSurface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initial: { fontWeight: '700', color: colors.brand },
});
