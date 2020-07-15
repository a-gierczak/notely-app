import { AsyncStorage } from 'react-native';
import { store } from 'src/store';

function bindNetworkDevtools() {
  global.XMLHttpRequest = global.originalXMLHttpRequest
    ? global.originalXMLHttpRequest
    : global.XMLHttpRequest;

  global.FormData = global.originalFormData
    ? global.originalFormData
    : global.FormData;

  fetch; // Ensure to get the lazy property

  if (window.__FETCH_SUPPORT__) {
    // it's RNDebugger only to have
    window.__FETCH_SUPPORT__.blob = false;
  } else {
    /*
    * Set __FETCH_SUPPORT__ to false is just work for `fetch`.
    * If you're using another way you can just use the native Blob and remove the `else` statement
    */
    global.Blob = global.originalBlob ? global.originalBlob : global.Blob;
    global.FileReader = global.originalFileReader
      ? global.originalFileReader
      : global.FileReader;
  }
}

// bindNetworkDevtools();

const asyncStorage = {
  clear: () => {
    AsyncStorage.clear().then(() => {
      console.log('Async storage cleared');
    });
  },

  getItem: (key) => {
    AsyncStorage.getItem(key).then(value => console.log(value));
  },

  setItem: (key, value) => {
    if (key === undefined || value === undefined) {
      console.error('You have to provide key and value');
    }

    AsyncStorage.setItem(key, value).then(() => {
      console.log('Async storage key set');
    });
  }
};

Object.defineProperty(window, 'debug', {
  get() {
    return {
      store: store.getState(),
      storage: asyncStorage,
    };
  },
});
