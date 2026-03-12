import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { C } from '../../constants';
import { I } from '../Icons';
import { TimePicker, SkillsInput } from '../Common';
import { useApp } from '../../context/AppContext';

const AUTOFILL_URL = 'https://voluntir-ai.stanleyho862.workers.dev';

const INITIAL_FORM = {
  title: '',
  description: '',
  volunteersNeeded: '',
  date: '',
  startTime: '',
  endTime: '',
  location: '',
  organizer: '',
  contactEmail: '',
  website: '',
  skills: [],
};

const REQUIRED = ['title', 'date', 'volunteersNeeded', 'startTime', 'endTime', 'contactEmail', 'location'];

export default function CreateListingPage() {
  const { user, createListing } = useApp();
  const [form, setForm] = useState(INITIAL_FORM);
  const [autoFillUrl, setAutoFillUrl] = useState('');
  const [autoFilling, setAutoFilling] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleAutoFill = async () => {
    if (!autoFillUrl.trim()) return;
    setAutoFilling(true);
    try {
      const res = await fetch(AUTOFILL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: autoFillUrl.trim() }),
      });
      const data = await res.json();
      if (data) {
        setForm((prev) => ({
          ...prev,
          title: data.title || prev.title,
          organizer: data.organizer || prev.organizer,
          description: data.description || prev.description,
          volunteersNeeded: data.volunteersNeeded
            ? String(data.volunteersNeeded)
            : prev.volunteersNeeded,
          date: data.date || prev.date,
          startTime: data.startTime || prev.startTime,
          endTime: data.endTime || prev.endTime,
          location: data.location || prev.location,
          contactEmail: data.contactEmail || prev.contactEmail,
          website: data.website || autoFillUrl.trim() || prev.website,
          skills: data.skills && data.skills.length > 0 ? data.skills : prev.skills,
        }));
      }
    } catch (err) {
      Alert.alert('Auto-fill Error', 'Could not extract event details from the URL.');
    } finally {
      setAutoFilling(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    REQUIRED.forEach((key) => {
      if (!form[key] || !String(form[key]).trim()) {
        newErrors[key] = true;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createListing({
        ...form,
        volunteersNeeded: Number(form.volunteersNeeded),
      });
      setSuccess(true);
      setForm(INITIAL_FORM);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      Alert.alert('Error', 'Failed to create listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (label, key, opts = {}) => {
    const {
      placeholder,
      multiline,
      keyboardType,
      numberOfLines,
    } = opts;
    const hasError = errors[key];
    return (
      <View style={s.fieldGroup}>
        <Text style={s.label}>
          {label}
          {REQUIRED.includes(key) && <Text style={s.required}> *</Text>}
        </Text>
        <TextInput
          style={[
            s.input,
            multiline && s.inputMultiline,
            hasError && s.inputError,
          ]}
          value={form[key]}
          onChangeText={(val) => set(key, val)}
          placeholder={placeholder || label}
          placeholderTextColor={C.textMuted}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType || 'default'}
        />
        {hasError && (
          <Text style={s.errorText}>This field is required</Text>
        )}
      </View>
    );
  };

  if (success) {
    return (
      <View style={s.successContainer}>
        <I.Check size={64} color={C.greenAccent} />
        <Text style={s.successTitle}>Listing Created!</Text>
        <Text style={s.successSub}>
          Your volunteer opportunity is now live.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.heading}>Create Listing</Text>

      {/* Auto-fill section */}
      <View style={s.autoFillCard}>
        <View style={s.autoFillHeader}>
          <I.Sparkles size={18} color={C.greenDark} />
          <Text style={s.autoFillTitle}>AI Auto-fill</Text>
        </View>
        <Text style={s.autoFillDesc}>
          Paste an event URL and we will extract the details for you.
        </Text>
        <View style={s.autoFillRow}>
          <TextInput
            style={s.autoFillInput}
            value={autoFillUrl}
            onChangeText={setAutoFillUrl}
            placeholder="https://example.com/event"
            placeholderTextColor={C.textMuted}
            autoCapitalize="none"
            keyboardType="url"
          />
          <TouchableOpacity
            style={[s.autoFillBtn, autoFilling && s.autoFillBtnDisabled]}
            onPress={handleAutoFill}
            disabled={autoFilling}
          >
            {autoFilling ? (
              <ActivityIndicator size="small" color={C.white} />
            ) : (
              <Text style={s.autoFillBtnText}>Extract</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Form fields */}
      <View style={s.card}>
        {renderField('Organizer', 'organizer', {
          placeholder: 'Organization name',
        })}
        {renderField('Title', 'title', {
          placeholder: 'Event title',
        })}
        {renderField('Description', 'description', {
          placeholder: 'Describe the volunteer opportunity...',
          multiline: true,
          numberOfLines: 4,
        })}
        {renderField('Volunteers Needed', 'volunteersNeeded', {
          placeholder: '10',
          keyboardType: 'numeric',
        })}

        {/* Date */}
        <View style={s.fieldGroup}>
          <Text style={s.label}>
            Date<Text style={s.required}> *</Text>
          </Text>
          <TextInput
            style={[s.input, errors.date && s.inputError]}
            value={form.date}
            onChangeText={(val) => set('date', val)}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={C.textMuted}
          />
          {errors.date && (
            <Text style={s.errorText}>This field is required</Text>
          )}
        </View>

        {/* Time pickers */}
        <View style={s.fieldGroup}>
          <Text style={s.label}>
            Event Time<Text style={s.required}> *</Text>
          </Text>
          <TimePicker
            startVal={form.startTime}
            endVal={form.endTime}
            onStartChange={(val) => set('startTime', val)}
            onEndChange={(val) => set('endTime', val)}
          />
          {(errors.startTime || errors.endTime) && (
            <Text style={s.errorText}>Start and end times are required</Text>
          )}
        </View>

        {/* Location */}
        <View style={s.fieldGroup}>
          <Text style={s.label}>
            Location<Text style={s.required}> *</Text>
          </Text>
          <TextInput
            style={[s.input, errors.location && s.inputError]}
            value={form.location}
            onChangeText={(val) => set('location', val)}
            placeholder="123 Main St, City, State"
            placeholderTextColor={C.textMuted}
          />
          {errors.location && (
            <Text style={s.errorText}>This field is required</Text>
          )}
        </View>

        {/* Skills */}
        <View style={s.fieldGroup}>
          <Text style={s.label}>Skills</Text>
          <SkillsInput
            skills={form.skills}
            onChange={(skills) => set('skills', skills)}
          />
        </View>

        {renderField('Contact Email', 'contactEmail', {
          placeholder: 'email@example.com',
          keyboardType: 'email-address',
        })}
        {renderField('Website', 'website', {
          placeholder: 'https://...',
          keyboardType: 'url',
        })}

        {/* Submit */}
        <TouchableOpacity
          style={[s.submitBtn, submitting && s.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={C.white} />
          ) : (
            <Text style={s.submitBtnText}>Create Listing</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.offWhite,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 16,
    fontFamily: 'Asap',
  },

  /* Auto-fill card */
  autoFillCard: {
    backgroundColor: C.cream,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  autoFillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  autoFillTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.greenDark,
    fontFamily: 'Asap',
  },
  autoFillDesc: {
    fontSize: 13,
    color: C.textSecondary,
    marginBottom: 12,
    fontFamily: 'Asap',
  },
  autoFillRow: {
    flexDirection: 'row',
    gap: 10,
  },
  autoFillInput: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: C.textPrimary,
    fontFamily: 'Asap',
  },
  autoFillBtn: {
    backgroundColor: C.greenDark,
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  autoFillBtnDisabled: {
    opacity: 0.6,
  },
  autoFillBtnText: {
    color: C.white,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Asap',
  },

  /* Form card */
  card: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: C.textPrimary,
    marginBottom: 6,
    fontFamily: 'Asap',
  },
  required: {
    color: C.red,
  },
  input: {
    backgroundColor: C.offWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: C.textPrimary,
    fontFamily: 'Asap',
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: C.red,
    backgroundColor: C.redLight,
  },
  errorText: {
    fontSize: 12,
    color: C.red,
    marginTop: 4,
    fontFamily: 'Asap',
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },

  /* Submit */
  submitBtn: {
    backgroundColor: C.greenAccent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: C.white,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Asap',
  },

  /* Success */
  successContainer: {
    flex: 1,
    backgroundColor: C.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: C.greenDark,
    marginTop: 16,
    fontFamily: 'Asap',
  },
  successSub: {
    fontSize: 15,
    color: C.textSecondary,
    marginTop: 8,
    fontFamily: 'Asap',
  },
});
