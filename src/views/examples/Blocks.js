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
    { title: 'Resturants'},
    { title: 'Companies'},
    { title: 'Order Time'},
    { title: 'Pick up Time'},
    { title: 'Delivery Time'},
    { title: 'Delivery Cost'},
    { title: 'Delivery Person'},
    {title:'Actions'},
  
  ];


class Packages extends React.Component {
    WebServicesManager = new WebServicesManager();
    constructor(props){
        super(props);
        this.state = {
            blockList : [],
            showAdd : false,
            updateBlock : false,
            deleteBlock : false,
            didUpdate:false,
            name:'',
            timeForOrder:'',
            pickUpTime:'',
            deliveryTime:'',
            deliveryCost:'',
            currId:'',
        }
    }
    handleClose = ()=> {
      this.setState({showAdd : false})
    }
    handleUpdateClose = ()=> {
      this.setState({updateBlock : false})
    }
    componentDidMount() {
        this.handleLoadData();
    }

    handleAdd = () => {
      debugger
      const {name,timeForOrder,pickUpTime,deliveryTime,deliveryCost} = this.state;
      const info = {
          name,
          timeForOrder,
          pickUpTime,
          deliveryTime,
          deliveryCost
      }
      const dataToUpdate = JSON.stringify(info);
      this.WebServicesManager.postApiCall(
    {
      endPoint: "admin/block",
      dataToInsert: dataToUpdate,
      token: localStorage.getItem('token'),
    },
    (statusCode, responseUpdate) => {
      this.handleClose();
      this.handleResetState();
      this.handleLoadData();
    }
  );
  }


  handleLoadData = () => {
      this.setState({blockList:[]});
      var tokn= localStorage.getItem('token');
        this.WebServicesManager.getApiCall(
          {
            endPoint: "admin/block",
            token:tokn,
          },
          (statusCode, response) => {
            console.log("Response:"+JSON.stringify(response));
            var blockDetails = [];
            debugger;
            response.blocks.map(item=> {
                blockDetails.push(
                  [
                    item.name,
                    item.restaurants.length !== 0?item.restaurants.map(rest=>rest.firstName):"No resturant available",
                    item.companies.length !==0 ?item.companies.map(comp=>comp.name):"No companies available",
                    item.timeForOrder,
                    item.pickUpTime,
                    item.deliveryTime,
                    item.deliveryCost,
                    item.deliveryPerson!==undefined?item.deliveryPerson.firstName:'Not Assigned',
                    item._id
                  ]
                );
              }  
            );
            this.setState({blockList:blockDetails},()=>{
                console.log('response state',this.state.blockList);
            });
          }
        );
  }
    // handle delete function
  handleDelete = (id) => {
    const confirmis = window.confirm("Are you sure you want to delete?");

    if (confirmis === true) {
      this.WebServicesManager.DeleteApiInURL(
        {
          endPoint: "admin/block/delete",
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

  handleupdateBlock = (id) => {
    var tokn= localStorage.getItem('token');
        this.WebServicesManager.getApiCall(
          {
            endPoint: "admin/block/get/"+id,
            // dataToFetch:id,
            token:tokn,
          },
          (statusCode, response) => {
            const {name,timeForOrder,pickUpTime,deliveryTime,deliveryCost} = response.block;
            this.setState({name,timeForOrder,pickUpTime,deliveryTime,deliveryCost,currId:id,updateBlock: true,});
          }
        );
  }


  handleResetState = () => {
    this.setState({
      name:'',
      timeForOrder:'',
      pickUpTime:'',
      deliveryTime:'',
      deliveryCost:'',
      currId:'',
    })
  }
  handleUpdateSubmit = () => {
    const {currId,name,timeForOrder,pickUpTime,deliveryTime,deliveryCost} = this.state;
    const info = {
      name,
      timeForOrder,
      pickUpTime,
      deliveryTime,
      deliveryCost
    }

    const dataToUpdate = JSON.stringify(info);
    this.WebServicesManager.putApi(
      {
        endPoint: "admin/block/edit",
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
      updateAction : (id) =>this.handleupdateBlock(id),
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
        {this.state.blockList.length >0?
            <DataTableComponent actionCol={8} columns={columns} data={this.state.blockList} actions={actionsList} />
        :
            <>
            <hr/>
            <p style={{textAlign:'center'}}>No Record Found</p>
            </>
        }
    </>          
        </Container>
        {/* // ADD User  */}
        <Modal show={this.state.showAdd} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Block</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" placeholder="Enter Block Name" value={this.state.name} onChange={this.handleChange} />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Order Time</Form.Label>
            <Form.Control type="text" name="timeForOrder" placeholder="Enter Order Time" value={this.state.timeForOrder} onChange={this.handleChange} />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>PickUp Time</Form.Label>
            <Form.Control type="text" name="pickUpTime" placeholder="Enter Pick up Time" value={this.state.pickUpTime} onChange={this.handleChange} />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Delivery Time</Form.Label>
            <Form.Control type="text" name="deliveryTime" placeholder="Enter Delivery Time" value={this.state.deliveryTime} onChange={this.handleChange} />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Delivery Cost</Form.Label>
            <Form.Control type="number" name="deliveryCost" placeholder="Enter Delivery Cost" value={this.state.deliveryCost} onChange={this.handleChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.handleAdd}>
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
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" placeholder="Enter Block Name" value={this.state.name} onChange={this.handleChange} />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Order Time</Form.Label>
            <Form.Control type="text" name="timeForOrder" placeholder="Enter Order Time" value={this.state.timeForOrder} onChange={this.handleChange} />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>PickUp Time</Form.Label>
            <Form.Control type="text" name="pickUpTime" placeholder="Enter Pick up Time" value={this.state.pickUpTime} onChange={this.handleChange} />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Delivery Time</Form.Label>
            <Form.Control type="text" name="deliveryTime" placeholder="Enter Delivery Time" value={this.state.deliveryTime} onChange={this.handleChange} />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Delivery Cost</Form.Label>
            <Form.Control type="number" name="deliveryCost" placeholder="Enter Delivery Cost" value={this.state.deliveryCost} onChange={this.handleChange} />
          </Form.Group>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleUpdateClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleUpdateSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      </>
    );
  }
}

export default Packages;
