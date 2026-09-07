import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing, useGridCardWidth } from '../theme';
import Skeleton from './Skeleton';

type ProductGridSkeletonProps = {
  count?: number;
};

export default function ProductGridSkeleton({ count = 6 }: ProductGridSkeletonProps) {
  const cardWidth = useGridCardWidth();
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ width: cardWidth, marginBottom: spacing.md }}>
          <Skeleton width={cardWidth} height={130} radius={12} />
          <View style={styles.body}>
            <Skeleton width="90%" height={13} />
            <Skeleton width="55%" height={14} style={styles.line} />
            <Skeleton width="40%" height={10} style={styles.line} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  body: { padding: spacing.md },
  line: { marginTop: spacing.sm },
});
