/**
 * InfoModal - Modal de Informações do App
 * 
 * Exibe versão do app e quantidade de cartórios interligados
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {cartorioService} from '../services/cartorioService';
import {updateService} from '../services/updateService';

const COLORS = {
  primary: '#1976D2',
  background: '#F0F4F8',
  white: '#FFFFFF',
  textDark: '#333333',
  textSubtle: '#757575',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({visible, onClose}) => {
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (visible) {
      loadMetadata();
    }
  }, [visible]);

  const loadMetadata = async () => {
    try {
      setLoading(true);
      const data = await cartorioService.getMetadata();
      setMetadata(data);
    } catch (error) {
      console.error('Erro ao carregar metadados:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Informações do App</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {loading ? (
              <Text style={styles.loadingText}>Carregando...</Text>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Versão:</Text>
                  <Text style={styles.infoValue}>{metadata?.version || '1.0.0'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cartórios Interligados:</Text>
                  <Text style={styles.infoValue}>
                    {metadata?.totalCartorios?.toLocaleString('pt-BR') || '0'}
                  </Text>
                </View>

                {metadata?.lastUpdate && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Última Atualização:</Text>
                    <Text style={styles.infoValue}>
                      {cartorioService.formatLastUpdateDate(metadata.lastUpdate)}
                    </Text>
                  </View>
                )}

                <View style={styles.divider} />

                <Text style={styles.description}>
                  {metadata?.description || 'Base de dados offline de cartórios interligados do Brasil'}
                </Text>

                <TouchableOpacity
                  style={[styles.updateButton, updating && styles.updateButtonDisabled]}
                  onPress={handleUpdate}
                  disabled={updating}>
                  {updating ? (
                    <View style={styles.updateButtonContent}>
                      <ActivityIndicator size="small" color={COLORS.white} />
                      <Text style={styles.updateButtonText}>Atualizando...</Text>
                    </View>
                  ) : (
                    <View style={styles.updateButtonContent}>
                      <Text style={styles.updateButtonIcon}>🔄</Text>
                      <Text style={styles.updateButtonText}>Atualizar Base de Dados</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      
      // Verificar atualizações
      const updateCheck = await updateService.checkForUpdates();
      
      if (!updateCheck.available) {
        Alert.alert(
          'Sem Atualizações',
          'Você já está com a versão mais recente da base de dados.',
          [{text: 'OK'}]
        );
        setUpdating(false);
        return;
      }

      // Confirmar atualização
      Alert.alert(
        'Atualização Disponível',
        `Nova versão disponível: ${updateCheck.version}\n\nDeseja atualizar agora?`,
        [
          {text: 'Cancelar', style: 'cancel', onPress: () => setUpdating(false)},
          {
            text: 'Atualizar',
            onPress: async () => {
              try {
                if (updateCheck.metadata) {
                  await updateService.downloadUpdate(updateCheck.metadata);
                  Alert.alert(
                    'Sucesso',
                    'Base de dados atualizada com sucesso!',
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          loadMetadata(); // Recarregar metadados
                          setUpdating(false);
                        },
                      },
                    ]
                  );
                }
              } catch (error: any) {
                Alert.alert(
                  'Erro',
                  `Não foi possível atualizar: ${error.message || 'Erro desconhecido'}`,
                  [{text: 'OK', onPress: () => setUpdating(false)}]
                );
              }
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Erro',
        `Erro ao verificar atualizações: ${error.message || 'Erro desconhecido'}`,
        [{text: 'OK', onPress: () => setUpdating(false)}]
      );
    }
  };
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 24,
    color: COLORS.textSubtle,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSubtle,
    textAlign: 'center',
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.textSubtle,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSubtle,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
  updateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  updateButtonIcon: {
    fontSize: 18,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default InfoModal;

