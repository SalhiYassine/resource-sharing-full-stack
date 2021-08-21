import React, { useState, useEffect } from "react";
import "../../../node_modules/react-vis/dist/style.css";

function HomePage() {
  useEffect(() => {
    let graphOptions = [];
    ProgressService.getAllAssessments().then((response) => {
      console.log(response.data);
      response.data.map((node, i) => {
        let dateArray = node.date.split("-");
        let dateFormat = dateArray[1];

        graphOptions.push({ x: i, y: grade });
      });
      setGraphData(graphOptions);
      setLoading(false);
    });
  }, []);

  return (
    <div class="home-container">
      <div class="home-profile">
        <div class="home-search">
          <form class="example" action="action_page.php">
            <input
              class="home-search-field"
              type="text"
              placeholder="Search.."
              name="search"
            />
          </form>
        </div>

        <div class="home-message-container">
          <div class="home-message">
            <div class="home-message-nickname">Nickname</div>
            <div class="home-message-field">Message</div>
          </div>

          <div class="home-message">
            <div class="home-message-nickname">Nickname</div>
            <div class="home-message-field">Message</div>
          </div>

          <div class="home-message">
            <div class="home-message-nickname">Nickname</div>
            <div class="home-message-field">Message</div>
          </div>

          <div class="home-message">
            <div class="home-message-nickname">Nickname</div>
            <div class="home-message-field">Message</div>
          </div>
        </div>

        <div class="home-resource-container">
          <div class="home-resource-view">
            <div class="home-resource">
              <div class="home-resource-nameInfo">
                <div class="home-resource-name">Resource 1</div>
                <div class="home-resource-information">
                  Subject| Type | Length
                </div>
                <div class="home-resource-description">Description</div>
              </div>

              <div class="home-resource-user">
                <div class="home-resource-uploaded-by">Uploaded By</div>
                <div class="home-resource-user">UserName</div>
              </div>
            </div>
          </div>

          <div class="home-resource-view">
            <div class="home-resource">
              <div class="home-resource-nameInfo">
                <div class="home-resource-name">Resource 1</div>
                <div class="home-resource-information">
                  Subject| Type | Length
                </div>
                <div class="home-resource-description">Description</div>
              </div>

              <div class="home-resource-user">
                <div class="home-resource-uploaded-by">Uploaded By</div>
                <div class="home-resource-user">UserName</div>
              </div>
            </div>
          </div>

          <div class="home-resource-view">
            <div class="home-resource">
              <div class="home-resource-nameInfo">
                <div class="home-resource-name">Resource 1</div>
                <div class="home-resource-information">
                  Subject| Type | Length
                </div>
                <div class="home-resource-description">Description</div>
              </div>

              <div class="home-resource-user">
                <div class="home-resource-uploaded-by">Uploaded By</div>
                <div class="home-resource-user">UserName</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="home-profile">
        <div class="home-profile-container">
          <div class="home-profile-profile-info-row">
            <div class="home-profile-name">
              <div class="home-user-nickname">Nickname</div>
              <div class="home-user-username">Username</div>
            </div>
            <div class="home-profile-resources">
              <div class="home-profile-number-resources">2</div>
              <div class="home-profile-resource-label">Resources</div>
            </div>
            <div class="home-profile-rank">
              <div class="home-profile-rank-status">Gold</div>
              <div class="home-profile-rank-label">Rank</div>
            </div>
          </div>

          <div class="home-course-information-section">
            <div class="home-course-name-section">
              <div class="home-course-label">Course</div>
              <div class="home-course-info">Computer Science</div>
            </div>

            <div class="home-course-strong-subject-section">
              <div class="home-course-label">Strongest Subject</div>
              <div class="home-course-info">Group Project</div>
            </div>

            <div class="home-course-description-section">
              <div class="home-course-label">Description</div>
              <div class="home-course-info">Computer Science</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
