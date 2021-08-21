import React, { Component } from "react";

export default class studentsBar extends Component {
  constructor(props) {
    super(props);

    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.onSearch = this.onSearch.bind(this);

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

  render() {
    return (
      <div className="students-bar">
        <ul>
          <li className="students-bar-search">
            <input
              placeholder="Search for Students by Username"
              value={this.state.searchValue}
              onChange={this.onChangeSearch}
            />
            <SearchResults studentsBar={this} />
          </li>
        </ul>
      </div>
    );
  }
}

export const SearchResults = (props) => {
  var students = props.studentsBar.props.studentsArrayData;
  var studentsCount = 0;
  return (
    <ul className="students-bar-search-results">
      {students.length === 0
        ? null
        : students.map((student, index) => {
            if (
              student.username.includes(props.studentsBar.state.searchValue) &&
              studentsCount < 6
            ) {
              studentsCount += 1;
              return (
                <li
                  key={index}
                  onClick={() => props.studentsBar.onSearch(student.id)}
                >
                  <p>{student.nickname}</p>
                  <p>{student.username}</p>
                </li>
              );
            }
            return null;
          })}
      {studentsCount === 0 ? <p>No Results</p> : null}
    </ul>
  );
};
