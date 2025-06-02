// PerfilScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { api } from "../../service/api_db";
import { Atendente } from "../../model/atendente";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import {Input} from "../../componest/input";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { usePedidoInfo } from '../../context/pedidoInfoContext';

export default function PerfilScreen() {
    const router = useRouter();
    const { atendenteLogado } = usePedidoInfo();
    const [usuario, setUsuario] = useState<Atendente | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedNome, setEditedNome] = useState('');
    const [editedSenha, setEditedSenha] = useState('');
    const [editedFoto, setEditedFoto] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const fetchUsuario = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            if (!atendenteLogado) {
                setError("Nenhum usuário logado encontrado. Por favor, faça login.");
                return;
            }

            const user = await api.getAtendenteByCracha(atendenteLogado.n_cracha);
            if (user) {
                setUsuario(user);
                setEditedNome(user.nome || '');
                setEditedFoto(user.foto || '');
            }
        } catch (err: any) {
            console.error("Erro ao buscar usuário:", err);
            setError(err.message || "Ocorreu um erro ao carregar o perfil.");
            if (err.message.includes('Tempo de requisição excedido') || 
                err.message.includes('Network request failed')) {
                router.replace('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [atendenteLogado, router]);

    useEffect(() => {
        fetchUsuario();
    }, [fetchUsuario]);

    const processImage = async (uri: string): Promise<string> => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (!fileInfo.exists) {
                throw new Error('Arquivo não encontrado');
            }

            // Se o arquivo for maior que 1MB, reduzimos a qualidade
            if (fileInfo.size > 1024 * 1024) {
                const manipResult = await ImageManipulator.manipulateAsync(
                    uri,
                    [{ resize: { width: 500 } }],
                    { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
                );
                return manipResult.uri;
            }
            return uri;
        } catch (error) {
            console.error('Erro ao processar imagem:', error);
            throw new Error('Erro ao processar imagem');
        }
    };

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 0.5,
            });

            if (!result.canceled && result.assets[0]) {
                const processedUri = await processImage(result.assets[0].uri);
                setEditedFoto(processedUri);
            }
        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
        }
    };

    const handleSaveChanges = async () => {
        if (!usuario) return;
        
        try {
            setSaving(true);
            setError(null);

            if (!editedNome.trim()) {
                Alert.alert('Erro', 'O nome não pode ficar em branco.');
                return;
            }

            const updatedData: Partial<Atendente> = {
                nome: editedNome.trim(),
                foto: editedFoto
            };

            if (editedSenha.trim()) {
                updatedData.senha = editedSenha.trim();
            }

            await api.atualizarAtendente(usuario.n_cracha, updatedData);
            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
            setIsEditing(false);
            setEditedSenha('');
            setShowPassword(false);
            await fetchUsuario();
        } catch (error: any) {
            console.error('Erro ao atualizar perfil:', error);
            Alert.alert('Erro', error.message || 'Não foi possível atualizar o perfil.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (!usuario) return;
                            await api.deletarAtendente(usuario.n_cracha);
                            await AsyncStorage.removeItem('user_n_cracha');
                            Alert.alert('Conta excluída', 'Sua conta foi excluída com sucesso.');
                            router.replace('/login');
                        } catch (error) {
                            console.error('Erro ao excluir conta:', error);
                            Alert.alert('Erro', 'Não foi possível excluir a conta.');
                        }
                    }
                }
            ]
        );
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('atendente');
            await AsyncStorage.removeItem('pedidoAtualInfo');
            router.replace('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            Alert.alert('Erro', 'Não foi possível fazer logout.');
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Carregando perfil...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => router.replace('/login')}
                >
                    <Text style={styles.buttonText}>Ir para Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!usuario) {
        return (
            <View style={styles.center}>
                <Text>Usuário não encontrado ou não logado.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={isEditing ? pickImage : undefined}
                    disabled={saving}
                    style={[
                        styles.avatarContainer,
                        isEditing && { opacity: 0.7 }
                    ]}
                >
                    {editedFoto ? (
                        <Image 
                            source={{ uri: editedFoto }} 
                            style={styles.avatar} 
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarInitial}>{editedNome[0]?.toUpperCase()}</Text>
                        </View>
                    )}
                    {isEditing && (
                        <View style={styles.editPhotoOverlay}>
                            <FontAwesome name="camera" size={24} color="#fff" />
                        </View>
                    )}
                </TouchableOpacity>

                {!isEditing && (
                    <>
                        <Text style={styles.nome}>{usuario?.nome}</Text>
                        <Text style={styles.cracha}>Crachá: {usuario?.n_cracha}</Text>
                    </>
                )}
            </View>

            <View style={styles.content}>
                {isEditing ? (
                    <>
                        <Input
                            placeholder="Nome"
                            value={editedNome}
                            onChangeText={setEditedNome}
                            style={styles.input}
                            editable={!saving}
                        />
                        <View style={styles.passwordContainer}>
                            <Input
                                placeholder="Nova Senha (opcional)"
                                secureTextEntry={!showPassword}
                                value={editedSenha}
                                onChangeText={setEditedSenha}
                                style={[styles.input, styles.passwordInput]}
                                editable={!saving}
                            />
                            <TouchableOpacity 
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                                disabled={saving}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <FontAwesome 
                                    name={showPassword ? "eye" : "eye-slash"} 
                                    size={24} 
                                    color={saving ? "#999" : "#666"}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity 
                                style={[
                                    styles.button, 
                                    styles.saveButton,
                                    saving && styles.buttonDisabled
                                ]}
                                onPress={handleSaveChanges}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Salvar</Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => {
                                    setIsEditing(false);
                                    setEditedNome(usuario?.nome || '');
                                    setEditedFoto(usuario?.foto || '');
                                    setEditedSenha('');
                                    setShowPassword(false);
                                }}
                                disabled={saving}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity 
                                style={[styles.button, styles.editButton]}
                                onPress={() => setIsEditing(true)}
                            >
                                <Text style={styles.buttonText}>Editar Perfil</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.button, styles.logoutButton]}
                                onPress={handleLogout}
                            >
                                <Text style={styles.buttonText}>Sair</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity 
                            style={[styles.button, styles.deleteButton]}
                            onPress={handleDeleteAccount}
                        >
                            <Text style={styles.buttonText}>Excluir Conta</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
    } as const,
    header: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 24,
        backgroundColor: '#f5f5f5',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    } as const,
    content: {
        flex: 1,
        padding: 24,
    } as const,
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    } as const,
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#eee",
    } as const,
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
    } as const,
    avatarInitial: {
        fontSize: 48,
        color: "#fff",
        textTransform: 'uppercase',
    } as const,
    nome: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: 'center',
    } as const,
    cracha: {
        fontSize: 18,
        color: "#666",
        textAlign: 'center',
    } as const,
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    } as const,
    input: {
        width: "100%",
        marginBottom: 16,
        backgroundColor: '#fff',
    } as const,
    buttonRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginBottom: 16,
        width: "100%",
    } as const,
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 120,
        alignItems: "center",
    } as const,
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    } as const,
    editButton: {
        backgroundColor: "#38a69d",
    } as const,
    saveButton: {
        backgroundColor: "#38a69d",
    } as const,
    cancelButton: {
        backgroundColor: "#666",
    } as const,
    deleteButton: {
        backgroundColor: "#dc3545",
        width: '100%',
    } as const,
    logoutButton: {
        backgroundColor: "#666",
    } as const,
    errorText: {
        color: "#dc3545",
        marginBottom: 16,
    } as const,
    passwordContainer: {
        width: '100%',
        position: 'relative',
        marginBottom: 16,
    } as const,
    passwordInput: {
        marginBottom: 0,
        paddingRight: 50,
    } as const,
    eyeButton: {
        position: 'absolute',
        right: 12,
        top: '50%',
        transform: [{ translateY: -20 }],
        padding: 8,
        zIndex: 1,
    } as const,
    buttonDisabled: {
        opacity: 0.7,
    } as const,
    editPhotoOverlay: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [
            { translateX: -12 },
            { translateY: -12 }
        ],
        zIndex: 1,
    } as const,
});