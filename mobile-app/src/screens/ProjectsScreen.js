import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const ProjectsScreen = () => {
  const [filter, setFilter] = useState('all');

  const projects = [
    {
      id: 'prj-green-meadows',
      title: 'Green Meadows Villas',
      status: 'current',
      location: 'North Zone, City',
      area: '3 & 4 BHK Villas',
      price: 'From $280,000',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80&auto=format&fit=crop',
    },
    {
      id: 'prj-oak-residence',
      title: 'Oak Residence',
      status: 'new',
      location: 'Central Business District',
      area: '2 BHK Apartments',
      price: 'Pre-launch | Enquire',
      image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1000&q=80&auto=format&fit=crop',
    },
    {
      id: 'prj-skyline-plaza',
      title: 'Skyline Plaza',
      status: 'completed',
      location: 'South Avenue',
      area: 'Retail + Office',
      price: 'Sold Out',
      image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1000&q=80&auto=format&fit=crop',
    },
  ];

  const filters = [
    {id: 'all', label: 'All'},
    {id: 'current', label: 'Current'},
    {id: 'new', label: 'New / For Sale'},
    {id: 'completed', label: 'Completed'},
  ];

  const getStatusColor = status => {
    if (status === 'current') return {bg: '#fff2cc', text: '#7a5a00'};
    if (status === 'new') return {bg: '#e6fbf3', text: '#0a6a54'};
    return {bg: '#eef2f7', text: '#475569'};
  };

  const getStatusLabel = status => {
    if (status === 'current') return 'Current';
    if (status === 'new') return 'New / For Sale';
    return 'Completed';
  };

  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter(p => p.status === filter);

  const renderProject = ({item}) => {
    const statusColors = getStatusColor(item.status);
    return (
      <View style={styles.projectCard}>
        <Image source={{uri: item.image}} style={styles.projectImage} />
        <View style={styles.projectContent}>
          <View style={[styles.badge, {backgroundColor: statusColors.bg}]}>
            <Text style={[styles.badgeText, {color: statusColors.text}]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
          <Text style={styles.projectTitle}>{item.title}</Text>
          <View style={styles.projectMeta}>
            <Text style={styles.metaText}>📍 {item.location}</Text>
            <Text style={styles.metaText}>📐 {item.area}</Text>
            <Text style={styles.metaText}>💲 {item.price}</Text>
          </View>
          <TouchableOpacity style={styles.enquireButton}>
            <Text style={styles.enquireButtonText}>Enquire</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Projects</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}>
        {filters.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[
              styles.filterChip,
              filter === f.id && styles.filterChipActive,
            ]}
            onPress={() => setFilter(f.id)}>
            <Text
              style={[
                styles.filterChipText,
                filter === f.id && styles.filterChipTextActive,
              ]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredProjects}
        renderItem={renderProject}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.projectsList}
        showsVerticalScrollIndicator={false}
      />
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
  filtersContainer: {
    maxHeight: 60,
    backgroundColor: '#f6f8fb',
    borderBottomWidth: 1,
    borderBottomColor: '#e7ecf0',
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eef5ff',
    borderWidth: 1,
    borderColor: '#cfe7df',
  },
  filterChipActive: {
    backgroundColor: '#0a5a9c',
    borderColor: '#0a5a9c',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0a5a9c',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  projectsList: {
    padding: 20,
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9eef2',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  projectImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e9eef2',
  },
  projectContent: {
    padding: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0e1420',
    marginBottom: 8,
  },
  projectMeta: {
    gap: 4,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 14,
    color: '#5b6577',
  },
  enquireButton: {
    backgroundColor: '#0a5a9c',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  enquireButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ProjectsScreen;

