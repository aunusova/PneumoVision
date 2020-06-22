var el = x => document.getElementById(x);

function showPicker() {
    el("file-input").click();
  }

function showPicked(input) {
    el("upload-label").innerHTML = input.files[0].name;
    var reader = new FileReader();
    reader.onload = function(e) {
      el("image-picked").src = e.target.result;
      el("image-picked").className = "";
    };
    reader.readAsDataURL(input.files[0]);
  }

function analyze() {
    var uploadFiles = el("file-input").files;
    if (uploadFiles.length !== 1) alert("Please select a file to analyze!");
  
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

    this.state = {
        file: null,
        predictions: [],
        imageSelected: false,
        url: null,
        isLoading: false,
        selectedOption: null,
    }

_onFileUpload = (event) => {
    this.setState({
        rawFile: event.target.files[0],
        file: URL.createObjectURL(event.target.files[0]),
        imageSelected: true
    })
}

_onUrlChange = (url) => {
    this.state.url = url;
    if ((url.length > 5) && (url.indexOf("http") === 0)) {
        this.setState({
            file: url,
            imageSelected: true
        })
    }
}

function boo() {
    (e)=>this._onUrlChange(e.target.value)
}