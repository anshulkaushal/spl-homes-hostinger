import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const AboutScreen = () => {
  const stats = [
    {value: '50+', label: 'Projects Delivered'},
    {value: '10+', label: 'Years Experience'},
    {value: '100%', label: 'On-time Handover'},
  ];

  const features = [
    'ISO-inspired QA/QC and safety processes',
    'Transparent budgeting and progress tracking',
    'Trusted local suppliers and craftsmen',
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>About SPL HOMES</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>
            SPL HOMES is a customer-first construction company focused on
            delivering durable, beautiful spaces. Our team brings decades of
            combined experience across planning, engineering, and execution.
          </Text>

          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>What Sets Us Apart</Text>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureDot} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e7ecf0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0e1420',
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#5b6577',
    lineHeight: 24,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9eef2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0e1420',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#5b6577',
    fontWeight: '600',
    textAlign: 'center',
  },
  featuresSection: {
    marginTop: 8,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0e1420',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0a5a9c',
    marginTop: 6,
  },
  featureText: {
    fontSize: 16,
    color: '#5b6577',
    lineHeight: 24,
    flex: 1,
  },
});

export default AboutScreen;

