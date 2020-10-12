import React from "react";
import DataTableComponent from "../../components/DataTable/DataTableComponent";
import WebServicesManager from "../../WebServiceManager/WebServicesManager";


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
    { title: 'First Name' },
    { title: 'Last Name'},
    { title: 'Status'},
    {title:'Actions'},
  
  ];

class Users extends React.Component {
    WebServicesManager = new WebServicesManager();
    constructor(props){
        super(props);
        this.state = {
            userList : [],

        }
    }
    componentDidMount() {
        var tokn= localStorage.getItem('token');
        this.WebServicesManager.getApiCall(
          {
            endPoint: "user",
            token:tokn,
          },
          (statusCode, response) => {
            console.log(response);
            var userDatais = [];
            response.users.map(item=> {
                userDatais.push(
                  [
                    item.firstName,
                    item.lastName,
                    item.status,
                    item._id
                  ]
                );        
              }  
            );
            this.setState({userList:userDatais},()=>{
                console.log('response state',this.state.userList);
            });
          }
        );
    }
  render() {
      
    const actionsList = {};

    return (
      <>
        <CustomHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          return (
    <>
        {this.state.userList.length >0?
            <DataTableComponent actionCol={3} columns={columns} data={this.state.userList} actions={actionsList} />
        :
            <>
            <hr/>
            <p style={{textAlign:'center'}}>No Record Found</p>
            </>
        }
    </>          
        </Container>
      </>
    );
  }
}

export default Users;
