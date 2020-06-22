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