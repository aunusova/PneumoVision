var el = x => document.getElementById(x);

function showPicker() {
    el("file-input").click();
  }

function showPicked(input) {
    var reader = new FileReader();
    reader.onload = function(e) {
      el("image-picked").src = e.target.result;
      el("image-picked").className = "";
    };
    reader.readAsDataURL(input.files[0]);
  }

function analyze() {
    var uploadFiles = el("file-input").files;
    if (uploadFiles.length !== 1) 
      alert("Пожалуйста выберите файл для анализа!");
  
    var xhr = new XMLHttpRequest();
    var loc = window.location;
    xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`,
      true);
    xhr.onerror = function() {
      alert(xhr.responseText);
    };
    xhr.onload = function(e) {
      if (this.readyState === 4) {
        var response = JSON.parse(e.target.responseText);
        el("result-label").innerHTML = `Result = ${response["result"]}`;
      }
    };
  
    var fileData = new FormData();
    fileData.append("file", uploadFiles[0]);
    xhr.send(fileData);
}