import { useEffect, useState, useRef } from 'react';
import * as mobilenet from "@tensorflow-models/mobilenet";
import '@tensorflow/tfjs';
import './index.css'

function App() {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [predictions, setPredictions] = useState([]);

  const imageRef = useRef();

  const loadModel = async () => {
    try {
      const model = await mobilenet.load();
      setModel(model);
      console.log("Model loaded successfully");
    } catch (error) {
      console.error('Error loading model:', error);
    } finally {
      setIsModelLoading(false); // Set loading to false regardless of success or failure
    }
  };

  const uploadImage = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageURL(url);
      setPredictions([]); // Clear previous predictions when new image is uploaded
      console.log("Image uploaded successfully:", url);
    } else {
      setImageURL(null);
    }
  };

  const identifyImg = async () => {
    if (model && imageRef.current) {
      const results = await model.classify(imageRef.current);
      setPredictions(results);
      console.log(results);
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  return (
    <>
      <h1 className='header'>Image Identification</h1>
      <div className='inputHolder'>
        <input
          type='file'
          accept='image/*'
          capture='camera'
          className='uploadInput'
          onChange={uploadImage}
        />
      </div>
      <div className='mainWrapper'>
        <div className='mainContent'>
          <div className='imageHolder'>
            {imageURL && (
              <img
                src={imageURL}
                alt='upload preview'
                crossOrigin='anonymous'
                ref={imageRef}
                style={{ width: '300px', height: 'auto' }} // Optional: Set image size
              />
            )}
          </div>
        </div>
        {/* Show the button only if the model is loaded and an image is uploaded */}
        {imageURL && !isModelLoading && (
          <button className='button' onClick={identifyImg}>
            Identify Image
          </button>
        )}
        {isModelLoading && <p>Waiting for model or image...</p>}
      </div>
      {/* Display predictions if any */}
      {predictions.length > 0 && (
        <div className='predictions'>
          <h2>Predictions:</h2>
          <ul>
            {predictions.map((prediction, index) => (
              <li key={index}>
                {prediction.className}: {Math.round(prediction.probability * 100)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
