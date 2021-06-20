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
  { title: "Delivery Place" },
  { title: "Block" },
  { title: "Actions" },
];

const cities = [
  {
    name: "Select City",
    value: ""
  },
  {
    name: "1",
    value: "one"
  },
  {
    name: "2",
    value: "two"
  },
  {
    name: "3",
    value: "three"
  },
  {
    name: "4",
    value: "four"
  },
  {
    name: "5",
    value: "five"
  },
]

class Company extends React.Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.state = {
      companyList: [],
      setBtnDisable: false,
      showAdd: false,
      updateCompany: false,
      deleteCompany: false,
      didUpdate: false,
      name: "",
      deliveryPlace: "",
      street: "",
      city: "",
      currId: "",
    };
  }

  handleClose = () => {
    this.setState({ showAdd: false });
  };
  handleUpdateClose = () => {
    this.setState({ updateCompany: false }, () => {
      this.handleResetState();
    });
  };
  componentDidMount() {
    this.handleLoadData();
    this.handleBtnDisable();
  }

  handleAdd = () => {
    this.setState({ setBtnDisable: true }, () => {
      //debugger;;
      const { name, deliveryPlace, street } = this.state;
      const info = {
        name,
        deliveryPlace,
        street,
      };
      const dataToUpdate = JSON.stringify(info);
      this.WebServicesManager.postApiCall(
        {
          endPoint: "admin/company",
          dataToInsert: dataToUpdate,
          token: localStorage.getItem("token"),
        },
        (statusCode, responseUpdate) => {
          // //debugger;;
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
    this.setState({ companyList: [] });
    var tokn = localStorage.getItem("token");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "admin/company",
        token: tokn,
      },
      (statusCode, response) => {
        var companyDetails = [];
        console.log(response.companies);
        response.companies.map((item) => {
          if (item !== null) {
            companyDetails.push([
              item.name,
              item.deliveryPlace,
              item.street,
              item.block !== null && item.block !== undefined
                ? item.block.name
                : "No Block Assigned",
              item._id,
            ]);
          }
        });
        this.setState({ companyList: companyDetails }, () => {
          console.log("response state", this.state.companyList);
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
          endPoint: "admin/company/delete",
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
    console.log(e.target.value);
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.handleBtnDisable();
    });
  };

  handleUpdateCompany = (id) => {
    // //debugger;
  
    var tokn = localStorage.getItem("token");
    console.log(id);
    this.WebServicesManager.getApiCall(
      {
        endPoint: "admin/company/get/" + id,
        // dataToFetch:id,
        token: tokn,
      },
      (statusCode, response) => {
        // //debugger;;
        const { name, deliveryPlace, street, city, block } = response.company;
        this.setState(
          {
            name,
            deliveryPlace,
            street,
            city,
            block,
            currId: id,
            updateCompany: true,
          },
          () => {
            this.handleBtnDisable();
          }
        );
      }
    );
  };

  handleResetState = () => {
    this.setState({
      name: "",
      deliveryPlace: "",
      street: "",
      city: "",
      showAdd: false,
    });
  };
  handleUpdateSubmit = () => {
    const { name, currId, deliveryPlace, street, city, block } = this.state;
    const info = {
      name,
      deliveryPlace,
      street,
      city,
      block,
    };

    const dataToUpdate = JSON.stringify(info);
    this.setState({ setBtnDisable: true }, () => {
      this.WebServicesManager.putApi(
        {
          endPoint: "admin/company/edit",
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
    const { name, deliveryPlace, street, city } = this.state;
    if (name !== "" && deliveryPlace !== "" && street !== "" && city !== "") {
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
      updateAction: (id) => this.handleUpdateCompany(id),
      deleteAction: (id) => this.handleDelete(id),
    };

    console.log(actionsList);

    return (
      <>
        <CustomHeader />
        {/* Page content */}
        <Container className="mt-4" fluid>
          {/* Table */}
          <>
            {this.state.companyList.length > 0 ? (
              <DataTableComponent
                actionCol={4}
                columns={columns}
                data={this.state.companyList}
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
        {/* // ADD Company  */}
        <Modal show={this.state.showAdd} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Company</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                Name<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter Company Name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                Delivery Place<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="deliveryPlace"
                placeholder="Enter Delivery Place"
                value={this.state.deliveryPlace}
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

            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>
                City<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control as="select" value={this.state.city} name="city" onChange={this.handleChange}>
              {
                cities.map((item,index) => (
                <option value={item.value}>{item.name}</option>
                ))
              }
              </Form.Control>
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

        {/* UPDATE Company */}
        <Modal show={this.state.updateCompany} onHide={this.handleUpdateClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Company Info</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                Name<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter Name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                Delivery Place<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="deliveryPlace"
                placeholder="Enter Deliver Place"
                value={this.state.deliveryPlace}
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

            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>
                City<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control as="select" value={this.state.city} name="city" onChange={this.handleChange}>
              {
                cities.map((item,index) => (
                <option value={item.value}>{item.name}</option>
                ))
              }
              </Form.Control>
            </Form.Group>

            {/* <Form.Group controlId="formBasicEmail">
            <Form.Label>Block</Form.Label>
            <Form.Control type="text" name="block" placeholder="Enter block" value={this.state.block} onChange={this.handleChange} />
          </Form.Group> */}
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

export default Company;
