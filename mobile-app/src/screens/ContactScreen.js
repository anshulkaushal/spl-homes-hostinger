import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialIcons} from '@expo/vector-icons';

const ContactScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const subject = encodeURIComponent('Contact from SPL HOMES App');
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
    );

    Linking.openURL(`mailto:info@splhomes.com?subject=${subject}&body=${body}`);
    setFormData({name: '', email: '', message: ''});
  };

  const contactInfo = [
    {
      icon: 'phone',
      label: 'Phone',
      value: '+1 234 567 890',
      action: () => Linking.openURL('tel:+1234567890'),
    },
    {
      icon: 'email',
      label: 'Email',
      value: 'info@splhomes.com',
      action: () => Linking.openURL('mailto:info@splhomes.com'),
    },
    {
      icon: 'location-on',
      label: 'Office',
      value: 'SPL HOMES, Main Street, City, Country',
      action: null,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Contact Us</Text>
        </View>

        <View style={styles.content}>
          {/* Contact Info */}
          <View style={styles.contactInfoSection}>
            {contactInfo.map((info, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactInfoCard}
                onPress={info.action}
                disabled={!info.action}>
                <View style={styles.contactInfoIcon}>
                  <MaterialIcons name={info.icon} size={24} color="#0a5a9c" />
                </View>
                <View style={styles.contactInfoContent}>
                  <Text style={styles.contactInfoLabel}>{info.label}</Text>
                  <Text style={styles.contactInfoValue}>{info.value}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Contact Form */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Send us a message</Text>

            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor="#94a3b8"
              value={formData.name}
              onChangeText={text => setFormData({...formData, name: text})}
            />

            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={text => setFormData({...formData, email: text})}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about your project"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={formData.message}
              onChangeText={text => setFormData({...formData, message: text})}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Send Message</Text>
            </TouchableOpacity>
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
  contactInfoSection: {
    marginBottom: 32,
  },
  contactInfoCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9eef2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  contactInfoIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eef5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfoContent: {
    flex: 1,
  },
  contactInfoLabel: {
    fontSize: 12,
    color: '#5b6577',
    marginBottom: 4,
    fontWeight: '600',
  },
  contactInfoValue: {
    fontSize: 16,
    color: '#0e1420',
    fontWeight: '600',
  },
  formSection: {
    marginTop: 8,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0e1420',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cfd8e3',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#0e1420',
    marginBottom: 12,
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: '#0a5a9c',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ContactScreen;

