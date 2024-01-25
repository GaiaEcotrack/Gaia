import React from 'react'
import html2canvas from 'html2canvas';
import './App.css'
import { useRef, useState} from 'react';

const Face = () => {
    
    const videoRef = useRef();
    const imgRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
  
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };
  
    const takeSnapshot = () => {
      html2canvas(videoRef.current).then((canvas) => {
        const imageBase64 = canvas.toDataURL('image/png');
        setCapturedImage(imageBase64);
      });
    };

  return (
    <div className='flex flex-col items-center justify-center'>
      <button onClick={startCamera}>Abrir Cámara</button>
      <video ref={videoRef} autoPlay playsInline style={{ display: 'block', margin: '10px 0' }} />
      <button onClick={takeSnapshot}>Tomar Foto</button>
      {capturedImage && <img ref={imgRef} src={capturedImage} alt="Captured" />}
    </div>
  )
}

export default Face