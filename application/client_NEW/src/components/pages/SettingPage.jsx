import React, { Component } from "react";
import * as fa from "react-icons/fa";
import axios from "axios";
import authHeader from "../../Services/authHeader";
import AuthService from "../../Services/AuthService";

class SettingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      CurrentUsername: "",
      NewUsername: "",
      ConfirmUsername: "",

      CurrentEmail: "",
      NewEmail: "",
      ConfirmEmail: "",

      CurrentPassword: "",
      NewPassword: "",
      ConfirmPassword: "",

      Theme: false,
      editProfileButtonAnimation: false,

      UserNameAlert_message: {},
      EmailAlert_message: {},
      PasswordAlert_message: {},
    };
  }

  CurrentHandler = (event) => {
    this.setState({
      CurrentUsername: event.target.value,
    });
  };

  NewHandler = (event) => {
    this.setState({
      NewUsername: event.target.value,
    });
  };
  ConfirmHandler = (event) => {
    this.setState({
      ConfirmUsername: event.target.value,
    });
  };

  CurrentEmailHandler = (event) => {
    this.setState({
      CurrentEmail: event.target.value,
    });
  };
  NewEmailHandler = (event) => {
    this.setState({
      NewEmail: event.target.value,
    });
  };
  ConfirmEmailHandler = (event) => {
    this.setState({
      ConfirmEmail: event.target.value,
    });
  };

  CurrentPasswordHandler = (event) => {
    this.setState({
      CurrentPassword: event.target.value,
    });
  };
  NewPasswordHandler = (event) => {
    this.setState({
      NewPassword: event.target.value,
    });
  };
  ConfirmPasswordHandler = (event) => {
    this.setState({
      ConfirmPassword: event.target.value,
    });
  };

  HandleThemeChange = (event) => {
    this.setState({
      Theme: event.target.checked,
    });
    this.props.setIsLight(!event.target.checked);
  };

  HandleDeleteAccount = (event) => {
    this.setEditProfileButtonAnimation(true);

    return axios({
      url: `http://www.localhost:8080/deleteAcc/${this.props.user.id}`,
      headers: authHeader(),
      method: "delete",
    })
      .then((response) => {
        alert(
          `${resData.data} \n You will be logget out, log in again to continue`
        );
        AuthService.logout();
        window.location.reload(false);
      })
      .catch((resError) => {
        this.setState({
          UserNameAlert_message: { type: "error", message: resError.data },
        });
      });
  };

  handleSaveUsername = (event) => {
    this.setEditProfileButtonAnimation(true);

    if (
      this.state.ConfirmUsername &&
      this.state.NewUsername &&
      this.state.ConfirmUsername === this.state.NewUsername
    ) {
      const usernameObj = {
        username: this.state.NewUsername,
        user_id: this.props.user.id,
      };

      axios({
        method: "patch",
        url: "http://www.localhost:8080/update-username",
        data: usernameObj,
        headers: authHeader(),
      })
        .then((resData) => {
          alert(
            `${resData.data} \n You will be logget out, log in again to continue`
          );
          AuthService.logout();
          window.location.reload(false);
        })
        .catch((resError) => {
          this.setState({
            UserNameAlert_message: { type: "error", message: resError.data },
          });
        });
    } else {
      this.setState({
        UserNameAlert_message: {
          type: "error",
          message: "Username must match",
        },
      });
    }
    event.preventDefault();
  };

  handleSaveEmail = (event) => {
    this.setEditProfileButtonAnimation(true);

    if (
      this.state.ConfirmEmail &&
      this.state.NewEmail &&
      this.state.ConfirmEmail === this.state.NewEmail
    ) {
      const emailObj = {
        email: this.state.NewEmail,
        user_id: this.props.user.id,
      };

      axios({
        method: "patch",
        url: "http://www.localhost:8080/update-email",
        data: emailObj,
        headers: authHeader(),
      })
        .then((resData) => {
          alert(
            `${resData.data} \n You will be logget out, log in again to continue`
          );
          AuthService.logout();
          window.location.reload(false);
        })
        .catch((resError) => {
          this.setState({
            EmailAlert_message: { type: "error", message: resError.data },
          });
        });
    } else {
      this.setState({
        EmailAlert_message: { type: "error", message: "Email must match" },
      });
    }
    event.preventDefault();
  };

  handleSavePassword = (event) => {
    this.setEditProfileButtonAnimation(true);

    if (
      this.state.ConfirmPassword &&
      this.state.NewPassword &&
      this.state.ConfirmPassword === this.state.NewPassword
    ) {
      const passwordObj = {
        password: this.state.NewPassword,
        user_id: this.props.user.id,
      };

      axios({
        method: "patch",
        url: "http://www.localhost:8080/update-password",
        data: passwordObj,
        headers: authHeader(),
      })
        .then((resData) => {
          alert(
            `${resData.data} \n You will be logget out, log in again to continue`
          );
          AuthService.logout();
          window.location.reload(false);
        })
        .catch((resError) => {
          this.setState({
            PasswordAlert_message: { type: "error", message: resError.data },
          });
        });
    } else {
      this.setState({
        PasswordAlert_message: {
          type: "error",
          message: "Password must match",
        },
      });
    }
    event.preventDefault();
  };
  handleSaveLanguage = (event) => {
    alert(`${this.state.Theme} saved succesfully!`);
  };
  setEditProfileButtonAnimation = (value) => {
    this.setState({
      editProfileButtonAnimation: value,
    });
  };

  onEditProfileButtonEnd = () => {
    this.setEditProfileButtonAnimation(false);
  };
  render() {
    return (
      <div className="container settings-container d-flex flex-column ">
        <div class="row settings-bar settingBox rounded shadow-sm p-3 m-3">
          <div class="col-12 text-primary text-center">
            <h3>
              {" "}
              <fa.FaCog style={{ fontSize: "1." }} /> Settings
            </h3>
          </div>
        </div>

        <div class="row usernameBox settings-bar rounded shadow-sm p-3 m-3">
          <div class="col-12 settingsForm">
            <form>
              <div class="row mb-3 settingHeading font-weight-bold">
                <div class="col-12">Change Username</div>
              </div>
              <div class="row mb-3">
                <label for="currentUsername" class="col-sm-3 col-form-label">
                  Current Username
                </label>
                <div class="col-sm-9">
                  <p>{this.props.user.username}</p>
                </div>
              </div>

              <div class="row mb-3">
                <label for="newUsername" class="col-sm-3 col-form-label">
                  New Username
                </label>
                <div class="col-sm-9">
                  <input
                    class="form-control"
                    type="text"
                    value={this.state.NewUsername}
                    onChange={this.NewHandler}
                    placeholder="Enter new username"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="confirmUsername" class="col-sm-3 col-form-label">
                  Confirm Username
                </label>
                <div class="col-sm-9">
                  <input
                    class="form-control"
                    type="text"
                    value={this.state.ConfirmUsername}
                    onChange={this.ConfirmHandler}
                    placeholder="Enter new username again"
                  />
                  {this.state.UserNameAlert_message.type == "error" && (
                    <div className="alert alert-danger" role="alert">
                      {this.state.UserNameAlert_message.message}
                    </div>
                  )}
                </div>
              </div>
              <div class="row float-right m-3">
                <div class="col-12">
                  <button
                    className="rounded-pill text-primary"
                    onClick={this.handleSaveUsername}
                    value="Save Changes"
                  >
                    {" "}
                    Save Changes
                    <fa.FaSave
                      className={
                        this.state.editProfileButtonAnimation &&
                        " messages-edit-chat-edit-animation"
                      }
                      onAnimationEnd={this.onEditProfileButtonEnd}
                    />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="row emailBox settings-bar rounded shadow-sm p-3 m-3">
          <div class="col-12 emailForm">
            <form>
              <div class="row mb-3 font-weight-bold">
                <div class="col-12 "> Change Email</div>
              </div>
              <div class="row mb-3">
                <label for="currentEmail" class="col-sm-3 col-form-label">
                  Current Email
                </label>
                <div class="col-sm-9">
                  <p>{this.props.user.email}</p>
                </div>
              </div>

              <div class="row mb-3">
                <label for="newEmail" class="col-sm-3 col-form-label">
                  New Email
                </label>
                <div class="col-sm-9">
                  <input
                    class="form-control"
                    type="text"
                    value={this.state.NewEmail}
                    onChange={this.NewEmailHandler}
                    placeholder="Enter new email"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="confirmEmail" class="col-sm-3 col-form-label">
                  Confirm Email
                </label>
                <div class="col-sm-9">
                  <input
                    class="form-control"
                    type="text"
                    value={this.state.ConfirmEmail}
                    onChange={this.ConfirmEmailHandler}
                    placeholder="Enter new email again"
                  />
                  {this.state.EmailAlert_message.type == "error" && (
                    <div className="alert alert-danger" role="alert">
                      {this.state.EmailAlert_message.message}
                    </div>
                  )}
                </div>
              </div>
              <div class="row float-right m-3">
                <div class="col-12">
                  <button
                    className="rounded-pill text-primary"
                    onClick={this.handleSaveEmail}
                    value="Save Changes"
                  >
                    Save Changes
                    <fa.FaSave
                      className={
                        this.state.editProfileButtonAnimation &&
                        " messages-edit-chat-edit-animation"
                      }
                      onAnimationEnd={this.onEditProfileButtonEnd}
                    />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="row passwordBox settings-bar rounded shadow-sm p-3 m-3">
          <div class="col-12 passwordForm">
            <form>
              <div class="row mb-3 font-weight-bold">
                <div class="col-12 "> Change Password</div>
              </div>
              <div class="row mb-3">
                <label for="currentPassword" class="col-sm-3 col-form-label">
                  Current Password
                </label>
                <div class="col-sm-9">
                  <input
                    class="form-control"
                    type="password"
                    value={this.state.CurrentPassword}
                    onChange={this.CurrentPasswordHandler}
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              <div class="row mb-3">
                <label for="newPassword" class="col-sm-3 col-form-label">
                  New Password
                </label>
                <div class="col-sm-9">
                  <input
                    class="form-control"
                    type="password"
                    value={this.state.NewPassword}
                    onChange={this.NewPasswordHandler}
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="confirmEmail" class="col-sm-3 col-form-label">
                  Confirm Password
                </label>
                <div class="col-sm-9">
                  <input
                    class="form-control"
                    type="password"
                    value={this.state.ConfirmPassword}
                    onChange={this.ConfirmPasswordHandler}
                    placeholder="Enter new password again"
                  />
                  {this.state.PasswordAlert_message.type == "error" && (
                    <div className="alert alert-danger" role="alert">
                      {this.state.PasswordAlert_message.message}
                    </div>
                  )}
                </div>
              </div>
              <div class="row float-right m-3">
                <div class="col-12">
                  <button
                    className="rounded-pill text-primary"
                    onClick={this.handleSavePassword}
                    value="Save Changes"
                  >
                    Save Changes
                    <fa.FaSave
                      className={
                        this.state.editProfileButtonAnimation &&
                        " messages-edit-chat-edit-animation"
                      }
                      onAnimationEnd={this.onEditProfileButtonEnd}
                    />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div class="row  settings-bar rounded shadow-sm p-3 m-3">
            <div class="col-12">
              <div class="row mb-3 font-weight-bold">
                <div class="col-12">Theme</div>
              </div>

              <div class="row mb-3">
                <div class="col-3">
                  <label> Dark Theme </label>
                </div>
                <div class="col-9 text-primary">
                  <input
                    type="checkbox"
                    value={this.state.Theme}
                    onChange={this.HandleThemeChange}
                    class="form-control"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="row settings-bar rounded shadow-sm p-3 m-3">
            <div class="col-12">
              <div class="row mb-3 font-weight-bold">
                <div class="col-12">
                  <label> Delete Account </label>
                </div>
                <div class="row">
                  <div class="row float-right m-3">
                    <div class="col-12">
                      <button
                        className="rounded-pill text-primary"
                        onClick={this.HandleDeleteAccount}
                        value="Delete account"
                      >
                        Delete Account
                        <fa.FaSave
                          className={
                            this.state.editProfileButtonAnimation &&
                            " messages-edit-chat-edit-animation"
                          }
                          onAnimationEnd={this.onEditProfileButtonEnd}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SettingPage;
