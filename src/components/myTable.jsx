import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { InMemoryCache } from "apollo-cache-inmemory";
import {
  Column,
  Table,
  SortDirection,
  WindowScroller,
  AutoSizer
} from "react-virtualized";
import Draggable from "react-draggable";
import "react-virtualized/styles.css";
import ApolloClient from "apollo-boost";
import { showQuery } from "./myQueries";
import _ from "underscore";
import Select from "react-select";
import Paginator from "./Paginator";
import { getRows } from "./utils";
import ContentEditable from "react-contenteditable";
import { Button } from "reactstrap";
import "./buttonCss.css";

const count = 1000;
const rows = getRows(count);
const client = new ApolloClient({
  uri: "https://reactassignmentserver.herokuapp.com/graphql",
  cache: new InMemoryCache()
});
const WIDTH_OPTIONS = [
  { value: "400", label: "Narrow" },
  { value: "650", label: "Normal" },
  { value: "1000", label: "Wide" }
];

const PAGINATOR_OPTIONS = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "20", label: "20" }
];

var TOTAL_WIDTH = 1000;
var TOTAL_WIDTH2 = 1000;
class MyTable extends Component {
  constructor() {
    super();
    this.state = {
      tabletitle1: "Number #1",
      tabletitle2: "Number #2",
      tabletitle3: "Addition (+)",
      tabletitle4: "Multiply (x)",
      list: [],
      widths: {
        num1: 0.25,
        num2: 0.25,
        addition: 0.25,
        multiply: 0.25
      },
      sortBy: "num1",
      sortDirection: SortDirection.DESC,
      selectedOption: WIDTH_OPTIONS[2],
      selectedOptionPaginator: PAGINATOR_OPTIONS[0],
      page: 1,
      perPage: 5,
      scrollToIndex: undefined,
      pageCount: undefined
    };
    this.sort = this.sort.bind(this);
  }
  componentDidMount() {
    this.getData();
    const { perPage } = this.state;
    const rowCount = rows.length;
    const pageCount = Math.ceil(rowCount / perPage);
    this.setState(state => {
      return {
        ...state,
        pageCount: pageCount
      };
    });
  }

  handlePageChange = page => {
    console.log(page);
    if (page === 0) return;
    if (page === this.state.pageCount + 1) return;
    this.setState(prevState => {
      const scrollToIndex = (page - 1) * prevState.perPage;
      return { page, scrollToIndex };
    });
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption }, () =>
      console.log(`Option selected:`, this.state.selectedOption)
    );
    TOTAL_WIDTH2 = selectedOption.value;
  };

  handleChangePaginator = selectedOptionPaginator => {
    this.setState({ selectedOptionPaginator }, () =>
      console.log(`Option selected:`, this.state.selectedOptionPaginator)
    );
    this.setState({ perPage: +selectedOptionPaginator.value });
  };
  getData = event => {
    client
      .query({
        query: showQuery,
        fetchPolicy: "no-cache"
      })
      .then(resData => {
        const events = resData.data.events;
        this.setState({ list: events });
      })
      .catch(err => {
        console.log(err);
      });
  };

  rowStyleFormat(row) {
    if (row.index % 2 === 0) {
      return {
        backgroundColor: "#b7b9bd",
        color: "#333"
      };
    }
    return {
      backgroundColor: "#fff",
      color: "#333"
    };
  }
  sort({ sortBy, sortDirection }) {
    this.state.list = _.sortBy(this.state.list, item =>
      parseInt(item[sortBy], 10)
    );
    const sortedList =
      sortDirection === SortDirection.DESC
        ? this.state.list.reverse()
        : this.state.list;
    this.setState({ sortBy, sortDirection, sortedList });
  }

  rowRenderer = props => {
    const { key, index, style } = props;
    return (
      <div key={key} style={style}>
        {rows[index].name}
      </div>
    );
  };

  handleCellChange(evt, rowIndex, dataKey) {
    const { target } = evt;
    //console.log(this.state.list[rowIndex][dataKey]);
    this.state.list[rowIndex][dataKey] = target.value;
    this.setState(this.state.list[rowIndex][dataKey]);
  }
  _cellRenderer({
    cellData,
    columnData,
    columnIndex,
    dataKey,
    isScrolling,
    rowData,
    rowIndex
  }) {
    return (
      <ContentEditable
        html={cellData}
        disabled={false}
        onChange={e => {
          this.handleCellChange.bind(this)(e, rowIndex, dataKey);
        }}
      />
    );
  }
  handleDeleteRow(evt, rowIndex, dataKey) {
    this.state.list.splice(rowIndex, 1);
    this.setState(this.state.list);
  }
  _deleteCellRenderer({
    cellData,
    columnData,
    columnIndex,
    dataKey,
    isScrolling,
    rowData,
    rowIndex
  }) {
    return (
      <div className="cellClass">
        <Button
          className={"Button-" + { rowIndex }}
          color="danger"
          onClick={e => {
            this.handleDeleteRow.bind(this)(e, rowIndex, dataKey);
          }}
        >
          X
        </Button>
      </div>
    );
  }

  handleOnRowMouseOver(row) {
    console.log(row);
  }

  render() {
    const { page, perPage, scrollToIndex } = this.state;
    const rowCount = this.state.list.length;
    const pageCount = Math.ceil(rowCount / perPage);

    return (
      <div>
        <p>
          <Select
            value={this.state.selectedOption}
            onChange={this.handleChange}
            options={WIDTH_OPTIONS}
          />
        </p>
        <p>
          <Select
            value={this.state.selectedOptionPaginator}
            onChange={this.handleChangePaginator}
            options={PAGINATOR_OPTIONS}
          />
        </p>
        <p>
          <br />
          <Paginator
            pageCount={pageCount}
            currentPage={page}
            onPageChange={this.handlePageChange}
          />
          <br />
        </p>
        <WindowScroller>
          {({
            height,
            isScrolling,
            registerChild,
            onChildScroll,
            scrollTop
          }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <Table
                  width={width}
                  height={30 * (perPage + 1)}
                  headerHeight={20}
                  rowHeight={30}
                  rowCount={this.state.list.length}
                  rowGetter={({ index }) => this.state.list[index]}
                  rowStyle={this.rowStyleFormat.bind(this)}
                  onRowMouseOver={this.handleOnRowMouseOver.bind(this)}
                  sort={this.sort}
                  sortBy={this.state.sortBy}
                  sortDirection={this.state.sortDirection}
                  scrollToIndex={scrollToIndex}
                  scrollToAlignment="start"
                  tabIndex={null}
                >
                  <Column
                    headerRenderer={this.headerRenderer}
                    cellRenderer={this._cellRenderer.bind(this)}
                    dataKey="num1"
                    label={this.state.tabletitle1}
                    width={this.state.widths.num1 * TOTAL_WIDTH2}
                  />
                  <Column
                    headerRenderer={this.headerRenderer}
                    cellRenderer={this._cellRenderer.bind(this)}
                    dataKey="num2"
                    label={this.state.tabletitle2}
                    width={this.state.widths.num2 * TOTAL_WIDTH2}
                  />
                  <Column
                    headerRenderer={this.headerRenderer}
                    dataKey="addition"
                    label={this.state.tabletitle3}
                    width={this.state.widths.addition * TOTAL_WIDTH2}
                  />
                  <Column
                    headerRenderer={this.headerRenderer}
                    dataKey="multiply"
                    label={this.state.tabletitle4}
                    width={this.state.widths.multiply * TOTAL_WIDTH2}
                  />
                  <Column cellRenderer={this._deleteCellRenderer.bind(this)} />
                </Table>
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      </div>
    );
  }
  headerRenderer = ({
    columnData,
    dataKey,
    disableSort,
    label,
    sortBy,
    sortDirection
  }) => {
    return (
      <React.Fragment key={dataKey}>
        <div className="ReactVirtualized__Table__headerTruncatedText">
          {label}
        </div>
        <Draggable
          axis="x"
          defaultClassName="DragHandle"
          defaultClassNameDragging="DragHandleActive"
          onDrag={(event, { deltaX }) =>
            this.resizeRow({
              dataKey,
              deltaX
            })
          }
          position={{ x: 0 }}
          zIndex={999}
        >
          <span className="DragHandleIcon">⋮</span>
        </Draggable>
      </React.Fragment>
    );
  };
  resizeRow = ({ dataKey, deltaX }) =>
    this.setState(prevState => {
      const prevWidths = prevState.widths;
      const percentDelta = deltaX / TOTAL_WIDTH;
      var nextDataKey = "";
      if (dataKey === "num1") {
        nextDataKey = "num2";
      } else if (dataKey === "num2") {
        nextDataKey = "addition";
      } else if (dataKey === "addition") {
        nextDataKey = "multiply";
      } else {
        nextDataKey = "";
      }

      return {
        widths: {
          ...prevWidths,
          [dataKey]: prevWidths[dataKey] + percentDelta,
          [nextDataKey]: prevWidths[nextDataKey] - percentDelta
        }
      };
    });
  getButtonBS() {
    return "btn m-2 btn-dark btn-sm";
  }
}

export default MyTable;
