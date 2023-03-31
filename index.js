const { createWorker } = require("tesseract.js");
async function extractTextFromImage(imagePath) {
  const worker = createWorker({ spawnWorker: true });
  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  const {
    data: { text },
  } = await worker.recognize(imagePath);
  await worker.terminate();
  return text;
}
extractTextFromImage("public/image.jpg")
  .then((text) => {
    text.split("\n").forEach((element) => {
      console.log(element);
    });
  })
  .catch((error) => console.error(error));
