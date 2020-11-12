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
  { title: "Least Cart value" },
  { title: "Referral Discount" },
  { title: "Actions" },
];

class Discounts extends React.Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.state = {
      discountList: [],
      setBtnDisable: false,
      showAdd: false,
      updateDiscount: false,
      deletePackage: false,
      didUpdate: false,
      currId: "",
    };
  }
  handleClose = () => {
    this.setState({ showAdd: false });
  };
  handleUpdateClose = () => {
    this.setState({ updateDiscount: false }, () => {
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
    this.WebServicesManager.postApiCall(
      {
        endPoint: "admin/package",
        dataToInsert: dataToUpdate,
        token: localStorage.getItem("token"),
      },
      (statusCode, responseUpdate) => {
        this.handleClose();
        this.handleResetState();
        this.handleLoadData();
      }
    );
  };

  handleLoadData = () => {
    this.setState({ discountList: [] });
    var tokn = localStorage.getItem("token");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "admin/discounts",
        token: tokn,
      },
      (statusCode, response) => {
        var discountDetails = [];
        response.discounts.map((item) => {
          discountDetails.push([
            item.leastCartValue,
            item.referralDiscount,
            item._id,
          ]);
        });
        this.setState({ discountList: discountDetails }, () => {
          console.log("response state", this.state.discountList);
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

  handleupdateDiscount = (id) => {
    var tokn = localStorage.getItem("token");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "admin/discounts",
        token: tokn,
      },
      (statusCode, response) => {
        //debugger;;
        const { leastCartValue, referralDiscount } = response.discounts[0];
        this.setState(
          {
            leastCartValue,
            referralDiscount,
            currId: id,
            updateDiscount: true,
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
        leastCartValue: "",
        referralDiscount: "",
        currId: "",
      },
      () => {
        this.handleBtnDisable();
      }
    );
  };
  handleUpdateSubmit = () => {
    const { currId, leastCartValue, referralDiscount } = this.state;
    const info = {
      leastCartValue,
      referralDiscount,
    };

    const dataToUpdate = JSON.stringify(info);
    this.WebServicesManager.putApi(
      {
        endPoint: "admin/editDiscounts",
        // userID: currId,
        dataToUpdate: dataToUpdate,
        token: localStorage.getItem("token"),
      },
      (statusCode, responseUpdate) => {
        this.handleUpdateClose();
        this.handleResetState();
        this.handleLoadData();
      }
    );
  };
  handleBtnDisable = () => {
    const { leastCartValue, referralDiscount } = this.state;
    if (leastCartValue !== "" && referralDiscount !== "") {
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
      updateAction: (id) => this.handleupdateDiscount(id),
      deleteAction: (id) => this.handleDelete(id),
    };

    return (
      <>
        <CustomHeader />
        {/* Page content */}
        <Container className="mt-4" fluid>
          {/* Table */}
          <>
            {this.state.discountList.length > 0 ? (
              <DataTableComponent
                actionCol={2}
                columns={columns}
                data={this.state.discountList}
                actions={actionsList}
                hideAdd={true}
                hideDelete={true}
              />
            ) : (
              <>
                <hr />
                <p style={{ textAlign: "center" }}>No Record Found</p>
              </>
            )}
          </>
        </Container>

        {/* UPDATE Discount */}
        <Modal show={this.state.updateDiscount} onHide={this.handleUpdateClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Discounts</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>leastCartValue<span style={{color:'red'}}>*</span></Form.Label>
              <Form.Control
                type="text"
                name="leastCartValue"
                placeholder="Enter value"
                value={this.state.leastCartValue}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>referralDiscount<span style={{color:'red'}}>*</span></Form.Label>
              <Form.Control
                type="Number"
                name="referralDiscount"
                placeholder="Enter Price"
                value={this.state.referralDiscount}
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

export default Discounts;
