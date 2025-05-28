let model;
const classes = {
    0: 'Apple___Apple_scab',
    1: 'Apple___Black_rot',
    2: 'Apple___Cedar_apple_rust',
    3: 'Apple___healthy',
    4: 'Blueberry___healthy',
    5: 'Cherry_(including_sour)___Powdery_mildew',
    6: 'Cherry_(including_sour)___healthy',
    7: 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    8: 'Corn_(maize)___Common_rust_',
    9: 'Corn_(maize)___Northern_Leaf_Blight',
    10: 'Corn_(maize)___healthy',
    11: 'Grape___Black_rot',
    12: 'Grape___Esca_(Black_Measles)',
    13: 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    14: 'Grape___healthy',
    15: 'Orange___Haunglongbing_(Citrus_greening)',
    16: 'Peach___Bacterial_spot',
    17: 'Peach___healthy',
    18: 'Pepper,_bell___Bacterial_spot',
    19: 'Pepper,_bell___healthy',
    20: 'Potato___Early_blight',
    21: 'Potato___Late_blight',
    22: 'Potato___healthy',
    23: 'Raspberry___healthy',
    24: 'Soybean___healthy',
    25: 'Squash___Powdery_mildew',
    26: 'Strawberry___Leaf_scorch',
    27: 'Strawberry___healthy',
    28: 'Tomato___Bacterial_spot',
    29: 'Tomato___Early_blight',
    30: 'Tomato___Late_blight',
    31: 'Tomato___Leaf_Mold',
    32: 'Tomato___Septoria_leaf_spot',
    33: 'Tomato___Spider_mites Two-spotted_spider_mite',
    34: 'Tomato___Target_Spot',
    35: 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    36: 'Tomato___Tomato_mosaic_virus',
    37: 'Tomato___healthy'
};

// CSV data - mapping disease to treatment
const treatments = {
    "Apple___Apple_scab": "Use fungicides like captan or mancozeb, prune infected branches.",
    "Apple___Black_rot": "Apply fungicides such as thiophanate-methyl, avoid overhead irrigation.",
    "Apple___Cedar_apple_rust": "Use fungicides like myclobutanil, remove nearby juniper trees.",
    "Apple___healthy": "No treatment required.",
    "Blueberry___healthy": "No treatment required.",
    "Cherry_(including_sour)___Powdery_mildew": "Use fungicides like sulfur or copper-based products.",
    "Cherry_(including_sour)___healthy": "No treatment required.",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": "Use fungicides such as azoxystrobin, control crop residue.",
    "Corn_(maize)___Common_rust_": "Apply fungicides and plant resistant hybrids.",
    "Corn_(maize)___Northern_Leaf_Blight": "Apply foliar fungicides, rotate crops.",
    "Corn_(maize)___healthy": "No treatment required.",
    "Grape___Black_rot": "Prune and remove diseased plant material, apply fungicides.",
    "Grape___Esca_(Black_Measles)": "Prune out infected areas, apply fungicides.",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": "Apply fungicides and maintain good airflow around vines.",
    "Grape___healthy": "No treatment required.",
    "Orange___Haunglongbing_(Citrus_greening)": "No cure available, manage with pesticides and remove infected trees.",
    "Peach___Bacterial_spot": "Apply copper-based fungicides, avoid overhead irrigation.",
    "Peach___healthy": "No treatment required.",
    "Pepper,_bell___Bacterial_spot": "Use resistant varieties, apply copper-based bactericides.",
    "Pepper,_bell___healthy": "No treatment required.",
    "Potato___Early_blight": "Apply fungicides, practice crop rotation.",
    "Potato___Late_blight": "Use fungicides like mancozeb, ensure proper field drainage.",
    "Potato___healthy": "No treatment required.",
    "Raspberry___healthy": "No treatment required.",
    "Soybean___healthy": "No treatment required.",
    "Squash___Powdery_mildew": "Apply sulfur-based or potassium bicarbonate fungicides.",
    "Strawberry___Leaf_scorch": "Remove infected leaves, apply fungicides.",
    "Strawberry___healthy": "No treatment required.",
    "Tomato___Bacterial_spot": "Apply copper-based fungicides, avoid overhead irrigation.",
    "Tomato___Early_blight": "Apply fungicides, ensure good plant spacing for airflow.",
    "Tomato___Late_blight": "Use fungicides, destroy infected plants immediately.",
    "Tomato___Leaf_Mold": "Apply fungicides and ensure proper ventilation.",
    "Tomato___Septoria_leaf_spot": "Use fungicides and rotate crops annually.",
    "Tomato___Spider_mites Two-spotted_spider_mite": "Apply insecticidal soap or miticides.",
    "Tomato___Target_Spot": "Apply fungicides and remove infected leaves.",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "No treatment, use resistant varieties.",
    "Tomato___Tomato_mosaic_virus": "No treatment, remove infected plants.",
    "Tomato___healthy": "No treatment required."
};

// Function to load the TensorFlow model
async function loadModel() {
    try {
        model = await tf.loadGraphModel('./tfjs_model/model.json');
        const modelTag = document.getElementById('modelTag');
        modelTag.innerHTML = `<u>Use Model (Loaded!)</u>`;
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Failed to load model:', error);
    }
}

// Handle image upload and display
function handleImageUpload() {
    const imageInput = document.getElementById('imageInput');
    const imageContainer = document.getElementById('imageContainer');
    const file = imageInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                imageContainer.innerHTML = ''; // Clear previous image
                imageContainer.appendChild(img); // Display the uploaded image
            };

            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
}

// Detect image, make predictions, and display treatment
function detectImage() {
    if (!model) {
        console.error('Model not loaded yet');
        return;
    }
    const imageInput = document.getElementById('imageInput');
    const imageContainer = document.getElementById('imageContainer');
    const treatmentText = document.getElementById('treatmentText');
    const file = imageInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = async function (e) {
            const img = new Image();
            img.onload = async function () {
                // Convert the uploaded image to TensorFlow tensor for prediction
                const imageTensor = tf.browser.fromPixels(img)
                    .resizeNearestNeighbor([256, 256]) // Resize image to model input size
                    .toFloat()
                    .expandDims();
                const scaledImg = imageTensor;

                // Make predictions using the loaded model
                const prediction = await model.predict(scaledImg).data();
                
                // Debug: Log predictions
                console.log('Predictions:', prediction);
                
                const maxPredictionIndex = prediction.indexOf(Math.max(...prediction));
                const predictedClass = classes[maxPredictionIndex];

                // Debug: Log predicted class
                console.log('Predicted Class:', predictedClass);

                // Display predicted class and corresponding treatment
                imageContainer.innerHTML += `<p class='mt-2 fw-bold fs-1'>Predicted Class: ${predictedClass}</p>`;
                
                // Check if treatment exists for the predicted class
                const treatment = treatments[predictedClass];
                if (treatment) {
                    treatmentText.innerHTML = treatment;
                } else {
                    treatmentText.innerHTML = 'No treatment information available.';
                }
            };

            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
}

// Load the model and setup event listeners when the page is loaded
window.onload = function () {
    loadModel(); // Load the model
    document.getElementById('imageInput').addEventListener('change', handleImageUpload); // Add event listener for image upload
};
