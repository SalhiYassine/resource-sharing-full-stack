import React, { Component } from "react";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import * as fa from "react-icons/fa";

export default class EditProfileContainer extends Component {
  constructor(props) {
    super(props);

    this.toProfile = this.toProfile.bind(this);
    this.onChangeProfilePictureFile = this.onChangeProfilePictureFile.bind(
      this
    );
    this.onChangeNickname = this.onChangeNickname.bind(this);
    this.setPrivate = this.setPrivate.bind(this);
    this.setPublic = this.setPublic.bind(this);
    this.onChangeCourse = this.onChangeCourse.bind(this);
    this.onChangeStrongestSubject = this.onChangeStrongestSubject.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.setEditProfileButtonAnimation = this.setEditProfileButtonAnimation.bind(
      this
    );
    this.authHeader = this.authHeader.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.onEditProfileButtonEnd = this.onEditProfileButtonEnd.bind(this);

    this.state = {
      picture: null,
      nickname: this.props.user.profile.nickname,
      private: this.props.user.profile.is_private,
      course: this.props.user.profile.course,
      strongestSubject: this.props.user.profile.strongest_subject,
      description: this.props.user.profile.description,
      editProfileButtonAnimation: false,
      invalidData: {
        picture: false,
        nickname: false,
        course: false,
        strongestSubject: false,
        description: false,
      },
    };
  }

  toProfile() {
    this.props.history.push("/profile");
  }

  onChangeProfilePictureFile(e) {
    if (e.target.files.length === 0) {
      this.setState({
        picture: null,
      });
    } else {
      this.setState({
        picture: e.target.files[0],
      });
    }
  }

  onChangeNickname(e) {
    this.setState({
      nickname: e.target.value,
    });
  }

  setPrivate() {
    this.setState({
      private: true,
    });
  }

  setPublic() {
    this.setState({
      private: false,
    });
  }

  onChangeCourse(e) {
    this.setState({
      course: e.target.value,
    });
  }

  onChangeStrongestSubject(e) {
    this.setState({
      strongestSubject: e.target.value,
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value,
    });
  }

  setEditProfileButtonAnimation(value) {
    this.setState({
      editProfileButtonAnimation: value,
    });
  }

  authHeader() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      return {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      };
    } else {
      return {};
    }
  }

  saveProfile() {
    this.setEditProfileButtonAnimation(true);

    const profile = new FormData();
    var types = ["image/png", "image/jpg", "image/jpeg", "image/x-icon"];
    var picture = this.props.profilePicture;
    if (this.state.picture !== null) {
      picture =
        this.state.picture.size > 500000 ||
        !types.includes(this.state.picture.type)
          ? "invalid"
          : this.state.picture;
    }

    this.setState({
      invalidData: {
        picture:
          picture === "invalid" || this.state.picture !== null
            ? this.state.picture.size > 500000
            : false
            ? true
            : false,
        nickname: this.state.nickname === "" ? true : false,
        course: this.state.course === "" ? true : false,
        strongestSubject: this.state.strongestSubject === "" ? true : false,
        description: this.state.description === "" ? true : false,
      },
    });

    if (
      this.state.nickname &&
      this.state.course &&
      this.state.strongestSubject &&
      this.state.description !== "" &&
      picture !== "invalid" &&
      (this.state.picture !== null ? this.state.picture.size <= 500000 : true)
    ) {
      profile.append("profile_id", this.props.user.profile.profile_id);
      profile.append("nickname", this.state.nickname);
      profile.append("is_private", this.state.private);
      profile.append("course", this.state.course);
      profile.append("strongest_subject", this.state.strongestSubject);
      profile.append("description", this.state.description);
      profile.append("user_id", this.props.user.profile.user_id);
      profile.append("picture", picture);
      axios({
        method: "put",
        url: "http://www.localhost:8080/edit-profile",
        data: profile,
        headers: this.authHeader(),
      });
    }
  }

  onEditProfileButtonEnd() {
    this.setEditProfileButtonAnimation(false);
    if (
      !(
        this.state.invalidData.picture ||
        this.state.invalidData.nickname ||
        this.state.invalidData.course ||
        this.state.invalidData.strongestSubject ||
        this.state.invalidData.description
      )
    ) {
      this.toProfile();
    }
  }

  render() {
    return (
      <>
        <div className="edit-profile-bar">
          <button
            className="edit-profile-bar-back-button"
            onClick={this.toProfile}
          >
            <fa.FaAngleLeft />
          </button>
          <h1>Edit Profile</h1>
          <button className="save-button" onClick={this.saveProfile}>
            <fa.FaSave
              className={
                this.state.editProfileButtonAnimation
                  ? " messages-edit-chat-edit-animation"
                  : ""
              }
              onAnimationEnd={this.onEditProfileButtonEnd}
            />
          </button>
        </div>
        <div className="form-input-container form-file-input-container edit-profile-input-container edit-profile-file-input-container">
          <p>* Profile Picture</p>
          <label id="profilePictureFileLabel" htmlFor="profilePictureFileInput">
            {this.state.picture === null &&
            this.props.profilePicture === null ? (
              <svg height="70" width="70">
                <circle cx="35" cy="35" r="35" />
              </svg>
            ) : (
              <img
                src={
                  this.state.picture === null
                    ? URL.createObjectURL(this.props.profilePicture)
                    : URL.createObjectURL(this.state.picture)
                }
              />
            )}
            <input
              type="file"
              id="profilePictureFileInput"
              onChange={this.onChangeProfilePictureFile}
            ></input>
          </label>
          {this.state.invalidData.picture ? (
            <p className="invalid-indicator-text">
              * Please add a suitable profile picture.
            </p>
          ) : null}
        </div>

        <div className="form-input-container form-text-input-container edit-profile-input-container edit-profile-text-input-container">
          <p>* Nickname</p>
          <TextareaAutosize
            placeholder={"Add a Nickname for your Account"}
            value={this.state.nickname}
            onChange={this.onChangeNickname}
          />
          {this.state.invalidData.nickname ? (
            <p className="invalid-indicator-text">
              * Please enter a nickname for your profile.
            </p>
          ) : null}
        </div>

        <div className="form-input-container form-text-input-container edit-profile-input-container">
          <p>* Privacy</p>
          <div className="form-input-switch-buttons">
            <button
              onClick={this.setPublic}
              className={
                this.state.private
                  ? "form-input-switch-button"
                  : "form-input-switch-button form-input-switch-active"
              }
            >
              <fa.FaLockOpen />
            </button>
            <button
              onClick={this.setPrivate}
              className={
                this.state.private
                  ? "form-input-switch-button form-input-switch-active"
                  : "form-input-switch-button"
              }
            >
              <fa.FaLock />
            </button>
          </div>
        </div>

        <div className="form-input-container form-text-input-container edit-profile-input-container edit-profile-text-input-container">
          <p>* Course</p>
          <TextareaAutosize
            placeholder={"Add your Current Course to your Profile"}
            value={this.state.course}
            onChange={this.onChangeCourse}
          />
          {this.state.invalidData.course ? (
            <p className="invalid-indicator-text">
              * Please enter the course that you're are currently on to your
              profile.
            </p>
          ) : null}
        </div>

        <div className="form-input-container form-text-input-container edit-profile-input-container edit-profile-text-input-container">
          <p>* Strongest Subject</p>
          <TextareaAutosize
            placeholder={"Add your Strongest Subject to your Profile"}
            value={this.state.strongestSubject}
            onChange={this.onChangeStrongestSubject}
          />
          {this.state.invalidData.strongestSubject ? (
            <p className="invalid-indicator-text">
              * Please enter your strongest subject for your profile.
            </p>
          ) : null}
        </div>

        <div className="form-input-container form-text-input-container edit-profile-input-container edit-profile-text-input-container">
          <p>* Description</p>
          <TextareaAutosize
            placeholder={"Add a Description to your Profile"}
            value={this.state.description}
            onChange={this.onChangeDescription}
          />
          {this.state.invalidData.description ? (
            <p className="invalid-indicator-text">
              * Please add a description for your profile.
            </p>
          ) : null}
        </div>
      </>
    );
  }
}

function studentRankColor(studentRank) {
  switch (studentRank) {
    case "Bronze":
      return { color: "#ecb580", background: "#b1560f" };
    case "Silver":
      return { color: "#ddddee", background: "#888899" };
    case "Gold":
      return { color: "#ffe700", background: "#c49f27" };
    case "Platinum":
      return { color: "#ffffff", background: "#bba7aa" };
    default:
      return { color: "#000000" };
  }
}
