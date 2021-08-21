import React, { Component } from "react";
import * as fa from "react-icons/fa";

export default class ColleaguesBar extends Component {
  constructor(props) {
    super(props);

    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.toPending = this.toPending.bind(this);
    this.toColleagues = this.toColleagues.bind(this);

    this.state = {
      searchValue: "",
    };
  }

  onChangeSearch(e) {
    this.setState({
      searchValue: e.target.value,
    });
  }

  onSearch(id) {
    this.props.history.push("/students/" + id);
  }

  toPending() {
    this.props.history.push("/colleagues/pending");
  }

  toColleagues() {
    this.props.history.push("/colleagues");
  }

  render() {
    return (
      <div className="colleagues-bar">
        <ul>
          <li className="colleagues-bar-search">
            <input
              placeholder="Search for Colleagues by Username"
              value={this.state.searchValue}
              onChange={this.onChangeSearch}
              onKeyDown={this.onEnterSearch}
            />
            <SearchResults colleaguesBar={this} />
          </li>
          <li
            className="colleagues-bar-button"
            onClick={
              window.location.pathname === "/colleagues"
                ? this.toPending
                : this.toColleagues
            }
          >
            {window.location.pathname === "/colleagues" ? (
              <fa.FaUserClock />
            ) : (
              <fa.FaUserCheck />
            )}
          </li>
        </ul>
      </div>
    );
  }
}

export const SearchResults = (props) => {
  var colleagues = props.colleaguesBar.props.colleagues;
  var colleaguesCount = 0;
  return (
    <ul className="colleagues-bar-search-results">
      {colleagues.length === 0
        ? null
        : colleagues.map((colleague, index) => {
            if (
              colleague.username.includes(
                props.colleaguesBar.state.searchValue
              ) &&
              colleaguesCount < 6
            ) {
              colleaguesCount += 1;
              return (
                <li
                  key={index}
                  onClick={() => props.colleaguesBar.onSearch(colleague.id)}
                >
                  <p>{colleague.profile.nickname}</p>
                  <p>{colleague.username}</p>
                </li>
              );
            }
            return null;
          })}
      {colleaguesCount === 0 ? <p>No Results</p> : null}
    </ul>
  );
};
