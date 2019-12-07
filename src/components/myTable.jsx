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
    //this.setState(TOTAL_WIDTH);
    //console.log(TOTAL_WIDTH);
    //this.forceUpdate();
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

  render() {
    //console.log(this.state.list);
    const { page, perPage, scrollToIndex } = this.state;
    //const headerHeight = 20;
    //const rowHeight = 30;
    //const height = rowHeight * perPage + headerHeight;
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
                  sort={this.sort}
                  sortBy={this.state.sortBy}
                  sortDirection={this.state.sortDirection}
                  scrollToIndex={scrollToIndex}
                  scrollToAlignment="start"
                  tabIndex={null}
                >
                  <Column
                    headerRenderer={this.headerRenderer}
                    dataKey="num1"
                    label={this.state.tabletitle1}
                    width={this.state.widths.num1 * TOTAL_WIDTH2}
                  />
                  <Column
                    headerRenderer={this.headerRenderer}
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
      const nextDataKey = "";
      if (dataKey === "num1") {
        nextDataKey = "num2";
      } else if (dataKey === "num2") {
        nextDataKey = "addition";
      } else if (dataKey === "addition") {
        nextDataKey = "multiply";
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
