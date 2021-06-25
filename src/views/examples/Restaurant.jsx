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
  { title: "Name" },
  { title: "Email" },
  { title: "Address" },
  { title: "Pickup Place" },
  { title: "Block" },
  { title: "# of Dishes" },
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
      phone: "",
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
    this.handleResetState();
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
        //debugger;;
        console.log(response);
        var RestaurantDatais = [];
        response.restaurants.map((item) => {
          if (item.status !== "deleted") {
            RestaurantDatais.push([
              item.firstName,
              item.email,
              `${item.address.street}, ${item.address.city}, ${item.address.zip}`,
              item.restaurant.pickupPlace,
              item.block !== undefined && item.block !== null
                ? item.block.name
                : "No Block Assigned",
              item.restaurant.dishes.length,
              item,
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
    // //debugger;;
    const confirmis = window.confirm("Are you sure you want to delete?");
    if (confirmis === true) {
      this.WebServicesManager.DeleteApiInURL(
        {
          endPoint: "restaurant/delete",
          dataToDelete: id._id,
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

  handleUpdateRestaurant = (item) => {
    this.setState({
      name: item.firstName,
      password: item.password,
      email: item.email,
      phone: item.phone ? item.phone : "",
      street: item.address.street,
      city: item.address.city,
      zip: item.address.zip,
      imagePath: null,
      pickupPlace: item.restaurant.pickupPlace,
      currId: item._id,
      updateRestaurant: true,
    });
  };

  handleAdd = () => {
    // //debugger;;
    this.setState({ setBtnDisable: true }, () => {
      const {
        name,
        email,
        phone,
        password,
        street,
        zip,
        city,
        imagePath,
        pickupPlace,
      } = this.state;

      console.log(this.state);
      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("email", email);
      formdata.append("phone", phone);
      formdata.append("password", password);
      formdata.append("address", JSON.stringify({ street, zip, city }));
      formdata.append("pickupPlace", pickupPlace);
      formdata.append("image", imagePath);

      console.log("formdata ", formdata);
      this.WebServicesManager.postApiCallFormData(
        {
          endPoint: "restaurant",
          dataToInsert: formdata,
          token: localStorage.getItem("token"),
        },
        (statusCode, responseAdd) => {
          // //debugger;;
          if (responseAdd.message) {
            this.setState({ setBtnDisable: false }, () => {
              window.alert(responseAdd.message);
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

  handleResetState = () => {
    this.setState({
      name: "",
      email: "",
      password: "",
      phone: "",
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
    //debugger;;
    const {
      name,
      email,
      phone,
      password,
      street,
      zip,
      city,
      imagePath,
      pickupPlace,
      currId,
    } = this.state;
    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("email", email);
    formdata.append("phone", phone);
    // formdata.append("password", password);
    formdata.append("address", JSON.stringify({ street, zip, city }));
    formdata.append("pickupPlace", pickupPlace);
    if (imagePath !== null) {
      formdata.append("image", imagePath);
    }
    this.setState({ setBtnDisable: true }, () => {
      this.WebServicesManager.putApiForm(
        {
          endPoint: "restaurant/editByAdmin/" + currId,
          dataToUpdate: formdata,
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

    this.setState({ setBtnDisable: false });
  };

  handleBtnDisable = () => {
    const {
      name,
      email,
      phone,
      password,
      street,
      zip,
      city,
      imagePath,
      pickupPlace,
      updateRestaurant,
    } = this.state;
    // debugger;
    if (
      name &&
      email &&
      phone &&
      password &&
      street &&
      zip &&
      city &&
      pickupPlace
    ) {
      this.setState({
        setBtnDisable: false,
      });
    } else if (imagePath === null && updateRestaurant) {
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
      this.handleBtnDisable();
    });
  };

  render() {
    console.log(this.state.RestaurantList, "this.state.RestaurantList");
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
                actionCol={6}
                columns={columns}
                data={this.state.RestaurantList}
                actions={actionsList}
                hideEdit={false}
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
              <Form.Label>
                Name<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter Restaurant Name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                Email<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter Email"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                Contact Number<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="phone"
                placeholder="Enter contact number"
                value={this.state.phone}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                Password<span style={{ color: "red" }}>*</span>
              </Form.Label>
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
              <Form.Label>
                Street<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="street"
                placeholder="rue 51"
                value={this.state.street}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                City<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="city"
                placeholder="paris"
                value={this.state.city}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                ZipCode<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="zip"
                placeholder="11211"
                value={this.state.zip}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                Pickup Place<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="pickupPlace"
                placeholder="42 rue joe *****"
                value={this.state.pickupPlace}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                Image<span style={{ color: "red" }}>*</span>
              </Form.Label>
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
            <Button
              variant="primary"
              disabled={this.state.setBtnDisable}
              onClick={this.handleAdd}
            >
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
                disabled={true}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="number"
                name="phone"
                placeholder="Enter contact number"
                value={this.state.phone}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail" style={{ display: "none" }}>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={this.state.password}
                disabled={true}
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
