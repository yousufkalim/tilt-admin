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
  { title: Translation["Package Price"] },
  { title: Translation["Credits"] },
  { title: Translation["Discount on delivery fees"] },
  { title: Translation["Expiration (Days)"] },
  { title: Translation["Actions"] },
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
    const confirmis = window.confirm(
      Translation["Are you sure you want to delete this package?"]
    );

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
            <Modal.Title>{Translation["Add Package"]}</Modal.Title>
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
                placeholder={Translation['"Enter Package Name"']}
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                {Translation["Price"]}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="Number"
                name="price"
                placeholder={Translation['"Enter Price"']}
                value={this.state.price}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                {Translation["Off Price"]}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="offPrice"
                placeholder={Translation['"Enter Off Price"']}
                value={this.state.offPrice}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                {Translation["Credits"]}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="credits"
                placeholder={Translation['"Enter Credits"']}
                value={this.state.credits}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                {Translation["Expiration"]}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="expiration"
                placeholder={Translation['"Enter Expiration"']}
                value={this.state.expiration}
                onChange={this.handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              {Translation["Cancel"]}
            </Button>
            <Button
              variant="primary"
              disabled={this.state.setBtnDisable}
              onClick={this.handleAdd}
            >
              {Translation["Add"]}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* UPDATE User */}
        <Modal show={this.state.updatePackage} onHide={this.handleUpdateClose}>
          <Modal.Header closeButton>
            <Modal.Title>{Translation["Edit Package Info"]}</Modal.Title>
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
                placeholder={Translation['"Enter Package Name"']}
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                {Translation["Price"]}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="Number"
                name="price"
                placeholder={Translation['"Enter Price"']}
                value={this.state.price}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                {Translation["Off Price"]}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="offPrice"
                placeholder={Translation['"Enter Off Price"']}
                value={this.state.offPrice}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                {Translation["Credits"]}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="credits"
                placeholder={Translation['"Enter Credits"']}
                value={this.state.credits}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                {Translation["Expiration"]}
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="expiration"
                placeholder={Translation['"Enter Expiration"']}
                value={this.state.expiration}
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
              {Translation["Update"]}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Packages;
