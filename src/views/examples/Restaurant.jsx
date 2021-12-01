import React from "react";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import WebServicesManager from "../../WebServiceManager/WebServicesManager";
import { Modal, Button, Form } from "react-bootstrap";
import Translation from "../../Utilities/translation";

// reactstrap components
import { Container, Row } from "reactstrap";
// core components
import CustomHeader from "components/Headers/CustomHeader.js";

const columns = [
  { title: Translation["Name"] },
  { title: Translation["Email"] },
  { title: Translation["Address"] },
  { title: Translation["Pickup Place"] },
  { title: Translation["Block"] },
  { title: Translation["# of Dishes"] },
  { title: Translation["Actions"] },
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
      isPremium: false,
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
        var RestaurantDatais = [];
        response.restaurants.map((item) => {
          let blocks = [];
          item.block.map((b) => {
            blocks.push(b.name);
          });

          if (item.status !== "deleted") {
            RestaurantDatais.push([
              item.firstName,
              item.email,
              `${item.address.street}, ${item.address.city}, ${item.address.zip}`,
              item.restaurant.pickupPlace,
              blocks.length > 0
                ? blocks.join(", ")
                : Translation["No Block Assigned"],
              item.restaurant.dishes.length,
              item,
            ]);
          }
        });
        this.setState({ RestaurantList: RestaurantDatais }, () => {});
      }
    );
  };
  // handle delete function
  handleDelete = (id) => {
    // //debugger;;
    const confirmis = window.confirm(
      Translation["Are you sure you want to delete the block?"]
    );
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
    this.setState({ [e.target.name]: e.target.value });
  };

  handleUpdateRestaurant = (item) => {
    this.setState({
      name: item.firstName,
      isPremium: item.restaurant.isPremium,
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

      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("email", email);
      formdata.append("phone", phone);
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
      isPremium,
    } = this.state;
    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("email", email);
    formdata.append("phone", phone);
    formdata.append("isPremium", isPremium);
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
          restaurantUpdate: true,
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
    this.setState({ imagePath: e.target.files[0] });
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
                <p style={{ textAlign: "center" }}>
                  {Translation["No Record Found"]}
                </p>
              </>
            )}
          </>
        </Container>
        {/* // ADD Restaurant  */}
        <Modal show={this.state.showAdd} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{Translation["Add Restaurant"]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                {Translation["Name"]}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder={Translation["Enter Restaurant Name"]}
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                {Translation["Email"]}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder={Translation["Enter Email"]}
                value={this.state.email}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                {Translation["Contact Number"]}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="phone"
                placeholder={Translation["Enter contact number"]}
                value={this.state.phone}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                {Translation["Password"]}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder={Translation["Enter password"]}
                value={this.state.password}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Label>{Translation["Address"]}</Form.Label>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                {Translation["Street"]}
                <span style={{ color: "red" }}>*</span>
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
                {Translation["City"]}
                <span style={{ color: "red" }}>*</span>
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
                {Translation["ZipCode"]}
                <span style={{ color: "red" }}>*</span>
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
                {Translation["Pickup Place"]}
                <span style={{ color: "red" }}>*</span>
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
                {Translation["Image"]}
                <span style={{ color: "red" }}>*</span>
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
              {Translation["Close"]}
            </Button>
            <Button
              variant="primary"
              disabled={this.state.setBtnDisable}
              onClick={this.handleAdd}
            >
              {Translation["Save Changes"]}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* UPDATE Restaurant */}
        <Modal
          show={this.state.updateRestaurant}
          onHide={this.handleUpdateClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>{Translation["Edit Restaurant Info"]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>{Translation["Name"]}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder={Translation["Enter Restaurant Name"]}
                value={this.state.name}
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
                disabled={true}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>{Translation["Contact Number"]}</Form.Label>
              <Form.Control
                type="number"
                name="phone"
                placeholder={Translation["Enter contact number"]}
                value={this.state.phone}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail" style={{ display: "none" }}>
              <Form.Label>{Translation["Password"]}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder={Translation["Enter password"]}
                value={this.state.password}
                disabled={true}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Label>{Translation["Address"]}</Form.Label>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>{Translation["Street"]}</Form.Label>
              <Form.Control
                type="text"
                name="street"
                placeholder="rue 51"
                value={this.state.street}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>{Translation["City"]}</Form.Label>
              <Form.Control
                type="text"
                name="city"
                placeholder="paris"
                value={this.state.city}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>{Translation["ZipCode"]}</Form.Label>
              <Form.Control
                type="text"
                name="zip"
                placeholder="11211"
                value={this.state.zip}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>{Translation["Pickup Place"]}</Form.Label>
              <Form.Control
                type="text"
                name="pickupPlace"
                placeholder="42 rue joe *****"
                value={this.state.pickupPlace}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>
                {Translation["isPremium"]}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                as="select"
                value={this.state.isPremium}
                name="isPremium"
                onChange={this.handleChange}
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>{Translation["Image"]}</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={this.handleImageUpload}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleUpdateClose}>
              {Translation["Close"]}
            </Button>
            {this.state.setBtnDisable}
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

export default Restaurant;
