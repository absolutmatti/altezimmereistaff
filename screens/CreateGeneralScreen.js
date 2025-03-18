import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'react-native-feather';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TextArea } from '../components/TextArea';
import { CheckboxGroup } from '../components/form/Checkbox';
import { MediaUpload } from '../components/form/MediaUpload';
import { 
  FormItem, 
  FormLabel,
  FormMessage, 
  FormActions 
} from '../components/form/FormComponents';
import { GENERAL_CATEGORIES } from '../constants/categories';

// Validierungsschema für das Formular
const formSchema = z.object({
  content: z.string().min(1, { message: "Der Inhalt darf nicht leer sein." }),
  categories: z.array(z.string()).optional(),
});

export default function CreateGeneralScreen({ navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  
  // React Hook Form Setup
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      categories: [],
    },
  });
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Hier würde die Logik zum Erstellen des Posts implementiert werden
      console.log('Creating general post with:', { ...data, mediaPreview });
      
      // Simuliere einen API-Aufruf
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Erfolgsmeldung
      Alert.alert(
        'Post erstellt',
        'Dein Post wurde erfolgreich erstellt.',
        [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }]
      );
    } catch (error) {
      console.error('Post creation error:', error);
      
      // Fehlermeldung
      Alert.alert(
        'Fehler beim Erstellen',
        'Dein Post konnte nicht erstellt werden.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          <Text style={styles.screenTitle}>Neuen Post erstellen</Text>
          
          <Card>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Neuer Post</Text>
              
              <FormItem>
                <FormLabel>Was möchtest du teilen?</FormLabel>
                <Controller
                  control={control}
                  name="content"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextArea
                      placeholder="Schreibe etwas..."
                      minHeight={150}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.content && <FormMessage error={errors.content} />}
              </FormItem>
              
              <FormItem>
                <FormLabel>Bild/Video hinzufügen (optional)</FormLabel>
                <MediaUpload
                  value={mediaPreview}
                  onChange={setMediaPreview}
                  allowTypes={['image']}
                />
              </FormItem>
              
              <FormItem>
                <Controller
                  control={control}
                  name="categories"
                  render={({ field: { onChange, value } }) => (
                    <CheckboxGroup
                      label="Kategorien"
                      description="Wähle eine oder mehrere Kategorien für deinen Post."
                      options={GENERAL_CATEGORIES}
                      selectedValues={value || []}
                      onChange={onChange}
                    />
                  )}
                />
                {errors.categories && <FormMessage error={errors.categories} />}
              </FormItem>
            </View>
          </Card>
          
          <FormActions>
            <Button
              variant="outline"
              style={styles.actionButton}
              onPress={() => navigation.goBack()}
              disabled={isSubmitting}
            >
              Abbrechen
            </Button>
            <Button
              style={styles.actionButton}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              icon={isSubmitting ? <Loader2 width={16} height={16} color="#ffffff" /> : null}
            >
              {isSubmitting ? 'Erstellen...' : 'Post erstellen'}
            </Button>
          </FormActions>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});