import React, { useState } from 'react';
import { View, StatusBar, TextInput, Button, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const [url, setUrl] = useState('');

  const handleUrlChange = (text) => {
    setUrl(text);
  };

  const handleGoPress = () => {
    // Kiểm tra xem url có đúng định dạng http/https hay không
    if (
      !url.startsWith('http://') &&
      !url.startsWith('https://')
    ) {
      alert('Vui lòng nhập địa chỉ hợp lệ!');
      return;
    }
  };

  const handleLoadError = () => {
    
  };

  return (
    <View style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, marginHorizontal: 10 }}
          onChangeText={handleUrlChange}
          value={url}
        />
        <Button title="Go" onPress={handleGoPress} />
      </View>
      <WebView
        source={{ uri: url }}
        onError={handleLoadError}
      />
    </View>
  );
}
