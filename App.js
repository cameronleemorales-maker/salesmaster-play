import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithCredential, GoogleAuthProvider, signOut } from 'firebase/auth';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { padding: 16 },
  h1: { color: 'white', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  label: { color: '#C9C9C9', marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: '#181818', color: 'white', padding: 12, borderRadius: 12 },
  btn: { backgroundColor: '#4F46E5', padding: 14, borderRadius: 12, marginTop: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '700' },
  chip: { color: '#A1A1A1', marginTop: 6 },
  card: { backgroundColor: '#111111', borderRadius: 16, padding: 16, marginTop: 12, borderWidth: 1, borderColor: '#1F1F1F' }
});

const firebaseConfig = Constants.expoConfig.extra.firebaseConfig;
const apiUrl = Constants.expoConfig.extra.apiUrl;

initializeApp(firebaseConfig);

export default function App(){
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState('');
  const [remaining, setRemaining] = useState(4);
  const [subActive, setSubActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => { setUser(u); });
    (async () => {
      const r = await SecureStore.getItemAsync('remaining');
      if (r !== null) setRemaining(parseInt(r,10));
    })();
    checkSubscription();
  }, []);

  async function checkSubscription(){
    try{
      const res = await fetch(apiUrl + '/me/subscription', { credentials: 'omit' });
      const data = await res.json();
      setSubActive(!!data.active);
    }catch(e){ /* ignore for offline */ }
  }

  async function handleAsk(){
    if(!subActive && remaining <= 0){
      Alert.alert('Limit reached', 'You used your 4 free answers. Please subscribe to continue.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(apiUrl + '/ai-answer', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ prompt: question })
      });
      const data = await res.json();
      setAnswer(data.text || 'Demo answer: tailor your rebuttal, ask a closing question.');
      if(!subActive){
        const next = Math.max(0, remaining-1);
        setRemaining(next);
        await SecureStore.setItemAsync('remaining', String(next));
      }
    } catch (e){
      setAnswer('Demo answer (offline): Use empathy, state a value prop, then ask a trial close.');
    } finally {
      setLoading(false);
    }
  }

  async function startCheckout(){
    try{
      const res = await fetch(apiUrl + '/create-checkout-session', { method: 'POST' });
      const { url } = await res.json();
      if(url) await WebBrowser.openBrowserAsync(url);
    }catch(e){
      Alert.alert('Checkout error', 'Configure your Stripe key on the server.');
    }
  }

  async function handleGoogleSignIn(){
    Alert.alert('Heads up', 'For a production Google login, connect Firebase Google auth in the Firebase Console and use expo-auth-session or native modules. This demo keeps auth local.');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.h1}>SalesMaster</Text>
        <Text style={styles.chip}>{subActive ? 'Subscription: ACTIVE' : `Free answers left: ${remaining}`}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Your prospect's objection or question</Text>
          <TextInput
            placeholder="e.g., 'Your price is too high'"
            placeholderTextColor="#6B7280"
            style={styles.input}
            value={question}
            onChangeText={setQuestion}
            multiline
          />
          <TouchableOpacity style={styles.btn} onPress={handleAsk} disabled={loading || !question.trim()}>
            <Text style={styles.btnText}>{loading ? 'Thinking…' : 'Get AI Answer'}</Text>
          </TouchableOpacity>
          <Text style={[styles.label, {marginTop:16}]}>Answer</Text>
          <View style={{backgroundColor:'#0B0B0B', padding:12, borderRadius:12, borderWidth:1, borderColor:'#1F1F1F'}}>
            {loading ? <ActivityIndicator/> : <Text style={{color:'white'}}>{answer || '—'}</Text>}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.h1}>Training Modules</Text>
          <Text style={{color:'#C9C9C9'}}>Placeholder lessons: Roofing, Auto, Life Insurance, B2B, Timeshare.</Text>
          <Text style={{color:'#9CA3AF', marginTop:8}}>Swap these with your own content later.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.h1}>Upgrade</Text>
          <Text style={{color:'#C9C9C9'}}>Unlimited answers + all lessons</Text>
          <TouchableOpacity style={styles.btn} onPress={startCheckout}>
            <Text style={styles.btnText}>Subscribe ($15.99/mo or $150 lifetime)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
