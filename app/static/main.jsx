const Button = window.Reactstrap.Button;


const Collapse = window.Reactstrap.Collapse;
const Navbar = window.Reactstrap.Navbar;
const NavbarBrand = window.Reactstrap.NavbarBrand;
const Nav = window.Reactstrap.Nav;
const NavItem = window.Reactstrap.NavItem;
const NavLink = window.Reactstrap.NavLink;


const Router = window.ReactRouterDOM.BrowserRouter;
const Route = window.ReactRouterDOM.Route;
const ReactMarkdown = window.ReactMarkdown;

const Form = window.Reactstrap.Form;
const FormGroup = window.Reactstrap.FormGroup;
const Label = window.Reactstrap.Label;
const Input = window.Reactstrap.Input;


const UncontrolledDropdown = window.Reactstrap.UncontrolledDropdown;
const Dropdown = window.Reactstrap.Dropdown;
const DropdownToggle = window.Reactstrap.DropdownToggle;
const DropdownMenu = window.Reactstrap.DropdownMenu;
const DropdownItem = window.Reactstrap.DropdownItem;
const Spinner = window.Reactstrap.Spinner;



const axios = window.axios;

const Select = window.Select;


//import { Button } from 'reactstrap';

// Obtain the root 
const rootElement = document.getElementById('root');


class About extends React.Component {
    //

// Use the render function to return JSX component
    render() {
        return (

            
               
                <ReactMarkdown source={window.APP_CONFIG.about}/>
            
        );
    }
}


// Create a ES6 class component
class MainPage extends React.Component {
    //

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            predictions: [],
            imageSelected: false,
            url: null,
            isLoading: false,
            selectedOption: null,

        }
    }

    _onFileUpload = (event) => {
        this.setState({
            rawFile: event.target.files[0],
            file: URL.createObjectURL(event.target.files[0]),
            imageSelected: true
        })
    };

    _onUrlChange = (url) => {
        this.state.url = url;
        if ((url.length > 5) && (url.indexOf("http") === 0)) {
            this.setState({
                file: url,
                imageSelected: true
            })
        }
    };

    _clear = async (event) => {
        this.setState({
            file: null,
            imageSelected: false,
            predictions: [],
            rawFile: null,
            url: ""
        })
    };

    _predict = async (event) => {
        this.setState({isLoading: true});



        let resPromise = null;
        if (this.state.rawFile) {
            const data = new FormData();
            data.append('file', this.state.rawFile);
            resPromise = axios.post('/api/classify', data);
        } else {
            resPromise = axios.get('/api/classify', {
                params: {
                    url: this.state.file
                }
            });
        }

        try {
            const res = await resPromise;
            const payload = res.data;

            this.setState({predictions: payload.predictions, isLoading: false});
            console.log(payload)
        } catch (e) {
            alert(e)
        }
    };


    renderPrediction() {
        const predictions = this.state.predictions || [];

        if (predictions.length > 0) {

            const predictionItems = predictions.map((item) =>
            <table>
            <tr>
              <th>Type</th>
              <th>Percentage</th>
            </tr>
            <tr>
              <td>{item.class}</td>
              <td>({item.prob * 100}%)</td>
            
            </tr>
          </table>
        
                //<li>{item.class} ({item.prob * 100}%) </li>
            );

            return (
            
              
                <p>
                <h3>Results:</h3>
            
                {predictionItems}
                </p>

          
                
               
                
            )

        } else {
            return null
        }
    }

    handleChange = (selectedOption) => {
        this.setState({selectedOption});
        console.log(`Option selected:`, selectedOption);
    };

    sampleUrlSelected  = (item) => {
        this._onUrlChange(item.url);
    };
    render() {
        const sampleImages = APP_CONFIG.sampleImages;
        return (
            <div>
                <h2>{}</h2>


                <Form>
                    <FormGroup>
                        <div>
                        
                            <div>

                                <UncontrolledDropdown  direction="right" >
                                    <DropdownToggle caret >
                                        Sample Image Url
                                    </DropdownToggle>
                                    <DropdownMenu >
                                        {sampleImages.map(si =>
                                            <DropdownItem onClick={()=>this.sampleUrlSelected(si)}>
                                                {si.name}
                                            </DropdownItem>)
                                        }

                                    </DropdownMenu>
                                </UncontrolledDropdown>

                            </div>
                           
                        </div>
                    </FormGroup>
                    <div className="input-group">
                     <div className="input-group-prepend">
                      <span className="input-group-text"addonType="prepend" >
                            <i>Provide a Url</i>
                        </span>
                        </div>
                    <Input  value={this.state.url} name="file" onChange={(e)=>this._onUrlChange(e.target.value)} 
                    />
                       </div>

                       <div class="text-center">
                    <label>OR</label>
                   

                    <FormGroup id={"upload_button"}>
                       
                        <Label for="imageUpload">
                            <Input type="file" name="file" id="imageUpload" accept=".png, .jpg, .jpeg" ref="file"
                                   onChange={this._onFileUpload}/>
                            <span class=" btn btn-primary "> Select an Image</span>
                        </Label>
                    </FormGroup>
                    </div>

                    <img src={this.state.file} className={"img-preview"} hidden={!this.state.imageSelected}/>

                    <div class="text-center">
                    <FormGroup>
                        <Button color="success" onClick={this._predict}
                                disabled={this.state.isLoading} className="text-center"> Predict</Button>
                        <span className="p-1 "/>
                        <Button color="danger" onClick={this._clear} > Clear</Button>
                    </FormGroup>
                                        </div>
                                        <div class="text-center">
                    {this.state.isLoading && (
                        <div>
                            <Spinner color="info" type="grow" style={{width: '6rem', height: '6rem'}}/>
                        </div>
                    )}
 </div>
                </Form>
                    <div class="text-center">
                {this.renderPrediction()}
                        </div>
            </div>
        );
    }
}

// Create a function to wrap up your component
function App() {
    return (
        <Router>
            <div className="App">
                <div>
                    <main role="main" className="container">
                        <Route exact path="/" component={MainPage}/>
                    </main>
                </div>
            </div>
        </Router>
    )
}

(async () => {
    ReactDOM.render(
        <App/>,
        rootElement
    )
})();