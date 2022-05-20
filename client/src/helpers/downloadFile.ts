function previewFile(preview: HTMLImageElement, file: any) {
  const reader = new FileReader();
  let blob;
  reader.onloadend = function () {
    if (reader.result) {
      blob = new Blob([reader.result], { type: "image/jpg" });
    }
  };

  if (file) {
    reader.readAsArrayBuffer(file);
  }
  return blob;
}

export { previewFile };
