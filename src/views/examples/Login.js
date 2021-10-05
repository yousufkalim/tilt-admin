import React from "react";
import WebServicesManager from "../../WebServiceManager/WebServicesManager";
import Utilities from "../../Utilities/Utilities";
import jwtDecode from "jwt-decode";
import { Base64 } from "js-base64";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";

class Login extends React.Component {
  WebServicesManager = new WebServicesManager();

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }
  // handler for all fields change
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {});
  };
  validationCheck(state) {
    if (Utilities.ValidateEmail(state.email)) {
      this.setState({ emailError: "" });
      if (Utilities.isValidString(state.password)) {
        this.setState({ passwordError: "", isLoading: true });
      } else {
        this.setState({ passwordError: "Password is Invaild" });
      }
    } else {
      this.setState({ emailError: "Email is Invaild" });
    }
  }

  LogIn = (e) => {
    this.validationCheck(this.state);
    e.preventDefault();
    const info = {
      email: this.state.email,
      password: this.state.password,
    };
    //debugger;;
    var dataToLogIn = JSON.stringify(info);

    this.WebServicesManager.LogIn(
      { endPoint: "auth/login", dataToLogIn: dataToLogIn },
      (statusCode, response) => {
        if (response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          if (response.user.role === "admin") {
            this.props.history.push("/admin/index");
          } else {
            window.alert("Something went wrong");
          }
        } else {
          window.alert("Something went wrong");
        }
      }
    );
  };
  componentWillMount() {
    const user = localStorage.getItem("token");
    //debugger;;
    if (user) {
      window.location.replace("/admin/index");
    }
  }
  functionData(response) {
    var decoded = jwtDecode(response);
    var userinfo = JSON.parse(Base64.decode(decoded.userData));
    localStorage.setItem("getRatings", "true");
    localStorage.setItem("userdata", response);
    localStorage.setItem("firstVisit", 0);
    this.props.history.push(`/admin/index`);
  }
  passwordShow = () => {
    this.setState({ passwordShow: false, typeChng: "text" });
  };
  passwordHide = () => {
    this.setState({ passwordShow: true, typeChng: "password" });
  };

  render() {
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            {/* <CardHeader className="bg-transparent pb-5"> */}
            {/* <div className="text-muted text-center mt-2 mb-3">
                <small>Sign in with</small>
              </div>
              <div className="btn-wrapper text-center">
                <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/github.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Github</span>
                </Button>
                <Button
                  className="btn-neutral btn-icon"
                  color="default"
                  href="#pablo"
                  onClick={e => e.preventDefault()}
                >
                  <span className="btn-inner--icon">
                    <img
                      alt="..."
                      src={require("assets/img/icons/common/google.svg")}
                    />
                  </span>
                  <span className="btn-inner--text">Google</span>
                </Button>
              </div> */}
            {/* </CardHeader> */}
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>SIGN IN</small>
              </div>
              <Form role="form">
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      name="email"
                      onChange={this.handleChange}
                      type="email"
                      autoComplete="new-email"
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      name="password"
                      onChange={this.handleChange}
                      autoComplete="new-password"
                    />
                  </InputGroup>
                </FormGroup>
                <div className="custom-control custom-control-alternative custom-checkbox">
                  <input
                    className="custom-control-input"
                    id=" customCheckLogin"
                    type="checkbox"
                  />
                  <label
                    className="custom-control-label"
                    htmlFor=" customCheckLogin"
                  >
                    <span className="text-muted">Remember me</span>
                  </label>
                </div>
                <div className="text-center">
                  <Button
                    className="my-4"
                    color="primary"
                    type="button"
                    onClick={this.LogIn}
                  >
                    Sign in
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <small>Forgot password?</small>
              </a>
            </Col>
            {/* <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="#pablo"
                onClick={e => e.preventDefault()}
              >
                <small>Create new account</small>
              </a>
            </Col> */}
          </Row>
        </Col>
      </>
    );
  }
}

export default Login;
