import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
  const [imageCara, setImageCara] = useState(null);
  const [imageDni, setImageDni] = useState(null);
  const [previewCara, setPreviewCara] = useState(null);
  const [previewDni, setPreviewDni] = useState(null);

  const handleImageCaraChange = (event) => {
    const file = event.target.files[0];
    setImageCara(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewCara(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewCara(null);
    }
  };

  const handleImageDniChange = (event) => {
    const file = event.target.files[0];
    setImageDni(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewDni(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewDni(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('imagen_cara', imageCara);
    formData.append('imagen_dni', imageDni);
    try {
      const response = await axios.post('http://127.0.0.1:5000/face/compare', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      // Aquí puedes manejar la respuesta, mostrarla al usuario, etc.
    } catch (error) {
      console.error('Error al enviar las imágenes:', error);
    }
  };

  return (
    <form className='flex items-center justify-center flex-col' onSubmit={handleSubmit}>
      <div>
        <h1>Sube la imagen de tu cara</h1>
        <input type="file" onChange={handleImageCaraChange} accept="image/*" />
        {previewCara && <img src={previewCara} alt="Preview Cara" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
      </div>
      <div>
        <h1>sube la imagen de tu cara</h1>
        <input type="file" onChange={handleImageDniChange} accept="image/*" />
        {previewDni && <img src={previewDni} alt="Preview DNI" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
      </div>
      <button type="submit">Comparar</button>
    </form>
  );
}

export default ImageUpload;
