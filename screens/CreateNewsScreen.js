import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Plus, Minus } from 'react-native-feather';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TextArea } from '../components/TextArea';
import { Switch } from '../components/form/Switch';
import { CheckboxGroup } from '../components/form/Checkbox';
import { MediaUpload } from '../components/form/MediaUpload';
import { 
  FormItem, 
  FormLabel, 
  FormDescription, 
  FormMessage, 
  FormSection,
  FormDivider,
  FormActions 
} from '../components/form/FormComponents';
import { NEWS_CATEGORIES } from '../constants/categories';

// Validierungsschema für das Formular
const formSchema = z.object({
  title: z.string().min(3, { message: "Der Titel muss mindestens 3 Zeichen lang sein." }),
  content: z.string().min(10, { message: "Der Inhalt muss mindestens 10 Zeichen lang sein." }),
  important: z.boolean().default(false),
  categories: z.array(z.string()).optional(),
  hasVoting: z.boolean().default(false),
  votingQuestion: z.string().optional(),
  votingOptions: z.array(z.string()).optional(),
  votingEndDate: z.string().optional(),
});

export default function CreateNewsScreen({ navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [votingOptions, setVotingOptions] = useState(['Ja', 'Nein']);
  
  // React Hook Form Setup
  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      important: false,
      categories: [],
      hasVoting: false,
      votingQuestion: '',
      votingOptions: ['Ja', 'Nein'],
      votingEndDate: '',
    },
  });
  
  const watchHasVoting = watch('hasVoting');
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Hier würde die Logik zum Erstellen des Posts implementiert werden
      console.log('Creating post with:', { ...data, mediaPreview, votingOptions });
      
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
  
  const addVotingOption = () => {
    setVotingOptions([...votingOptions, '']);
  };
  
  const removeVotingOption = (index) => {
    if (votingOptions.length <= 2) return;
    
    const newOptions = [...votingOptions];
    newOptions.splice(index, 1);
    setVotingOptions(newOptions);
  };
  
  const updateVotingOption = (index, value) => {
    const newOptions = [...votingOptions];
    newOptions[index] = value;
    setVotingOptions(newOptions);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          <Text style={styles.screenTitle}>Neue Nachricht erstellen</Text>
          
          <Card>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Post Details</Text>
              
              <FormItem>
                <FormLabel>Titel</FormLabel>
                <Controller
                  control={control}
                  name="title"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Titel des Posts"
                      placeholderTextColor="#71717a"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.title && <FormMessage error={errors.title} />}
              </FormItem>
              
              <FormItem>
                <FormLabel>Inhalt</FormLabel>
                <Controller
                  control={control}
                  name="content"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextArea
                      placeholder="Inhalt des Posts"
                      minHeight={200}
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
                  name="important"
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      value={value}
                      onValueChange={onChange}
                      label="Wichtiger Post"
                      description="Markiert den Post als wichtig und sendet Benachrichtigungen."
                    />
                  )}
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
                      options={NEWS_CATEGORIES}
                      selectedValues={value || []}
                      onChange={onChange}
                    />
                  )}
                />
                {errors.categories && <FormMessage error={errors.categories} />}
              </FormItem>
            </View>
          </Card>
          
          <Card style={styles.votingCard}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Abstimmung</Text>
              
              <FormItem>
                <Controller
                  control={control}
                  name="hasVoting"
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      value={value}
                      onValueChange={onChange}
                      label="Abstimmung hinzufügen"
                      description="Fügt eine Abstimmung zu diesem Post hinzu."
                    />
                  )}
                />
              </FormItem>
              
              {watchHasVoting && (
                <View style={styles.votingSection}>
                  <FormItem>
                    <FormLabel>Frage</FormLabel>
                    <Controller
                      control={control}
                      name="votingQuestion"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={styles.input}
                          placeholder="Deine Abstimmungsfrage"
                          placeholderTextColor="#71717a"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                      )}
                    />
                    {errors.votingQuestion && <FormMessage error={errors.votingQuestion} />}
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>Antwortoptionen</FormLabel>
                    {votingOptions.map((option, index) => (
                      <View key={index} style={styles.optionRow}>
                        <TextInput
                          style={styles.optionInput}
                          placeholder={`Option ${index + 1}`}
                          placeholderTextColor="#71717a"
                          value={option}
                          onChangeText={(text) => updateVotingOption(index, text)}
                        />
                        <TouchableOpacity
                          style={[
                            styles.optionButton,
                            votingOptions.length <= 2 && styles.disabledButton
                          ]}
                          onPress={() => removeVotingOption(index)}
                          disabled={votingOptions.length <= 2}
                        >
                          <Minus width={16} height={16} color="#ffffff" />
                        </TouchableOpacity>
                      </View>
                    ))}
                    
                    <TouchableOpacity 
                      style={styles.addOptionButton}
                      onPress={addVotingOption}
                    >
                      <Plus width={16} height={16} color="#6366f1" />
                      <Text style={styles.addOptionText}>Option hinzufügen</Text>
                    </TouchableOpacity>
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>Enddatum (optional)</FormLabel>
                    <Controller
                      control={control}
                      name="votingEndDate"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={styles.input}
                          placeholder="YYYY-MM-DD"
                          placeholderTextColor="#71717a"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                      )}
                    />
                    <FormDescription>
                      Lasse das Feld leer für eine Abstimmung ohne Zeitlimit.
                    </FormDescription>
                    {errors.votingEndDate && <FormMessage error={errors.votingEndDate} />}
                  </FormItem>
                </View>
              )}
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
  input: {
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#27272a',
    color: '#ffffff',
    fontSize: 16,
  },
  votingCard: {
    marginTop: 16,
  },
  votingSection: {
    marginTop: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#27272a',
    color: '#ffffff',
    fontSize: 16,
    marginRight: 8,
  },
  optionButton: {
    width: 40,
    height: 40,
    backgroundColor: '#27272a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginTop: 8,
  },
  addOptionText: {
    color: '#6366f1',
    marginLeft: 8,
    fontWeight: '500',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});