import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button, Row, Col } from "react-bootstrap";
import Translation from "../../Utilities/translation";

// import end complimentory.
const $ = require("jquery");
$.DataTable = require("datatables.net");
export default class DataTableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.$el = $(this.el);
    if (this.props.is_order !== true) {
      this.$el.DataTable({
        language: {
          lengthMenu: "_MENU_ entrées",
          zeroRecords: Translation["No matching records found"],
          info: "Affichage de _PAGE_ sur _PAGES_ entrées",
          infoEmpty: Translation["No records found"],
          infoFiltered: "(Filtrage sur les _MAX_ données)",
          search: Translation["Search"],
          paginate: {
            first: Translation["First"],
            last: Translation["Last"],
            next: Translation["Next"],
            previous: Translation["Previous"],
          },
        },
        data: this.props.data,
        columns: this.props.columns,
        columnDefs: [
          {
            targets: this.props.actionCol,
            createdCell: (td, cellData, rowData, row, col) =>
              ReactDOM.render(
                <React.Fragment>
                  {this.props.hideEdit !== true ? (
                    <>
                      <Button
                        variant="success"
                        onClick={() =>
                          this.props.actions.updateAction(cellData)
                        }
                        style={{ width: "150px", marginTop: 10 }}
                      >
                        {Translation["Edit"]}
                      </Button>
                      <br />
                    </>
                  ) : (
                    ""
                  )}
                  <span> </span>
                  {this.props.hideDelete !== true ? (
                    <Button
                      variant="danger"
                      onClick={() => this.props.actions.deleteAction(cellData)}
                      style={{ width: "150px", marginTop: 10 }}
                    >
                      {Translation["Delete"]}
                    </Button>
                  ) : (
                    ""
                  )}
                  {/* {this.props.is_restaurant === true?
                <a href={"/menu/"+cellData} ><Button variant="primary" style={{margin:10 }}>View Menu</Button></a>
                :""} */}
                  {this.props.is_menu || this.props.is_restaurant === true ? (
                    <>
                      <a href={"/dishes/" + cellData}>
                        <Button
                          variant="primary"
                          style={{ width: "150px", marginTop: 10 }}
                        >
                          {Translation["View Dishes"]}
                        </Button>
                      </a>
                      <br />
                      <a href={"/table/" + cellData}>
                        <Button
                          variant="secondary"
                          style={{ width: "150px", marginTop: 10 }}
                        >
                          {Translation["View Tables"]}
                        </Button>
                      </a>
                    </>
                  ) : (
                    ""
                  )}
                  {this.props.qr_generate ? (
                    <Button
                      variant="warning"
                      onClick={() => this.props.actions.qrGenerate(cellData)}
                      style={{ width: "150px", marginTop: 10 }}
                    >
                      {Translation["QR"]}
                    </Button>
                  ) : (
                    ""
                  )}
                </React.Fragment>,
                td
              ),
          },
          {
            targets: 1,
            createdCell: (td, cellData, rowData, row, col) => {
              $(td).css("whiteSpace", "unset");
            },
          },
        ],
      });
    } else {
      this.$el.DataTable({
        data: this.props.data,
        columns: this.props.columns,
      });
    }
    this.setState({ loading: false });
  }
  render() {
    return (
      <div>
        {this.props.hideAdd !== true ? (
          <Row style={{ flexDirection: "row-reverse" }}>
            {this.props.btn || this.props.btn === undefined ? (
              <Button
                vairent="primary"
                className="AddBtn"
                onClick={this.props.actions.addAction}
              >
                {Translation["Add"]}
              </Button>
            ) : (
              <></>
            )}
          </Row>
        ) : (
          ""
        )}
        <hr />
        <Row>
          <Col className="table-responsive">
            <table
              style={{
                backgroundColor: "#fff",
                overflow: "hidden",
                borderRadius: "4px",
              }}
              className="display table table-hover table-striped table-bordered"
              width="100%"
              ref={(el) => (this.el = el)}
            ></table>
          </Col>
        </Row>
      </div>
    );
  }
}
