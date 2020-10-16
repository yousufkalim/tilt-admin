import React from "react";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import WebServicesManager from "../../WebServiceManager/WebServicesManager";
import {Modal,Button,Form} from "react-bootstrap";

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
  UncontrolledTooltip
} from "reactstrap";
// core components
import CustomHeader from "components/Headers/CustomHeader.js";

const columns = [
    { title: 'Name' },
    { title: 'Delivery Place'},
    { title: 'Block'},
    {title:'Actions'},
  
  ];


class Company extends React.Component {
    WebServicesManager = new WebServicesManager();
    constructor(props){
        super(props);
        this.state = {
            companyList : [],
            showAdd : false,
            updateCompany : false,
            deleteCompany : false,
            didUpdate:false,
            name:'',
            deliveryPlace:'',
            currId:'',
        }
    }

    handleClose = ()=> {
      this.setState({showAdd : false})
    }
    handleUpdateClose = ()=> {
      this.setState({updateCompany : false})
    }
    componentDidMount() {
        this.handleLoadData();
    }

    handleAdd = () => {
        debugger
        const {name,deliveryPlace} = this.state;
        const info = {
            name,
            deliveryPlace,
        }
        const dataToUpdate = JSON.stringify(info);
        this.WebServicesManager.postApiCall(
      {
        endPoint: "admin/company",
        dataToInsert: dataToUpdate,
        token: localStorage.getItem('token'),
      },
      (statusCode, responseUpdate) => {
        debugger;
        console.log("updates");
        this.handleClose();
        this.handleResetState();
        this.handleLoadData();
      }
    );
    }

  handleLoadData = () => {
      this.setState({companyList:[]});
      var tokn= localStorage.getItem('token');
        this.WebServicesManager.getApiCall(
          {
            endPoint: "admin/company",
            token:tokn,
          },
          (statusCode, response) => {
            var companyDetails = [];
            console.log(response.companies)
            response.companies.map(item=> {
              if(item !== null){
                companyDetails.push(
                  [
                    item.name,
                    item.deliveryPlace, 
                    item.block !==null && item.block !== undefined?item.block.name:"No Block Assigned",
                    item._id
                  ]
                );
              } 
            }  
          );
            this.setState({companyList:companyDetails},()=>{
                console.log('response state',this.state.companyList);
            });
          }
        );
  }
    // handle delete function
  handleDelete = (id) => {
    const confirmis = window.confirm("Are you sure you want to delete?"+id);

    if (confirmis === true) {
      this.WebServicesManager.DeleteApiInURL(
        {
          endPoint: "admin/company/delete",
          dataToDelete: id,
          token: localStorage.getItem('token'),
        },
        (statusCode, response) => {
          this.handleLoadData();
        }
      );
    }
  };
  handleChange = (e) => {
    this.setState({[e.target.name]:e.target.value});
  }

  handleUpdateCompany = (id) => {
    // debugger
    var tokn= localStorage.getItem('token');
        this.WebServicesManager.getApiCall(
          {
            endPoint: "admin/company/get/"+id,
            // dataToFetch:id,
            token:tokn,
          },
          (statusCode, response) => {
            // debugger;
            const {name,deliveryPlace,block} = response.company;
            this.setState({name,deliveryPlace,block,currId:id,updateCompany: true,});
          }
        );
  }


  handleResetState = () => {
    this.setState({
      name:'',
      deliveryPlace:'',
      showAdd : false
    })
  }
  handleUpdateSubmit = () => {
    const {name,currId,deliveryPlace,block} = this.state;
    const info = {
      name,
      deliveryPlace,
      block,
    }

    const dataToUpdate = JSON.stringify(info);
    this.WebServicesManager.putApi(
      {
        endPoint: "admin/company/edit",
        userID: currId,
        dataToUpdate: dataToUpdate,
        token: localStorage.getItem('token'),
      },
      (statusCode, responseUpdate) => {
        this.handleUpdateClose();
        this.handleResetState();
        this.handleLoadData();
      }
    );
  }
  render() {
      
    const actionsList = {
      addAction : ()=>{
        this.setState({showAdd: true})
      },
      updateAction : (id) =>this.handleUpdateCompany(id),
      deleteAction:(id)=>this.handleDelete(id), 
  }

    return (
      <>
        <CustomHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          return (
    <>
        {this.state.companyList.length >0?
            <DataTableComponent actionCol={3} columns={columns} data={this.state.companyList} actions={actionsList} />
        :
            <>
            <hr/>
            <p style={{textAlign:'center'}}>No Record Found</p>
            </>
        }
    </>          
        </Container>
        {/* // ADD Company  */}
        <Modal show={this.state.showAdd} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" placeholder="Enter Company Name" value={this.state.name} onChange={this.handleChange} />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Delivery Place</Form.Label>
            <Form.Control type="text" name="deliveryPlace" placeholder="Enter Delivery Place" value={this.state.deliveryPlace} onChange={this.handleChange} />
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

      {/* UPDATE Company */}
      <Modal show={this.state.updateCompany} onHide={this.handleUpdateClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Company Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" placeholder="Enter Name" value={this.state.name} onChange={this.handleChange} />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Delivery Place</Form.Label>
            <Form.Control type="text" name="deliveryPlace" placeholder="Enter Deliver Place" value={this.state.deliveryPlace} onChange={this.handleChange} />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Block</Form.Label>
            <Form.Control type="text" name="block" placeholder="Enter block" value={this.state.block} onChange={this.handleChange} />
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleUpdateClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleUpdateSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      </>
    );
  }
}

export default Company;
