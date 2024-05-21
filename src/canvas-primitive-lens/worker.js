self.onmessage = async (event) => {
  if (event.data.canvas) {
    canvas = event.data.canvas;

    console.log('WORKER 1 ', canvas);
  }
};
