const image_input = document.querySelector('#image-input');
let canvas = document.getElementById('canvas');

function drawImageFromWebUrl(sourceurl) {
  let img = new Image();

  img.addEventListener('load', function () {
    // The image can be drawn from any source, the canvas will be filled with the image.
    canvas
      .getContext('2d')
      .drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
  });

  img.setAttribute('src', sourceurl);
}

image_input.addEventListener('change', function () {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    const uploaded_image = reader.result;
    drawImageFromWebUrl(uploaded_image);
  });
  reader.readAsDataURL(this.files[0]);
});

function getElementPosition(obj) {
  let curleft = 0,
    curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while ((obj = obj.offsetParent));
    return { x: curleft, y: curtop };
  }
  return undefined;
}

function getEventLocation(element, event) {
  // Relies on the getElementPosition function.
  let pos = getElementPosition(element);

  return {
    x: event.pageX - pos.x,
    y: event.pageY - pos.y,
  };
}

let mainColorToDelete = ['0', '0', '0'];
let visited = {};

const isSimilar = c => {
  for (let i = 0; i < 3; i++) if (c[i] !== mainColorToDelete[i]) return false;

  return true;
};

const getColor = (x, y) => {
  let context = canvas.getContext('2d');
  let pixelData = context.getImageData(x, y, 1, 1).data;

  return pixelData;
};

const setPixelWithTransparent = (x, y) => {
  //Access the canvas

  let context = canvas.getContext('2d');
  // let pixelData = context.getImageData(x, y, 1, 1);

  // pixelData.data[0] = 0;
  // pixelData.data[1] = 0;
  // pixelData.data[2] = 0;

  // context.putImageData(pixelData, 0, 0);

  context.fillStyle =
    'rgba(' + 255 + ',' + 255 + ',' + 255 + ',' + 255 / 255 + ')';
  context.fillRect(x, y, 1, 1);
};

const solve = (x, y) => {
  debugger;
  if (!visited[x]) visited[x] = { [y]: false };

  if (visited[x][y]) return;

  const color = getColor(x, y);

  if (!isSimilar(color)) return;

  setPixelWithTransparent(x, y);
  visited[x][y] = true;

  solve(x + 1, y);
  solve(x - 1, y);
  solve(x, y + 1);
  solve(x, y - 1);
};

canvas.addEventListener(
  'click',
  function (event) {
    const clr = [255, 255, 255];
    // Get the coordinates of the click
    let eventLocation = getEventLocation(this, event);
    let coord = 'x' + eventLocation.x + ', y=' + eventLocation.y;
    // Get the data of the pixel according to the location generate by the getEventLocation function
    let context = this.getContext('2d');
    let pixelData = context.getImageData(
      eventLocation.x,
      eventLocation.y,
      1,
      1
    ).data;

    visited = {};
    mainColorToDelete = pixelData;

    solve(eventLocation.x, eventLocation.y);
  },
  false
);
