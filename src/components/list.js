import React, { Component } from "react";
import ListData from "./list-data";

let isThere = false;

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItems: [],
      isMore: false,
      pageOffset: 0,
      currentElement: "",
      isLoading: true,
    };
  }

  componentDidMount() {
    //fetch initial data with offset 0
    this.fetchData();
  }

  componentWillUnmount() {
    let { currentElement } = this.state;
    //remove listener
    if (currentElement)
      currentElement.removeEventListener("scroll", this.handleScroll);
  }

  scrollRef = (element) => {
    //add listener to handle scroll
    if (element) {
      element.addEventListener("scroll", this.handleScroll);
      this.setState({ currentElement: element });
    }
  };

  //triggers on scrolling
  handleScroll = (event) => {
    let node = event.target;
    const bottom =
      parseInt(node.scrollHeight - node.scrollTop) <=
      parseInt(node.clientHeight);
    if (bottom && !isThere && this.state.isMore) {
      isThere = true;
      this.setState({ isLoading: true });
      this.fetchData();
    }
  };

  fetchData = () => {
    fetch(
      `https://api.instantwebtools.net/v1/passenger?page=${this.state.pageOffset}&size=10`
    )
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        //set result data and total page size in state
        let finalData = [...this.state.listItems, ...result?.data];
        this.setState(
          {
            listItems: finalData,
            pageOffset: this.state.pageOffset + 1,
            isMore: this.state.pageOffset <= result?.totalPages,
            isLoading: false,
          },
          () => (isThere = false)
        );
      })
      .catch((err) => {
        //show error message
        console.log("Something went wrong.", err);
      });
  };

  //render list card
  ListItems = () => {
    return this.state.listItems?.map((passenger) => {
      passenger.airline = passenger?.airline?.length
        ? passenger?.airline[0]
        : passenger?.airline;
      return (
        <div key={passenger._id}>
          <div className="thumbnail" style={{ padding: 15 }}>
            <ListData label="Name" value={passenger?.name} />
            <ListData label="Trips" value={passenger?.trips} />
            <div className="airline">
              <h5>AirLine Info</h5>
            </div>
            <img style={{ height: 35 }} src={passenger?.airline?.logo} />
            <ListData label="Name" value={passenger?.airline?.name} />
            <ListData label="Country" value={passenger?.airline?.country} />
            <ListData
              label="Head Quaters"
              value={passenger?.airline?.head_quaters}
              newLine={true}
            />
            <ListData label="Slogan" value={passenger?.airline?.slogan} />
            <ListData label="Website" value={passenger?.airline?.website} />
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <div className="list-view" ref={this.scrollRef}>
        <h1>Recro List of Cards</h1>
        {this.ListItems()}
        {this.state.isLoading && (
          <center>
            <strong>Loading...</strong>
            <br />
          </center>
        )}
      </div>
    );
  }
}

export default List;
