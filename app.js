const imageInput = document.getElementById("imageInput");
const quality = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const controls = document.getElementById("controls");
const compressBtn = document.getElementById("compressBtn");
const result = document.getElementById("result");
const originalSize = document.getElementById("originalSize");
const compressedSize = document.getElementById("compressedSize");
const savedPercent = document.getElementById("savedPercent");
const downloadBtn = document.getElementById("downloadBtn");

let selectedFile = null;

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + " KB";
  }
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

quality.addEventListener("input", () => {
  qualityValue.textContent = quality.value;
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];

  if (!file) return;

  if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
    alert("Please select a JPG, PNG or WebP image.");
    imageInput.value = "";
    return;
  }

  selectedFile = file;
  controls.classList.remove("hidden");
  result.classList.add("hidden");
});

compressBtn.addEventListener("click", () => {
  if (!selectedFile) return;

  compressBtn.disabled = true;
  compressBtn.textContent = "Compressing...";

  const reader = new FileReader();

  reader.onload = (event) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const selectedQuality = Number(quality.value) / 100;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            alert("Compression failed. Please try another image.");
            compressBtn.disabled = false;
            compressBtn.textContent = "Compress Image";
            return;
          }

          const saved =
            selectedFile.size > 0
              ? Math.max(
                  0,
                  ((selectedFile.size - blob.size) / selectedFile.size) * 100
                )
              : 0;

          originalSize.textContent = formatBytes(selectedFile.size);
          compressedSize.textContent = formatBytes(blob.size);
          savedPercent.textContent = saved.toFixed(1) + "%";

          const url = URL.createObjectURL(blob);

          downloadBtn.href = url;
          downloadBtn.download =
            "compressed-" + selectedFile.name.replace(/\.[^/.]+$/, "") + ".jpg";

          result.classList.remove("hidden");

          compressBtn.disabled = false;
          compressBtn.textContent = "Compress Image";
        },
        "image/jpeg",
        selectedQuality
      );
    };

    img.onerror = () => {
      alert("Unable to read this image.");
      compressBtn.disabled = false;
      compressBtn.textContent = "Compress Image";
    };

    img.src = event.target.result;
  };

  reader.readAsDataURL(selectedFile);
});
