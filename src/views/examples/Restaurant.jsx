import React from "react";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import WebServicesManager from "../../WebServiceManager/WebServicesManager";
import { Modal, Button, Form } from "react-bootstrap";

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
  { title: "First Name" },
  { title: "Email" },
  { title: "Company" },
  { title: "Actions" },
];

class Restaurant extends React.Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.state = {
      RestaurantList: [],
      showAdd: false,
      updateRestaurant: false,
      deleteRestaurant: false,
      didUpdate: false,
      setBtnDisable: false,
      name: "",
      email: "",
      password: "",
      street: "",
      zip: "",
      city: "",
      pickupPlace: "",
      imagePath: null,
      currId: "",
    };
  }

  handleClose = () => {
    this.setState({ showAdd: false });
  };
  handleUpdateClose = () => {
    this.setState({ updateRestaurant: false });
  };
  componentDidMount() {
    this.handleLoadData();
  }

  handleLoadData = () => {
    this.setState({ RestaurantList: [] });
    var tokn = localStorage.getItem("token");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "restaurant",
        token: tokn,
      },
      (statusCode, response) => {
        console.log(response);
        var RestaurantDatais = [];
        response.restaurants.map((item) => {
          if (item.status !== "deleted") {
            RestaurantDatais.push([
              item.firstName,
              item.email,
              item.restaurant.dishes.length,
              item._id,
            ]);
          }
        });
        this.setState({ RestaurantList: RestaurantDatais }, () => {
          // console.log('response state',this.state.RestaurantList);
        });
      }
    );
  };
  // handle delete function
  handleDelete = (id) => {
    const confirmis = window.confirm("Are you sure you want to delete?");

    if (confirmis === true) {
      this.WebServicesManager.DeleteApiInURL(
        {
          endPoint: "Restaurant/delete",
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

  handleUpdateRestaurant = (id) => {
    debugger;
    var tokn = localStorage.getItem("token");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "Restaurant/getbyid/" + id,
        // dataToFetch:id,
        token: tokn,
      },
      (statusCode, response) => {
        debugger;
        const { email, firstName, lastName } = response.Restaurant;
        this.setState({
          firstName,
          lastName,
          email,
          currId: id,
          updateRestaurant: true,
        });
      }
    );
  };

  handleAdd = () => {
    debugger;
    const {
      name,
      email,
      password,
      street,
      zip,
      city,
      imagePath,
      pickupPlace,
    } = this.state;
    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("email", email);
    formdata.append("password", password);
    formdata.append("address", JSON.stringify({ street, zip, city }));
    formdata.append("pickupPlace", pickupPlace);
    formdata.append("image", imagePath);
    this.WebServicesManager.postApiCallFormData(
      {
        endPoint: "restaurant",
        dataToInsert: formdata,
        token: localStorage.getItem("token"),
      },
      (statusCode, responseAdd) => {
        debugger;
        console.log("added");
        this.handleClose();
        this.handleResetState();
        this.handleLoadData();
      }
    );
  };

  handleResetState = () => {
    this.setState({
      name: "",
      email: "",
      password: "",
      street: "",
      zip: "",
      city: "",
      pickupPlace: "",
      imagePath: null,
      currId: "",
      updateRestaurant: false,
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
    this.WebServicesManager.putApi(
      {
        endPoint: "Restaurant/edit",
        RestaurantID: currId,
        dataToUpdate: dataToUpdate,
        token: localStorage.getItem("token"),
      },
      (statusCode, responseUpdate) => {
        this.handleResetState();
        this.handleLoadData();
      }
    );
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

  handleImageUpload = (e) => {
    this.setState({ imagePath: e.target.files[0] }, () => {
      console.log(this.state.imagePath);
    });
  };

  render() {
    const actionsList = {
      addAction: () => {
        this.setState({ showAdd: true });
      },
      updateAction: (id) => this.handleUpdateRestaurant(id),
      deleteAction: (id) => this.handleDelete(id),
    };

    return (
      <>
        <CustomHeader />
        {/* Page content */}
        <Container fluid className="mt-2">
          {/* Table */}
          <>
            {this.state.RestaurantList.length > 0 ? (
              <DataTableComponent
                actionCol={3}
                columns={columns}
                data={this.state.RestaurantList}
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
                    Add
                  </Button>
                </Row>
                <hr />
                <p style={{ textAlign: "center" }}>No Record Found</p>
              </>
            )}
          </>
        </Container>
        {/* // ADD Restaurant  */}
        <Modal show={this.state.showAdd} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Restaurant</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter Restaurant Name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={this.state.password}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Label>Address</Form.Label>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Street</Form.Label>
              <Form.Control
                type="text"
                name="street"
                placeholder="rue 51"
                value={this.state.street}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                placeholder="paris"
                value={this.state.city}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>ZipCode</Form.Label>
              <Form.Control
                type="text"
                name="zip"
                placeholder="11211"
                value={this.state.zip}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Pickup Place</Form.Label>
              <Form.Control
                type="text"
                name="pickupPlace"
                placeholder="42 rue joe *****"
                value={this.state.pickupPlace}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={this.handleImageUpload}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleAdd}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* UPDATE Restaurant */}
        <Modal
          show={this.state.updateRestaurant}
          onHide={this.handleUpdateClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Restaurant Info</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                placeholder="Enter First Name"
                value={this.state.firstName}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Enter Last Name"
                value={this.state.lastName}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={this.state.email}
                disabled
                onChange={this.handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleUpdateClose}>
              Close
            </Button>
            <Button
              variant="primary"
              disabled={this.state.setBtnDisable}
              onClick={this.handleUpdateSubmit}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Restaurant;
