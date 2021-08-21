import * as tf from "@tensorflow/tfjs";
/*
    NOT OPTIMAL YET - too much training happening. 

    Anything with tf.vis is a tensorflow visualtion and will need to be modified into X & Y coordinates 
    for react-graph

    Need to find .json and test some data

    Duration of training still unknown
*/

async function getData() {
  const dataResponse = await fetch(/*Insert .json File Here get from Azure?*/);
  const data = await dataResponse.json();
  const cleanedData = data
    .map((assessmentData) => ({
      grade: assessment.Grade,
      date: assessment.Date,
    }))
    .filter(
      (assessmentData) => assessment.Grade != null && assessment.Date != null
    );

  return cleaned;
}

async function run() {
  // Load and plot the original input data that we are going to train on.
  const data = await getData();
  const values = data.map((d) => ({
    x: d.Date,
    y: d.Grade,
  }));

  tfvis.render.scatterplot(
    { name: "Date v Grade" },
    { values },
    {
      xLabel: "Date of Assessment",
      yLabel: "Grade",
      height: 300,
    }
  );
}

document.addEventListener("DOMContentLoaded", run);

function createModel() {
  const model = tf.sequential();

  model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));

  model.add(tf.layers.dense({ units: 1, useBias: true }));

  return model;
}

//Model Creation

const model = createModel();

tfvis.show.modelSummary(
  {
    name: "Model Summary",
  },
  model
);

function convertToTensor(data) {
  return tf.tidy(() => {
    tf.util.shuffle(data);

    //Data to Tensor
    const inputs = data.map((d) => d.Date);
    const labels = data.map((d) => d.Grade);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    //Normalizing the data to the range 0 - 1 using min-max scaling
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor
      .sub(inputMin)
      .div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor
      .sub(labelMin)
      .div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      // Return the min/max bounds so we can use them later.
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    };
  });
}

async function trainModel(model, inputs, labels) {
  // Prepare the model for training.
  model.compile({
    optimizer: tf.train.adam(), //Adam NN model (may change)
    loss: tf.losses.meanSquaredError,
    metrics: ["mse"], //Not sure about this
  });

  const batchSize = 32;
  const epochs = 50;

  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      { name: "Training Performance" },
      ["loss", "mse"],
      { height: 200, callbacks: ["onEpochEnd"] }
    ),
  });
}

function testModel(model, inputData, normalizationData) {
  const { inputMax, inputMin, labelMin, labelMax } = normalizationData;

  //Invert Min Max Scale to un-normalize
  const [xs, preds] = tf.tidy(() => {
    const xs = tf.linspace(0, 1, 100);
    const preds = model.predict(xs.reshape([100, 1]));

    const unNormXs = xs.mul(inputMax.sub(inputMin)).add(inputMin);

    const unNormPreds = preds.mul(labelMax.sub(labelMin)).add(labelMin);

    // Un-normalize the data
    return [unNormXs.dataSync(), unNormPreds.dataSync()];
  });

  const predictedPoints = Array.from(xs).map((val, i) => {
    return { x: val, y: preds[i] };
  });

  const originalPoints = inputData.map((d) => ({
    x: d.Date,
    y: d.Grade,
  }));

  tfvis.render.scatterplot(
    { name: "Model Predictions vs Original Data" },
    {
      values: [originalPoints, predictedPoints],
      series: ["original", "predicted"],
    },
    {
      xLabel: "Date",
      yLabel: "Grade",
      height: 300,
    }
  );
}
