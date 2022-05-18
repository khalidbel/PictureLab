const sepiaButton = document.querySelector('#sepia');
const solarizeButton = document.querySelector('#solarize');
const invertButton = document.querySelector('#invert');
const greyscaleButton = document.querySelector('#greyscale');
const brightness = document.querySelector('#brightness');
const saturation = document.querySelector('#saturation');
const contrast = document.querySelector('#contrast');
const temperature = document.querySelector('#temperature');
const blurSlider = document.querySelector('#blur');
const sharpnessSlider = document.querySelector('#sharpness');

const uploadFile = document.querySelector('#upload-file');

const resetButton = document.querySelector('#reset');
const saveButton = document.querySelector('#save');
const loadButton = document.querySelector('#load');


const input = document.querySelector('.editor-upload-button');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const DIMENSION = 800;
canvas.width = DIMENSION;
canvas.height = DIMENSION;

const filters = {
  sepia: false,  
  greyscale: false,
  invert: false,
  solarize: false
};

const adjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  temperature: 0,
  blur: 0,
  sharpness: 0
};


window.onload = (e) => {
  saveButton.disabled = true;
};


const image = new Image();
image.onload = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  input.classList.add('no-display');
  canvas.classList.remove('no-display');
  drawImage(image);
  saveButton.disabled = false;
}



const drawImage = (img) => {
  let ratio;
  const padding = (img.width - img.height) / 2 ;
  let dx, dy, dWidth, dHeight;
  if(padding >= 0) {
    dx = 0; 
    dy = Math.abs(padding) * canvas.width / img.width ;
    dWidth = canvas.width;
    ratio = img.height / img.width;
    dHeight = canvas.height * ratio;
  } else {
    dx =  Math.abs(padding) * canvas.height / img.height;
    dy = 0;
    ratio = img.width / img.height;
    dWidth = canvas.width * ratio;
    dHeight = canvas.height ;
  }
  ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy, dWidth, dHeight);
}


const saveImage = (canvas) => {

  let imageLink = document.createElement('a');
  imageLink.download = 'EditedImage.png';
  imageLink.href = canvas.toDataURL('image/png')
  imageLink.click();
  
}

const adjustBrightness = (brightnessValue) => {

  const myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < myImageData.data.length; i += 4) {
    myImageData.data[i  ] = (myImageData.data[i  ] + brightnessValue);     
    myImageData.data[i+1] = (myImageData.data[i+1] + brightnessValue); 
    myImageData.data[i+2] = (myImageData.data[i+2] + brightnessValue); 
  }
  ctx.putImageData(myImageData, 0, 0);
}

const adjustSaturation = (saturationValue) => {

  const myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = myImageData.data;

  // luminance vector of rgb

  const luminanceRed = 0.3086; 
  const luminanceGreen = 0.6094;
  const luminanceBlue = 0.0820;

  // the modified luminance values based on saturation value
   
  const sRed = (1 - saturationValue)*luminanceRed + saturationValue;
  const sGreen = (1 - saturationValue)*luminanceGreen + saturationValue;
  const sBlue = (1 - saturationValue)*luminanceBlue + saturationValue;
  const mRed = (1 - saturationValue)*luminanceRed;
  const mGreen = (1 - saturationValue)*luminanceGreen;
  const mBlue = (1 - saturationValue)*luminanceBlue;
  

  let i;
  for(i = 0; i < data.length; i += 4)
  {
    const red   = data[i]; 
    const green = data[i+1];
    const blue  = data[i+2];

    const saturatedRed = (sRed*red + mGreen*green + mBlue*blue);
    const saturatedGreen = (mRed*red + sGreen*green + mBlue*blue);
    const saturatedBlue = (mRed*red + mGreen*green + sBlue*blue);

    data[i] = saturatedRed;
    data[i+1] = saturatedGreen;
    data[i+2] = saturatedBlue;
  }
        
  ctx.putImageData(myImageData, 0, 0);
}

const adjustContrast = (contrastValue) => { 
  // drawImage(image);
  const myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  contrastValue = (contrastValue/100) + 1;  
  const interceptValue = 128 * (1 - contrastValue);

  for(let i = 0; i < myImageData.data.length; i += 4){   
      myImageData.data[i  ] = myImageData.data[i  ]*contrastValue + interceptValue;
      myImageData.data[i+1] = myImageData.data[i+1]*contrastValue + interceptValue;
      myImageData.data[i+2] = myImageData.data[i+2]*contrastValue + interceptValue;
  }
  ctx.putImageData(myImageData, 0, 0);
}
const adjustTemperature = (tempValue) => { 

  const myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for(let i = 0; i < myImageData.data.length; i += 4){   
      myImageData.data[i  ] = myImageData.data[i  ] + tempValue;
      myImageData.data[i+1] = myImageData.data[i+1] 
      myImageData.data[i+2] = myImageData.data[i+2] - tempValue;
  }
  ctx.putImageData(myImageData, 0, 0);
}

const invert = () => {
  const myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < myImageData.data.length; i += 4) {
      myImageData.data[i]   = 255 - myImageData.data[i];     
      myImageData.data[i+1] = 255 - myImageData.data[i+1]; 
      myImageData.data[i+2] = 255 - myImageData.data[i+2]; 
    }
  ctx.putImageData(myImageData, 0, 0);
}



const sepia = () => {
  const myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const tmpData = [...myImageData.data];
    
    for (let i = 0; i < myImageData.data.length; i += 4) {
      myImageData.data[i]   = 0.393*tmpData[i] + 0.769*tmpData[i+1] + 0.189*tmpData[i+2]; 
      myImageData.data[i+1] = 0.349*tmpData[i] + 0.686*tmpData[i+1] + 0.168*tmpData[i+2];
      myImageData.data[i+2] = 0.272*tmpData[i] + 0.534*tmpData[i+1] + 0.131*tmpData[i+2]; 
    }

  ctx.putImageData(myImageData, 0, 0);

}

const solarize = (threshold) => {
  const myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < myImageData.data.length; i += 4) {
      myImageData.data[i]   = myImageData.data[i] < threshold ? 255 - myImageData.data[i] : myImageData.data[i];     
      myImageData.data[i+1] = myImageData.data[i+1] < threshold ? 255 - myImageData.data[i+1] : myImageData.data[i+1];
      myImageData.data[i+2] = myImageData.data[i+2] < threshold ? 255 - myImageData.data[i+2] : myImageData.data[i+2]; 
    }
  ctx.putImageData(myImageData, 0, 0);
}

const greyscale = () => {
  const myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < myImageData.data.length; i += 4) {
      const greyValue = (myImageData.data[i] +myImageData.data[i+1] + myImageData.data[i+2])/3;
      myImageData.data[i]   = greyValue;     
      myImageData.data[i+1] = greyValue; 
      myImageData.data[i+2] = greyValue; 
    }
  ctx.putImageData(myImageData, 0, 0);
}


// low pass filters
const boxBlurKernel = [
  1/9, 1/9, 1/9,
  1/9, 1/9, 1/9,
  1/9, 1/9, 1/9
];

const gaussianBlurKernel = [
  1/16, 1/8, 1/16,
  1/8,  1/4, 1/8,
  1/16, 1/8, 1/16
];

//high pass filters

const sharpenKernel =  [
  -1, -1,  -1,
  -1,  9,  -1,
  -1, -1,  -1
];

// for edge detection 

const horizontalSobelKernel =  [
   1,  2,   1,
   0,  0,   0,
  -1, -2,  -1
];

const verticalSobelKernel =  [
  -1,  0,   1,
  -2,  0,   2,
  -1,  0,   1
];



const convolveImage = (kernel) => {
  const myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = myImageData.data;
  const newData = Uint8ClampedArray.from(data);

  
  
  const cWidth = myImageData.width;
  let i, j;
  
  for(i = 0; i < data.length; i++){
    if (i % 4 === 3) { continue; }
      data[i] = (
          ((newData[i - (4*cWidth) - 4]  || newData[i]) * kernel[0]) // up left
        + ((newData[i - (4*cWidth)    ]  || newData[i]) * kernel[1]) // up center
        + ((newData[i - (4*cWidth) + 4]  || newData[i]) * kernel[2]) // up right
        + ((newData[i - 4             ]  || newData[i]) * kernel[3]) // center left
        +  (newData[i                 ]                 * kernel[4]) // center
        + ((newData[i + 4             ]  || newData[i]) * kernel[5]) // center right
        + ((newData[i + (4*cWidth) - 4]  || newData[i]) * kernel[6]) // down left
        + ((newData[i + (4*cWidth)    ]  || newData[i]) * kernel[7]) // down center
        + ((newData[i + (4*cWidth) + 4]  || newData[i]) * kernel[8]) // down right
        ); 
  }
  ctx.putImageData(myImageData, 0, 0);
  
}

const applyModifications = () => {
  drawImage(image);
  if(adjustments.brightness) adjustBrightness(adjustments.brightness);
  if(adjustments.contrast) adjustContrast(adjustments.contrast);
  if(adjustments.saturation) adjustSaturation(adjustments.saturation);
  if(adjustments.temperature) adjustTemperature(adjustments.temperature);
  if(adjustments.blur) for (let r = 0; r < adjustments.blur; r++)  convolveImage(boxBlurKernel); 
  if(adjustments.sharpness) for (let r = 0; r < adjustments.sharpness; r++)  convolveImage(sharpenKernel); 
  if(filters.sepia) sepia();
  if(filters.greyscale) greyscale();
  if(filters.invert) invert();
  if(filters.solarize) solarize(128);
}
  
 
uploadFile.addEventListener("change", (e) => {
  const reader = new FileReader();
  const file = e.target.files[0];
  reader.onload = (e) => {
    image.src = e.target.result;        
  }
  reader.readAsDataURL(file);
});

loadButton.addEventListener("click", () => {
  uploadFile.click();
});

brightness.addEventListener('input', () => {
    adjustments.brightness = +brightness.value;
    applyModifications();
});

saturation.addEventListener('input', () => {
    adjustments.saturation = +saturation.value;
    applyModifications();


});

contrast.addEventListener('input', () => {
    adjustments.contrast = +contrast.value;
    applyModifications();


});

temperature.addEventListener('input', () => {
    adjustments.temperature = +temperature.value;
    applyModifications();


});

blurSlider.addEventListener('change', () => {
  adjustments.blur = Math.ceil(+blurSlider.value);
  applyModifications();

 
});

sharpnessSlider.addEventListener('change', () => {
  drawImage(image);
  adjustments.sharpness = Math.ceil(+sharpnessSlider.value);
  applyModifications();

 
});

invertButton.addEventListener('click', () => {
  filters.invert = invertButton.checked;
  applyModifications();

});

solarizeButton.addEventListener('click', () => {
  
  filters.solarize = solarizeButton.checked;
  applyModifications();


});

sepiaButton.addEventListener('click', () => {
  
  filters.sepia = sepiaButton.checked;
  applyModifications();


  
});

greyscaleButton.addEventListener('click', () => {
 
  filters.greyscale = greyscaleButton.checked;
  applyModifications();


});


resetButton.addEventListener('click', () => {

  //reset interface values


  brightness.value = 0;
  contrast.value = 0;
  saturation.value = 0;
  temperature.value = 0;
  blurSlider.value = 0;
  sharpnessSlider.value = 0;

  sepiaButton.checked = false;  
  greyscaleButton.checked = false;
  invertButton.checked = false;
  solarizeButton.checked = false;

  //reset filter objects values


  adjustments.brightness = 0;
  adjustments.contrast = 0;
  adjustments.saturation = 0;
  adjustments.temperature = 0;
  adjustments.blur = 0;
  adjustments.sharpness = 0;

  filters.sepia = false;
  filters.greyscale = false;
  filters.invert = false;
  filters.solarize = false;
  
  drawImage(image);
});

saveButton.addEventListener('click', () => {
  saveImage(canvas);
});


