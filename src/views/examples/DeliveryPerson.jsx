import React from "react";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import WebServicesManager from "../../WebServiceManager/WebServicesManager";
import { Modal, Button, Form } from "react-bootstrap";
import Translation from "../../Utilities/translation";

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
// core components
import CustomHeader from "components/Headers/CustomHeader.js";

const columns = [
  { title: Translation["First Name"] },
  { title: Translation["Last Name"] },
  { title: Translation["Email"] },
  { title: Translation["Block"] },
  { title: Translation["Actions"] },
];

class DeliveryPerson extends React.Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      showAdd: false,
      updateUser: false,
      deleteUser: false,
      didUpdate: false,
      setBtnDisable: false,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      currId: "",
    };
  }

  handleClose = () => {
    this.setState({ showAdd: false });
  };
  handleUpdateClose = () => {
    this.setState({ updateUser: false });
    this.handleResetState();
  };
  componentDidMount() {
    this.handleLoadData();
  }

  handleLoadData = () => {
    this.setState({ userList: [] });
    var tokn = localStorage.getItem("token");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "deliveryuser",
        token: tokn,
      },
      (statusCode, response) => {
        var userDatais = [];
        response.users.map((item) => {
          //debugger;;
          if (item.status !== "deleted") {
            userDatais.push([
              item.firstName,
              item.lastName,
              item.email,
              item.block.length !== 0
                ? item.block.map((b) => {
                    return b.name + " ";
                  })
                : Translation["No Block Assigned"],
              item._id,
            ]);
          }
        });
        this.setState({ userList: userDatais }, () => {
          // console.log('response state',this.state.userList);
        });
      }
    );
  };
  // handle delete function
  handleDelete = (id) => {
    const confirmis = window.confirm(
      Translation["Are you sure you want to delete this delivery person?"]
    );

    if (confirmis === true) {
      this.WebServicesManager.DeleteApiInURL(
        {
          endPoint: "deliveryuser/delete",
          dataToDelete: id,
          token: localStorage.getItem("token"),
        },
        (statusCode, response) => {
          this.handleLoadData();
        }
      );
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.handleBtnDisable();
    });
  };

  handleUpdateUser = (id) => {
    //debugger;;
    var tokn = localStorage.getItem("token");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "user/getbyid/" + id,
        // dataToFetch:id,
        token: tokn,
      },
      (statusCode, response) => {
        //debugger;;
        const { email, firstName, lastName } = response.user;
        this.setState({
          firstName,
          lastName,
          email,
          currId: id,
          updateUser: true,
        });
      }
    );
  };

  handleResetState = () => {
    this.setState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      currId: "",
      password: "",
      updateUser: false,
    });
  };

  handleUpdateSubmit = () => {
    const { currId, firstName, lastName, email } = this.state;
    const info = {
      firstName,
      lastName,
      email,
    };

    const dataToUpdate = JSON.stringify(info);
    this.setState({ setBtnDisable: true }, () => {
      this.WebServicesManager.putApi(
        {
          endPoint: "user/edit",
          userID: currId,
          dataToUpdate: dataToUpdate,
          token: localStorage.getItem("token"),
        },
        (statusCode, responseUpdate) => {
          if (responseUpdate.message) {
            this.setState({ setBtnDisable: false }, () => {
              window.alert(responseUpdate.message);
            });
          } else {
            this.handleResetState();
            this.handleLoadData();
          }
        }
      );
    });
  };

  handleAdd = () => {
    //debugger;;
    const { firstName, lastName, email, password } = this.state;
    const info = {
      firstName,
      lastName,
      email,
      password,
    };
    const dataToUpdate = JSON.stringify(info);
    this.setState({ setBtnDisable: true }, () => {
      this.WebServicesManager.postApiCall(
        {
          endPoint: "deliveryuser",
          dataToInsert: dataToUpdate,
          token: localStorage.getItem("token"),
        },
        (statusCode, responseUpdate) => {
          if (responseUpdate.message) {
            this.setState({ setBtnDisable: false }, () => {
              window.alert(responseUpdate.message);
            });
          } else {
            this.handleClose();
            this.handleResetState();
            this.handleLoadData();
          }
        }
      );
    });
  };

  handleBtnDisable = () => {
    const { firstName, lastName } = this.state;
    if (firstName !== "" && lastName !== "") {
      this.setState({
        setBtnDisable: false,
      });
    } else {
      this.setState({
        setBtnDisable: true,
      });
    }
  };
  render() {
    const actionsList = {
      addAction: () => {
        this.setState({ showAdd: true });
      },
      updateAction: (id) => this.handleUpdateUser(id),
      deleteAction: (id) => this.handleDelete(id),
    };

    return (
      <>
        <CustomHeader />
        {/* Page content */}
        <Container fluid className="mt-2">
          {/* Table */}
          <>
            {this.state.userList.length > 0 ? (
              <DataTableComponent
                actionCol={4}
                columns={columns}
                data={this.state.userList}
                actions={actionsList}
              />
            ) : (
              <>
                <Row style={{ flexDirection: "row-reverse" }}>
                  <Button
                    vairent="primary"
                    className="AddBtn"
                    onClick={() => {
                      this.setState({ showAdd: true });
                    }}
                  >
                    {Translation["Add"]}
                  </Button>
                </Row>
                <hr />
                <p style={{ textAlign: "center" }}>
                  {Translation["No Record Found"]}
                </p>
              </>
            )}
          </>
        </Container>
        {/* // ADD User  */}
        <Modal show={this.state.showAdd} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{Translation["Add Delivery Person"]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>{Translation["First Name"]}</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                placeholder={Translation["Enter First Name"]}
                value={this.state.firstName}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>{Translation["Last Name"]}</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                placeholder={Translation["Enter Last Name"]}
                value={this.state.lastName}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>{Translation["Email"]}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder={Translation["Enter email"]}
                value={this.state.email}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>{Translation["Password"]}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder={Translation["Enter password"]}
                value={this.state.password}
                onChange={this.handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              {Translation["Close"]}
            </Button>
            <Button variant="primary" onClick={this.handleAdd}>
              {Translation["Save Changes"]}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* UPDATE User */}
        <Modal show={this.state.updateUser} onHide={this.handleUpdateClose}>
          <Modal.Header closeButton>
            <Modal.Title>{Translation["Edit User Info"]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>{Translation["First Name"]}</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                placeholder={Translation["Enter First Name"]}
                value={this.state.firstName}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>{Translation["Last Name"]}</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                placeholder={Translation["Enter Last Name"]}
                value={this.state.lastName}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>{Translation["Email"]}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder={Translation["Enter email"]}
                value={this.state.email}
                disabled
                onChange={this.handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleUpdateClose}>
              {Translation["Close"]}
            </Button>
            <Button
              variant="primary"
              disabled={this.state.setBtnDisable}
              onClick={this.handleUpdateSubmit}
            >
              {Translation["Save Changes"]}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default DeliveryPerson;
