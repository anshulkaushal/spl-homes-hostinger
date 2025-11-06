import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import {API_ENDPOINTS} from '../config';

const {height} = Dimensions.get('window');

const DesignScreen = () => {
  const [activeTab, setActiveTab] = useState('hostinger');

  const tabs = [
    {id: 'hostinger', label: 'Design Page'},
    {id: 'floorplanner', label: 'Floorplanner (Easy)'},
    {id: 'planner5d', label: 'Planner 5D (3D)'},
    {id: 'sketchup', label: 'SketchUp (Advanced)'},
  ];

  const getEmbedUrl = tab => {
    if (tab === 'hostinger') {
      return API_ENDPOINTS.designPage;
    }
    if (tab === 'planner5d') {
      return 'https://planner5d.com/embed/';
    }
    if (tab === 'floorplanner') {
      return 'https://floorplanner.com/embed/YOUR_FLOORPLANNER_EMBED_URL';
    }
    return 'https://3dwarehouse.sketchup.com/embed.html?mid=YOUR_MODEL_ID';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Design Your Dream Home</Text>
        <Text style={styles.headerSubtitle}>
          Play with 2D/3D layouts right here, then send us your plan
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab.id)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.tabTextActive,
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.webviewContainer}>
        <WebView
          source={{uri: getEmbedUrl(activeTab)}}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onShouldStartLoadWithRequest={(request) => {
            // Allow navigation within Hostinger domain
            const hostingerUrl = API_ENDPOINTS.designPage.replace('/design.html', '');
            if (request.url.includes(hostingerUrl.replace('https://', '').split('/')[0])) {
              return true;
            }
            // Allow Planner 5D, Floorplanner, SketchUp domains
            if (request.url.includes('planner5d.com') || request.url.includes('floorplanner.com') || request.url.includes('sketchup.com') || request.url.includes('3dwarehouse.sketchup.com')) {
              return true;
            }
            // Open other external links in browser
            if (request.url !== getEmbedUrl(activeTab)) {
              WebBrowser.openBrowserAsync(request.url);
              return false;
            }
            return true;
          }}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Need help? Our team can review your design and provide feedback.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.15)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#e5e7eb',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  tabsContainer: {
    maxHeight: 60,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.15)',
  },
  tabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0b1220',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.25)',
  },
  tabActive: {
    backgroundColor: 'rgba(34,211,238,0.15)',
    borderColor: '#22d3ee',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  tabTextActive: {
    color: '#22d3ee',
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  footer: {
    padding: 16,
    backgroundColor: '#111827',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148,163,184,0.15)',
  },
  footerText: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

export default DesignScreen;

