export const uploadFile = (
  url: string,
  imageUri: string,
  fileName: string,
): Promise<void> =>
  new Promise((resolve, reject) => {
    // for unknown reason, this only works with XHR
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status === 200) {
        resolve();
      } else {
        reject(xhr.response);
      }
    };

    xhr.setRequestHeader('Content-Type', 'image/jpeg');
    xhr.send({ uri: imageUri, type: 'image/jpeg', name: fileName });
  });
