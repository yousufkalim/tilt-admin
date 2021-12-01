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
  { title: Translation["Company"] },
  { title: Translation["Phone Number"] },
  { title: Translation["Actions"] },
];

class Users extends React.Component {
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
      currId: "",
    };
  }

  handleClose = () => {
    this.setState({ showAdd: false });
  };
  handleUpdateClose = () => {
    this.setState({ updateUser: false });
  };
  componentDidMount() {
    this.handleLoadData();
  }

  handleLoadData = () => {
    this.setState({ userList: [] });
    var tokn = localStorage.getItem("token");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "user",
        token: tokn,
      },
      (statusCode, response) => {
        var userDetails = [];
        response.users.map((item) => {
          if (item.status !== "deleted") {
            userDetails.push([
              item.firstName,
              item.lastName,
              item.user.company !== undefined && item.user.company !== null
                ? item.user.company.name
                : Translation["No company"],
              item.phone ? item.phone : "N/A",
              item._id,
            ]);
          }
        });
        this.setState({ userList: userDetails }, () => {
          // console.log('response state',this.state.userList);
        });
      }
    );
  };
  // handle delete function
  handleDelete = (id) => {
    const confirmis = window.confirm(
      Translation["Are you sure you want to delete the user?"]
    );

    if (confirmis === true) {
      this.WebServicesManager.DeleteApiInURL(
        {
          endPoint: "user/delete",
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
      currId: "",
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
                hideAdd={true}
                hideEdit={true}
              />
            ) : (
              <>
                <hr />
                <p style={{ textAlign: "center" }}>
                  {Translation["No Record Found"]}
                </p>
              </>
            )}
          </>
        </Container>
        {/* // ADD User  */}
        {/* <Modal show={this.state.showAdd} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this User?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal> */}

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

export default Users;
