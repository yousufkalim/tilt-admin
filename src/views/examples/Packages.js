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
  { title: "Package Price" },
  { title: "Credits" },
  { title: "Discount on delivery fees" },
  { title: "Expiration (Days)" },
  { title: "Actions" },
];

class Packages extends React.Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.state = {
      packageList: [],
      setBtnDisable: false,
      showAdd: false,
      updatePackage: false,
      deletePackage: false,
      didUpdate: false,
      name: "",
      price: "",
      offPrice: "",
      expiration: "",
      credits: "",

      currId: "",
    };
  }
  handleClose = () => {
    this.setState({ showAdd: false });
  };
  handleUpdateClose = () => {
    this.setState({ updatePackage: false }, () => {
      this.handleResetState();
    });
  };
  componentDidMount() {
    this.handleLoadData();
    this.handleBtnDisable();
  }

  handleAdd = () => {
    //debugger;;
    const { name, price, offPrice, expiration, credits } = this.state;
    const info = {
      name,
      price,
      offPrice,
      expiration,
      credits,
    };
    const dataToUpdate = JSON.stringify(info);
    this.setState({ setBtnDisable: true }, () => {
      this.WebServicesManager.postApiCall(
        {
          endPoint: "admin/package",
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

  handleLoadData = () => {
    this.setState({ packageList: [] });
    var tokn = localStorage.getItem("token");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "admin/package",
        token: tokn,
      },
      (statusCode, response) => {
        var packageDetails = [];
        response.packages.map((item) => {
          packageDetails.push([
            item.name,
            item.price,
            item.credits,
            item.offPrice,
            item.expiration,
            item._id,
          ]);
        });
        this.setState({ packageList: packageDetails }, () => {
          console.log("response state", this.state.packageList);
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
          endPoint: "admin/package/delete",
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

  handleupdatePackage = (id) => {
    var tokn = localStorage.getItem("token");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "admin/package/get/" + id,
        token: tokn,
      },
      (statusCode, response) => {
        //debugger;;
        const { name, price, offPrice, expiration, credits } = response.package;
        this.setState(
          {
            name,
            price,
            offPrice,
            expiration,
            credits,
            currId: id,
            updatePackage: true,
          },
          () => {
            this.handleBtnDisable();
          }
        );
      }
    );
  };

  handleResetState = () => {
    this.setState(
      {
        name: "",
        price: "",
        offPrice: "",
        expiration: "",
        credits: "",
        currId: "",
      },
      () => {
        this.handleBtnDisable();
      }
    );
  };
  handleUpdateSubmit = () => {
    const { currId, name, price, offPrice, credits, expiration } = this.state;
    const info = {
      name,
      price,
      offPrice,
      credits,
      expiration,
    };

    const dataToUpdate = JSON.stringify(info);
    this.setState({ setBtnDisable: true }, () => {
      this.WebServicesManager.putApi(
        {
          endPoint: "admin/package/edit",
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
            this.handleUpdateClose();
            this.handleResetState();
            this.handleLoadData();
          }
        }
      );
    });
  };
  handleBtnDisable = () => {
    const { name, price, offPrice, credits, expiration } = this.state;
    if (
      name !== "" &&
      price !== "" &&
      offPrice !== "" &&
      credits !== "" &&
      expiration !== ""
    ) {
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
      updateAction: (id) => this.handleupdatePackage(id),
      deleteAction: (id) => this.handleDelete(id),
    };

    return (
      <>
        <CustomHeader />
        {/* Page content */}
        <Container className="mt-4" fluid>
          {/* Table */}
          <>
            {this.state.packageList.length > 0 ? (
              <DataTableComponent
                actionCol={5}
                columns={columns}
                data={this.state.packageList}
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
        {/* // ADD User  */}
        <Modal show={this.state.showAdd} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Package</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter Package Name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="Number"
                name="price"
                placeholder="Enter Price"
                value={this.state.price}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Off Price</Form.Label>
              <Form.Control
                type="number"
                name="offPrice"
                placeholder="Enter Off Price"
                value={this.state.offPrice}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Credits</Form.Label>
              <Form.Control
                type="number"
                name="credits"
                placeholder="Enter Credits"
                value={this.state.credits}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Expiration</Form.Label>
              <Form.Control
                type="number"
                name="expiration"
                placeholder="Enter Expiration"
                value={this.state.expiration}
                onChange={this.handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={this.state.setBtnDisable}
              onClick={this.handleAdd}
            >
              Add
            </Button>
          </Modal.Footer>
        </Modal>

        {/* UPDATE User */}
        <Modal show={this.state.updatePackage} onHide={this.handleUpdateClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Package Info</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter Package Name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="Number"
                name="price"
                placeholder="Enter Price"
                value={this.state.price}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Off Price</Form.Label>
              <Form.Control
                type="number"
                name="offPrice"
                placeholder="Enter Off Price"
                value={this.state.offPrice}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Credits</Form.Label>
              <Form.Control
                type="number"
                name="credits"
                placeholder="Enter Credits"
                value={this.state.credits}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Expiration</Form.Label>
              <Form.Control
                type="number"
                name="expiration"
                placeholder="Enter Expiration"
                value={this.state.expiration}
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
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Packages;
