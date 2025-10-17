import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../src/constants/colors';
import Typography from '../../src/constants/typography';
import Layout from '../../src/constants/layout';
import Card from '../../src/components/ui/Card';
import Badge from '../../src/components/ui/Badge';
import { fetchDocuments } from '../../src/services/api';
import { Document } from '../../src/types';

export default function DocumentsScreen() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const documentTypes = [
    { key: null, label: 'Toate' },
    { key: 'sentence', label: 'Sentințe' },
    { key: 'letter', label: 'Scrisori' },
    { key: 'securitate_file', label: 'Dosare Securitate' },
    { key: 'photograph', label: 'Fotografii' },
  ];

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchQuery, selectedType]);

  const loadDocuments = async () => {
    try {
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;

    if (selectedType) {
      filtered = filtered.filter(doc => doc.document_type === selectedType);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query)
      );
    }

    setFilteredDocs(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDocuments();
  };

  const renderDocumentCard = ({ item }: { item: Document }) => (
    <TouchableOpacity
      onPress={() => router.push(`/document/${item.id || item._id}`)}
      activeOpacity={0.8}
    >
      <Card style={styles.documentCard}>
        <View style={styles.documentHeader}>
          <View style={styles.iconBadge}>
            <Ionicons name="document-text" size={24} color={Colors.communistRed} />
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.documentYear}>Anul {item.year}</Text>
          </View>
        </View>

        {item.description && (
          <Text style={styles.documentDescription} numberOfLines={3}>
            {item.description}
          </Text>
        )}

        <View style={styles.documentFooter}>
          <Badge
            label={getTypeLabel(item.document_type)}
            variant="default"
          />
          {item.transcription && (
            <View style={styles.transcriptionTag}>
              <Ionicons name="text" size={14} color={Colors.successGreen} />
              <Text style={styles.transcriptionText}>Transcris</Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      sentence: 'Sentință',
      letter: 'Scrisoare',
      securitate_file: 'Dosar Securitate',
      photograph: 'Fotografie',
      other: 'Alt document',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.communistRed} />
        <Text style={styles.loadingText}>Încărcare documente...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ARHIVĂ DOCUMENTE</Text>
        <Text style={styles.headerSubtitle}>
          Documente istorice și mărturii
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Caută document..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <FlatList
        horizontal
        data={documentTypes}
        keyExtractor={item => item.key || 'all'}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedType === item.key && styles.filterChipActive,
            ]}
            onPress={() => setSelectedType(item.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedType === item.key && styles.filterChipTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.filterContainer}
        showsHorizontalScrollIndicator={false}
      />

      {/* Documents List */}
      <FlatList
        data={filteredDocs}
        keyExtractor={item => item.id || item._id || Math.random().toString()}
        renderItem={renderDocumentCard}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.communistRed}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={64} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>Niciun document găsit</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Layout.spacing.md,
    color: Colors.textSecondary,
    fontSize: Typography.body,
  },
  header: {
    padding: Layout.spacing.lg,
    backgroundColor: Colors.darkGray,
    borderBottomWidth: 2,
    borderBottomColor: Colors.communistRed,
  },
  headerTitle: {
    fontSize: Typography.h2,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: Typography.letterSpacingWide,
  },
  headerSubtitle: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    borderRadius: Layout.borderRadius.sm,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    margin: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchInput: {
    flex: 1,
    marginLeft: Layout.spacing.sm,
    color: Colors.text,
    fontSize: Typography.body,
  },
  filterContainer: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.darkGray,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginRight: Layout.spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.communistRed,
    borderColor: Colors.communistRed,
  },
  filterChipText: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  listContainer: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  documentCard: {
    marginBottom: Layout.spacing.md,
  },
  documentHeader: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  iconBadge: {
    width: 50,
    height: 50,
    borderRadius: Layout.borderRadius.sm,
    backgroundColor: Colors.mediumGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: Typography.body,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: Layout.spacing.xs,
  },
  documentYear: {
    fontSize: Typography.small,
    color: Colors.communistRed,
  },
  documentDescription: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: Typography.bodySmall * Typography.lineHeightNormal,
    marginBottom: Layout.spacing.md,
  },
  documentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transcriptionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  transcriptionText: {
    fontSize: Typography.small,
    color: Colors.successGreen,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.xxl,
  },
  emptyText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.md,
  },
});