import React from "react";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import WebServicesManager from "../../WebServiceManager/WebServicesManager";
import { Modal, Button, Form } from "react-bootstrap";
import moment from "moment";

// reactstrap components
import { Container } from "reactstrap";
// core components
import CustomHeader from "components/Headers/CustomHeader.js";

const columns = [
  { title: "Date" },
  { title: "Client Name" },
  { title: "Company Name" },
  { title: "Restaurant Name" },
  { title: "Order information" },
  { title: "Price" },
];

class Company extends React.Component {
  WebServicesManager = new WebServicesManager();
  constructor(props) {
    super(props);
    this.state = {
      orderList: [],
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
    this.setState({ orderList: [] });
    var tokn = localStorage.getItem("token");
    this.WebServicesManager.getApiCall(
      {
        endPoint: "user/getallorders",
        token: tokn,
      },
      (statusCode, response) => {
        var orderDetails = [];

        response.orders.map((order) => {
          let restaurantsName = order.restaurant.map((res) => {
            return res.firstName;
          });

          let dishesName = order.dishes.map((dish) => {
            return dish.name;
          });

          let companyName = order.companies.map((company) => {
            return company.name;
          });
          orderDetails.push([
            moment(order.time).format("DD-MM-YYYY"),
            order.user.firstName + " " + order.user.lastName,
            order.companies.length > 0 ? companyName.join(", ") : "N/A",
            restaurantsName.join(", "),
            dishesName.join(", "),
            "€" + order.paidPrice,
          ]);
        });
        this.setState({ orderList: orderDetails });
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
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.handleBtnDisable();
    });
  };

  handleUpdateCompany = (id) => {
    // //debugger;

    var tokn = localStorage.getItem("token");
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

    return (
      <>
        <CustomHeader />
        {/* Page content */}
        <Container className="mt-4" fluid>
          {/* Table */}
          <>
            {this.state.orderList.length > 0 ? (
              <DataTableComponent
                // actionCol={5}
                columns={columns}
                hideEdit={true}
                hideDelete={true}
                data={this.state.orderList}
                actions={actionsList}
                btn={false}
              />
            ) : (
              <></>
            )}
          </>
        </Container>
      </>
    );
  }
}

export default Company;
