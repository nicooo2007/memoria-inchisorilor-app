import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../src/constants/colors';
import Typography from '../../src/constants/typography';
import Layout from '../../src/constants/layout';
import Card from '../../src/components/ui/Card';
import Badge from '../../src/components/ui/Badge';
import Button from '../../src/components/ui/Button';
import { fetchDocuments } from '../../src/services/api';
import { Document } from '../../src/types';

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTranscription, setShowTranscription] = useState(false);

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      // Since we don't have a fetchDocumentById, we fetch all and filter
      const docs = await fetchDocuments();
      const foundDoc = docs.find(d => (d.id || d._id) === id);
      setDocument(foundDoc || null);
    } catch (error) {
      console.error('Failed to load document:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      sentence: 'document-text',
      letter: 'mail',
      securitate_file: 'folder',
      photograph: 'image',
      other: 'document',
    };
    return icons[type] || 'document';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.communistRed} />
        <Text style={styles.loadingText}>Încărcare document...</Text>
      </View>
    );
  }

  if (!document) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={Colors.errorRed} />
        <Text style={styles.errorText}>Documentul nu a fost găsit</Text>
        <Button title="Înapoi" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={getTypeIcon(document.document_type)}
              size={48}
              color={Colors.communistRed}
            />
          </View>
          <Text style={styles.title}>{document.title}</Text>
          <Badge label={getTypeLabel(document.document_type)} variant="default" />
        </View>

        {/* Metadata Card */}
        <Card style={styles.metadataCard}>
          <View style={styles.metadataRow}>
            <View style={styles.metadataItem}>
              <Ionicons name="calendar" size={20} color={Colors.communistRed} />
              <View style={styles.metadataInfo}>
                <Text style={styles.metadataLabel}>Anul</Text>
                <Text style={styles.metadataValue}>{document.year}</Text>
              </View>
            </View>
            {document.transcription && (
              <View style={styles.metadataItem}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.successGreen} />
                <View style={styles.metadataInfo}>
                  <Text style={styles.metadataLabel}>Status</Text>
                  <Text style={[styles.metadataValue, { color: Colors.successGreen }]}>
                    Transcris
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Card>

        {/* Description */}
        {document.description && (
          <Card style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>DESCRIERE</Text>
            <Text style={styles.description}>{document.description}</Text>
          </Card>
        )}

        {/* Document Preview Placeholder */}
        <Card style={styles.previewCard}>
          <Text style={styles.sectionTitle}>PREVIZUALIZARE DOCUMENT</Text>
          <View style={styles.previewPlaceholder}>
            <Ionicons name="document-text-outline" size={64} color={Colors.textSecondary} />
            <Text style={styles.previewText}>
              Scanul documentului va fi disponibil în curând
            </Text>
            <Text style={styles.previewSubtext}>
              Sursa: {document.scan_url}
            </Text>
          </View>
        </Card>

        {/* Transcription */}
        {document.transcription && (
          <Card style={styles.transcriptionCard}>
            <TouchableOpacity
              style={styles.transcriptionHeader}
              onPress={() => setShowTranscription(!showTranscription)}
            >
              <Text style={styles.sectionTitle}>TRANSCRIEREA DOCUMENTULUI</Text>
              <Ionicons
                name={showTranscription ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={Colors.white}
              />
            </TouchableOpacity>
            {showTranscription && (
              <View style={styles.transcriptionContent}>
                <View style={styles.transcriptionQuote}>
                  <View style={styles.quoteBorder} />
                  <Text style={styles.transcriptionText}>{document.transcription}</Text>
                </View>
                <Text style={styles.transcriptionNote}>
                  Nota: Acest text a fost transcris din documentul original pentru ușurință de citire.
                </Text>
              </View>
            )}
          </Card>
        )}

        {/* Historical Context */}
        <Card style={styles.contextCard}>
          <View style={styles.contextHeader}>
            <Ionicons name="information-circle" size={24} color={Colors.communistRed} />
            <Text style={styles.sectionTitle}>CONTEXT ISTORIC</Text>
          </View>
          <Text style={styles.contextText}>
            Acest document datează din perioada {document.year}, o perioadă în care regimul
            comunist din România a persecutat sistematic opozanții politici. Documentele de
            acest tip sunt mărturii importante ale represiunii comuniste.
          </Text>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="PARTAJEAZĂ"
            onPress={() => {}}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title="SALVEAZĂ"
            onPress={() => {}}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Layout.spacing.xl,
  },
  errorText: {
    fontSize: Typography.body,
    color: Colors.text,
    marginVertical: Layout.spacing.lg,
    textAlign: 'center',
  },
  content: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  header: {
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    padding: Layout.spacing.xl,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.communistRed,
    marginBottom: Layout.spacing.lg,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.mediumGray,
    borderWidth: 3,
    borderColor: Colors.communistRed,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  title: {
    fontSize: Typography.h3,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  metadataCard: {
    marginBottom: Layout.spacing.lg,
  },
  metadataRow: {
    flexDirection: 'row',
    gap: Layout.spacing.lg,
  },
  metadataItem: {
    flex: 1,
    flexDirection: 'row',
    gap: Layout.spacing.sm,
    alignItems: 'center',
  },
  metadataInfo: {
    flex: 1,
  },
  metadataLabel: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.xs,
  },
  metadataValue: {
    fontSize: Typography.body,
    fontWeight: 'bold',
    color: Colors.white,
  },
  descriptionCard: {
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.body,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: Typography.letterSpacingWide,
    marginBottom: Layout.spacing.md,
  },
  description: {
    fontSize: Typography.body,
    color: Colors.text,
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
  },
  previewCard: {
    marginBottom: Layout.spacing.lg,
  },
  previewPlaceholder: {
    alignItems: 'center',
    padding: Layout.spacing.xl,
    backgroundColor: Colors.mediumGray,
    borderRadius: Layout.borderRadius.sm,
  },
  previewText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.md,
    textAlign: 'center',
  },
  previewSubtext: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
    textAlign: 'center',
  },
  transcriptionCard: {
    marginBottom: Layout.spacing.lg,
  },
  transcriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transcriptionContent: {
    marginTop: Layout.spacing.md,
  },
  transcriptionQuote: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  quoteBorder: {
    width: 4,
    backgroundColor: Colors.communistRed,
    borderRadius: 2,
  },
  transcriptionText: {
    flex: 1,
    fontSize: Typography.body,
    color: Colors.text,
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
    fontStyle: 'italic',
  },
  transcriptionNote: {
    fontSize: Typography.small,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  contextCard: {
    marginBottom: Layout.spacing.lg,
    backgroundColor: Colors.mediumGray,
  },
  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },
  contextText: {
    fontSize: Typography.body,
    color: Colors.text,
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
  },
  actions: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});