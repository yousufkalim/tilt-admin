import React from "react";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import WebServicesManager from "../../WebServiceManager/WebServicesManager";
import { Modal, Button, Form } from "react-bootstrap";

import Select from "react-select";
import makeAnimated from "react-select/animated";

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
const animatedComponents = makeAnimated();

const columns = [
  { title: "Name" },
  { title: "Restaurants" },
  { title: "Companies" },
  { title: "Order<br/>Time" },
  { title: "PickUp<br/>Time" },
  { title: "Delivery<br/>Time" },
  { title: "Delivery<br/>Cost" },
  { title: "Delivery<br/>Person" },
  { title: "Actions" },
];

class Packages extends React.Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.state = {
      blockList: [],
      resturantList: [],
      setBtnDisable: false,
      showAdd: false,
      updateBlock: false,
      deleteBlock: false,
      didUpdate: false,
      name: "",
      timeForOrder: "",
      pickUpTime: "",
      deliveryTime: "",
      deliveryCost: "",
      currId: "",
      companyList: [],
      selectedCompany: [],
      selectedRestaurant: [],
      selectedDelivaryPerson: "",
      deliveryPersonList: [],
      allDeliveryPersonList: [],
    };
  }
  handleClose = () => {
    this.setState({ showAdd: false });
  };
  handleUpdateClose = () => {
    this.setState({ updateBlock: false }, () => {
      this.handleResetState();
    });
  };
  componentDidMount() {
    this.handleLoadData();
    this.handleLoadDataForDropDown();
    this.handleBtnDisable();
  }

  handleLoadDataForDropDown = () => {
    // get all companies
    const tokn = localStorage.getItem("token");
    let companyListFilter = [];
    let restaurantsListFilter = [];
    
    this.WebServicesManager.getApiCall(
      {
        endPoint: "admin/company",
        token: tokn,
      },
      (statusCode, response) => {
        var companyDetails = [];
        response.companies.map((item) => {
          if (item.block === null || item.block === undefined) {
            companyListFilter.push({
              value: item._id,
              label: item.name,
            });
          }
        });
        this.setState({ companyList: companyListFilter }, () => {});
      }
    );
    // get all restaurants
    this.WebServicesManager.getApiCall(
      {
        endPoint: "restaurant/",
        token: tokn,
      },
      (statusCode, response) => {
        response.restaurants.map((item) => {
          if (
            item.block === null ||
            (item.block === undefined && item.status !== "deleted")
          ) {
            restaurantsListFilter.push({
              value: item._id,
              label: item.firstName,
            });
          }
        });
        this.setState({ resturantList: restaurantsListFilter }, () => {});
      }
    );

    this.handleLoadDelivaryPerson(tokn);
    
  };

  handleLoadDelivaryPerson = (tokn) => {
    // get all delivery persons
    let allDevPerson = [];
    let deliveryPersonListFilter = [];
    this.WebServicesManager.getApiCall(
      {
        endPoint: "deliveryuser/",
        token: tokn,
      },
      (statusCode, response) => {
        console.log(response);
        response.users.map((item) => {
          console.log(
            item.block === null , item.block === undefined ,
          (item.block === undefined,
          item.status !== "deleted"));
          if (
            (item.block === null || item.block === undefined) &&
            (item.status !== "deleted")
          ) {
            deliveryPersonListFilter.push({
              id: item._id,
              name: item.firstName,
            });
          }
          if ((item.block === null || item.block === undefined || item.block._id === this.state.currId) &&
          (item.status !== "deleted" )) {
            allDevPerson.push({
              id: item._id,
              name: item.firstName,
            });
          }
        });
        this.setState(
          {
            deliveryPersonList: deliveryPersonListFilter,
            allDeliveryPersonList: allDevPerson,
          },
          () => {}
        );
      }
    );
  }

  handleAdd = () => {
    this.setState({ setBtnDisable: true }, () => {
      const {
        name,
        timeForOrder,
        pickUpTime,
        deliveryTime,
        deliveryCost,
        selectedCompany,
        selectedDelivaryPerson,
        selectedRestaurant,
      } = this.state;
      var ll = [];
      var l2 = [];

      selectedCompany.map((com) => ll.push(com.value));
      selectedRestaurant.map((rest) => l2.push(rest.value));

      ////debugger;;
      const info = {
        name,
        timeForOrder,
        pickUpTime,
        deliveryTime,
        deliveryCost,
        companies: ll,
        restaurants: l2,
        deliveryPerson: selectedDelivaryPerson,
      };
      const dataToUpdate = JSON.stringify(info);
      this.WebServicesManager.postApiCall(
        {
          endPoint: "admin/block",
          dataToInsert: dataToUpdate,
          token: localStorage.getItem("token"),
        },
        (statusCode, responseUpdate) => {
          if (responseUpdate.message) {
            window.alert(responseUpdate.message);
            this.setState({ setBtnDisable: false });
          } else {
            this.handleClose();
            this.handleResetState();
            this.handleLoadData();
            this.handleLoadDataForDropDown();
          }
        }
      );
    });
  };

  handleLoadData = () => {
    this.setState({ blockList: [] });
    var tokn = localStorage.getItem("token");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "admin/block",
        token: tokn,
      },
      (statusCode, response) => {
        var blockDetails = [];
        //////debugger;;
        response.blocks.map((item) => {
          ////debugger;;
          var finalString = "<ul>";
          var endString = "</ul>";
          var middleString = "";
          item.companies.length !== 0 &&
            item.companies !== null &&
            item.companies.map((comp) => {
              middleString = middleString + `<li>${comp.name}</li>`;
            });
          finalString = `${finalString} ${middleString} ${endString}`;
          blockDetails.push([
            item.name,
            item.restaurants.filter((res) => res.status !== "deleted")
              .length === 0
              ? "No restaurant available"
              : item.restaurants
                  .filter((res) => res.status !== "deleted")
                  .map((rest) => rest.firstName),
            item.companies.length !== 0
              ? finalString
              : "No companies available",
            item.timeForOrder,
            item.pickUpTime,
            item.deliveryTime,
            item.deliveryCost,
            item.deliveryPerson !== undefined &&
            item.deliveryPerson !== null &&
            item.deliveryPerson.status !== "deleted"
              ? item.deliveryPerson.firstName
              : "Not Assigned",
            item._id,
          ]);
        });
        this.setState({ blockList: blockDetails }, () => {
          console.log("response state", this.state.blockList);
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
          endPoint: "admin/block/delete",
          dataToDelete: id,
          token: localStorage.getItem("token"),
        },
        (statusCode, response) => {
          this.handleLoadData();
          this.handleLoadDataForDropDown();
        }
      );
    }
  };
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.handleBtnDisable();
    });
  };
  handleSelectMultiple = (e) => {
    this.setState({ selectedCompany: e }, () => {
      console.log("rsr", this.state);
    });

    // const options = e.target.options
    // const arre = [];

    // for (var i = 0 ; i < options.length; i++) {
    //   if(options[i].selected) {
    //     arre.push(options[i].value);
    //     // console.log(options[i].selected,options[i].value)
    //   }
    // }

    // this.setState({[e.target.name]:arre},()=>{
    //   console.log('handleSelect',this.state);
    // });
  };
  handleSelectMultipleRest = (e) => {
    this.setState({ selectedRestaurant: e }, () => {
      console.log("rsr", this.state);
    });
  };

  handleupdateBlock = (id) => {
    var tokn = localStorage.getItem("token");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "admin/block/get/" + id,
        token: tokn,
      },
      (statusCode, response) => {
        console.log(response)
        //////debugger;;
        const {
          name,
          timeForOrder,
          pickUpTime,
          deliveryTime,
          deliveryCost,
          restaurants,
          companies,
          deliveryPerson,
        } = response.block;
        let a = [];
        let b = [];
        debugger;
        if (restaurants.length > 0) {
          restaurants.map((ite) => {
            ite !== null &&
              ite.status !== "deleted" &&
              b.push({ label: ite.firstName, value: ite._id });
          });
        }
        if (companies.length > 0) {
          companies.map((ite) => {
            ite !== null && a.push({ value: ite._id, label: ite.name });
          });
        }
        this.setState({ currId: id},()=>{
          this.handleLoadDelivaryPerson(tokn);
        });
        this.setState(
          {
            name,
            timeForOrder,
            pickUpTime,
            deliveryTime,
            deliveryCost,
            selectedRestaurant: b,
            selectedCompany: a,
            selectedDelivaryPerson:
              deliveryPerson !== undefined && deliveryPerson !== null
                ? deliveryPerson._id
                : "",
           
            updateBlock: true,
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
        timeForOrder: "",
        pickUpTime: "",
        deliveryTime: "",
        deliveryCost: "",
        currId: "",
        selectedCompany: [],
        selectedRestaurant: [],
        selectedDelivaryPerson: "",
      },
      () => {
        this.handleBtnDisable();
      }
    );
  };
  handleUpdateSubmit = () => {
    const {
      currId,
      name,
      timeForOrder,
      pickUpTime,
      deliveryTime,
      deliveryCost,
      selectedCompany,
      selectedRestaurant,
      selectedDelivaryPerson,
    } = this.state;
    let updatedCompanies = [];
    selectedCompany !== null &&
      selectedCompany.map((cp) => updatedCompanies.push(cp.value));

    let updatedRestaurants = [];
    selectedRestaurant !== null &&
      selectedRestaurant.map((cp) => updatedRestaurants.push(cp.value));
    const info = {
      name,
      timeForOrder,
      pickUpTime,
      deliveryTime,
      deliveryCost,
      companies: updatedCompanies,
      restaurants: updatedRestaurants,
      deliveryPerson: selectedDelivaryPerson,
    };
    const dataToUpdate = JSON.stringify(info);
    this.setState({ setBtnDisable: true }, () => {
      this.WebServicesManager.putApi(
        {
          endPoint: "admin/block/edit",
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
            this.handleLoadDataForDropDown();
          }
        }
      );
    });
  };
  handleBtnDisable = () => {
    ////debugger;;
    const {
      name,
      timeForOrder,
      pickUpTime,
      deliveryTime,
      deliveryCost,
      selectedCompany,
      selectedRestaurant,
      // selectedDelivaryPerson,
    } = this.state;
    if (
      name !== "" &&
      timeForOrder !== "" &&
      pickUpTime !== "" &&
      deliveryTime !== "" &&
      deliveryCost !== "" &&
      selectedCompany !== "" &&
      selectedRestaurant !== ""
      // selectedDelivaryPerson !== ""
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
      updateAction: (id) => this.handleupdateBlock(id),
      deleteAction: (id) => this.handleDelete(id),
    };

    return (
      <>
        <CustomHeader />
        {/* Page content */}
        <Container className="mt-4" fluid>
          {/* Table */}
          <>
            {this.state.blockList.length > 0 ? (
              <DataTableComponent
                actionCol={8}
                columns={columns}
                data={this.state.blockList}
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
        {/* // ADD Block  */}
        <Modal show={this.state.showAdd} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Block</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Name<span style={{color:'red'}}>*</span></Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter Block Name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Order Time<span style={{color:'red'}}>*</span></Form.Label>
              <Form.Control
                type="text"
                name="timeForOrder"
                placeholder="Enter Order Time"
                value={this.state.timeForOrder}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>PickUp Time<span style={{color:'red'}}>*</span></Form.Label>
              <Form.Control
                type="text"
                name="pickUpTime"
                placeholder="Enter Pick up Time"
                value={this.state.pickUpTime}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Delivery Time<span style={{color:'red'}}>*</span></Form.Label>
              <Form.Control
                type="text"
                name="deliveryTime"
                placeholder="Enter Delivery Time"
                value={this.state.deliveryTime}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Delivery Cost<span style={{color:'red'}}>*</span></Form.Label>
              <Form.Control
                type="number"
                name="deliveryCost"
                placeholder="Enter Delivery Cost"
                value={this.state.deliveryCost}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlSelect1">
              {/* Company */}
              <Form.Label>Company List<span style={{color:'red'}}>*</span></Form.Label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                defaultValue={this.state.selectedCompany}
                isMulti
                options={this.state.companyList}
                onChange={(e) => this.handleSelectMultiple(e)}
              />
            </Form.Group>

            {/* Restaurant */}
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Restaurant List<span style={{color:'red'}}>*</span></Form.Label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                defaultValue={this.state.selectedRestaurant}
                isMulti
                options={this.state.resturantList}
                onChange={(e) => this.handleSelectMultipleRest(e)}
              />
              {/* delivary Person */}
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Delivary Persons List<span style={{color:'red'}}>*</span></Form.Label>
              <Form.Control
                as="select"
                name="selectedDelivaryPerson"
                value={this.state.selectedDelivaryPerson}
                onChange={this.handleChange}
              >
                <option value="">Select Option</option>
                {this.state.deliveryPersonList.map((deliveryPerson) => (
                  <option value={deliveryPerson.id} key={deliveryPerson.id}>
                    {deliveryPerson.name}
                  </option>
                ))}
              </Form.Control>
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
        <Modal show={this.state.updateBlock} onHide={this.handleUpdateClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Block Info</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Name<span style={{color:'red'}}>*</span></Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter Block Name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Order Time<span style={{color:'red'}}>*</span></Form.Label>
              <Form.Control
                type="text"
                name="timeForOrder"
                placeholder="Enter Order Time"
                value={this.state.timeForOrder}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>PickUp Time<span style={{color:'red'}}>*</span></Form.Label>
              <Form.Control
                type="text"
                name="pickUpTime"
                placeholder="Enter Pick up Time"
                value={this.state.pickUpTime}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Delivery Time<span style={{color:'red'}}>*</span></Form.Label>
              <Form.Control
                type="text"
                name="deliveryTime"
                placeholder="Enter Delivery Time"
                value={this.state.deliveryTime}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Delivery Cost<span style={{color:'red'}}>*</span></Form.Label>
              <Form.Control
                type="number"
                name="deliveryCost"
                placeholder="Enter Delivery Cost"
                value={this.state.deliveryCost}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlSelect1">
              {/* Company */}
              <Form.Label>Company List<span style={{color:'red'}}>*</span></Form.Label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                defaultValue={this.state.selectedCompany}
                isMulti
                options={this.state.companyList}
                onChange={(e) => this.handleSelectMultiple(e)}
              />
            </Form.Group>

            {/* Restaurant */}
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Restaurant List<span style={{color:'red'}}>*</span></Form.Label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                defaultValue={this.state.selectedRestaurant}
                isMulti
                options={this.state.resturantList}
                onChange={(e) => this.handleSelectMultipleRest(e)}
              />
              {/* delivary Person */}
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Delivary Persons List<span style={{color:'red'}}>*</span></Form.Label>

              <Form.Control
                as="select"
                name="selectedDelivaryPerson"
                value={this.state.selectedDelivaryPerson}
                onChange={this.handleChange}
              >
                <option value="">Select Option</option>
                {this.state.allDeliveryPersonList.map((deliveryPerson) => (
                  <option value={deliveryPerson.id} key={deliveryPerson.id}>
                    {deliveryPerson.name}
                  </option>
                ))}
              </Form.Control>
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
