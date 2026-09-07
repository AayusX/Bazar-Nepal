import React, { useState } from 'react';
import { Image, View, StyleSheet, ImageStyle, ImageResizeMode } from 'react-native';
import { colors } from '../theme';

type RemoteImageProps = {
  uri?: string;
  style: ImageStyle;
  resizeMode?: ImageResizeMode;
  placeholderColor?: string;
  children?: React.ReactNode;
};

export default function RemoteImage({
  uri,
  style,
  resizeMode = 'cover',
  placeholderColor = colors.imagePlaceholder,
  children,
}: RemoteImageProps) {
  const [failed, setFailed] = useState(false);
  const hasSource = !!uri && !failed;

  return (
    <View style={[styles.wrap, style, { backgroundColor: placeholderColor }]}>
      {hasSource ? (
        <Image
          source={{ uri }}
          style={styles.img}
          resizeMode={resizeMode}
          onError={() => setFailed(true)}
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden' },
  img: { width: '100%', height: '100%' },
});
