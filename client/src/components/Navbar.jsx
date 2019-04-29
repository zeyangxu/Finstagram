import React, { Component } from 'react';
import {
  Menu,
  Responsive,
  Button,
  Input,
  Segment,
  Sidebar,
  Transition,
  Image,
  Dropdown,
  Icon,
  Form,
  Label,
  Item
} from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import faker from 'faker';
import DynamicNavbar from './DynamicNavbar';
import Search from './Search';

class Navbar extends Component {
  state = {
    visible: false,
    searchInputVisible: false,
    search_input: '',
    activeItem: 'main',
    requestList: [],
    requestNum: null,
    modalOpen: false,
    newGroupName: '',
    showWarningMsg: false,
    errMsgList: [],
    tagList: []
  };
  getData = async () => {
    const { cookies } = this.props;
    const sessionID = cookies.cookies.sessionID;
    try {
      const p1 = fetch(`/api/follow/request/${sessionID}`);
      const p2 = fetch(`/api/tag/receive/${sessionID}`);
      const res = await Promise.all([p1, p2]);
      const j1 = res[0].json();
      const j2 = res[1].json();
      const json = await Promise.all([j1, j2]);
      console.log(json[0], json[1]);
      if (res[0].status === 200 && res[1].status === 200) {
        this.setState({
          requestNum: json[0].result.length + json[1].result.length,
          requestList: json[0].result,
          tagList: json[1].result
        });
      } else if (res[0].status === 401 || res[1].status === 401) {
        this.props.history.push('/');
      }
    } catch (err) {
      console.error(err);
    }
  };
  componentDidMount() {
    this.getData();
  }
  handleItemClick = (e, { name }) => {
    console.log('handleItemClick()');
    this.setState({ activeItem: name, visible: false });
    window.scroll(0, 0);
  };
  showSidebar = () => this.setState({ visible: true });
  hideSidebar = () => this.setState({ visible: false });
  showSearch = () => this.setState({ searchInputVisible: true });
  hideSearch = () => this.setState({ searchInputVisible: false });
  handleRef = c => {
    this.inputRef = c;
  };

  focus = async () => {
    await this.showSearch();
    this.inputRef.focus();
  };

  toSearchPage = e => {
    console.log('Navbar => toSearchPage()');
    const { search_input } = this.state;
    if (search_input !== '') {
      this.props.history.push({
        pathname: `/search/${search_input}`
      });
      this.hideSearch();
      this.setState({ search_input: '' });
      document.activeElement.blur();
      window.scroll(0, 0);
    }
  };
  // update search input state
  onChange = (e, { value }) => {
    this.setState({ search_input: value });
  };
  // delete session id stored in the server
  logout = async () => {
    console.log('log out start');
    const { cookies } = this.props;
    const sessionID = cookies.cookies.sessionID;
    try {
      const res = await fetch(`/api/auth/${sessionID}`, {
        method: 'DELETE',
        mode: 'cors'
      });
      console.log('log out');
      if (res.status === 401) {
        console.log('session not found');
      }
      this.props.history.push('/login');
    } catch (err) {
      console.error(err);
    }
  };
  rejectFollow = async user => {
    const { cookies } = this.props;
    const sessionID = cookies.cookies.sessionID;
    try {
      const res = await fetch(`/api/follow/reject/${sessionID}?user=${user}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.status === 200) {
        this.getData();
      } else {
        alert('soemthing wrong');
      }
    } catch (err) {
      console.error(err);
    }
  };
  acceptFollow = async user => {
    const { cookies } = this.props;
    const sessionID = cookies.cookies.sessionID;
    try {
      const res = await fetch(`/api/follow/accept/${sessionID}?user=${user}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.status === 200) {
        this.getData();
      } else {
        alert('soemthing wrong');
      }
    } catch (err) {
      console.error(err);
    }
  };
  acceptTag = async photoID => {
    const { cookies } = this.props;
    const sessionID = cookies.cookies.sessionID;
    try {
      const res = await fetch(`/api/tag/accept/${sessionID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ photoID })
      });
      // FIXME main pages need a rerender after accept
      if (res.status === 200) {
        this.getData();
      } else {
        // TODO need better handling of error
        alert('soemthing wrong');
      }
    } catch (err) {
      console.error(err);
    }
  };
  rejectTag = async photoID => {
    const { cookies } = this.props;
    const sessionID = cookies.cookies.sessionID;
    try {
      const res = await fetch(`/api/tag/reject/${sessionID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ photoID })
      });
      if (res.status === 200) {
        this.getData();
      } else {
        alert('soemthing wrong');
      }
    } catch (err) {
      console.error(err);
    }
  };
  render() {
    const {
      activeItem,
      visible,
      searchInputVisible,
      search_input,
      requestList,
      requestNum,
      tagList
    } = this.state;
    return (
      <div>
        <Segment>
          <Menu secondary>
            <Menu.Item
              header
              name="main"
              onClick={this.handleItemClick}
              as="h1"
              size="huge"
              style={{
                fontFamily: "'Pacifico', cursive",
                color: '#ba68c8'
              }}
            >
              <NavLink to="/" style={{ color: '#ba68c8' }}>
                Finstagram
              </NavLink>
            </Menu.Item>
            <Menu.Menu position="right" style={{ margin: 0 }}>
              <Responsive minWidth={768} as={Menu.Item}>
                <Menu.Item
                  as={NavLink}
                  to="/gallery"
                  style={{ color: '#000' }}
                  name="gallery"
                  active={activeItem === 'gallery'}
                  onClick={this.handleItemClick}
                >
                  <Icon name="image" color="violet" />
                  Gallery
                </Menu.Item>
              </Responsive>

              <Responsive minWidth={768} as={Menu.Item}>
                <Form onSubmit={this.toSearchPage}>
                  <Search mode="visit" />
                </Form>
              </Responsive>

              <Responsive minWidth={768} as={Menu.Item}>
                {requestNum !== 0 && (
                  <Label color="red" floating>
                    {requestNum}
                  </Label>
                )}
                <Dropdown
                  icon={null}
                  noResultsMessage="no message"
                  trigger={
                    <>
                      <Icon name="mail" size="large" />
                    </>
                  }
                  color="violet"
                  fluid
                  style={{ color: '#000' }}
                >
                  <Dropdown.Menu>
                    <Item.Group>
                      {requestList.map(i => {
                        return (
                          <Item key={i.followerUsername}>
                            <Image
                              avatar
                              size="tiny"
                              src={faker.internet.avatar()}
                            />
                            <Item.Content verticalAlign="middle">
                              <strong>{i.followerUsername}</strong>
                              {' wants to follow you'}
                              <Item.Description>
                                <Icon name="user plus" />
                              </Item.Description>
                              <Item.Extra>
                                <Button
                                  onClick={() =>
                                    this.acceptFollow(i.followerUsername)
                                  }
                                  size="mini"
                                  primary
                                >
                                  Accept
                                </Button>
                                <Button
                                  onClick={() =>
                                    this.rejectFollow(i.followerUsername)
                                  }
                                  size="mini"
                                >
                                  Remove
                                </Button>
                              </Item.Extra>
                            </Item.Content>
                          </Item>
                        );
                      })}
                      {tagList.map(i => {
                        return (
                          <Item key={i.filePath}>
                            <Item.Image
                              size="tiny"
                              src={'http://localhost:5000/' + i.filePath}
                            />
                            <Item.Content verticalAlign="middle">
                              {'someone tags you in a photo'}
                              <Item.Description>
                                <Icon name="at" />
                              </Item.Description>
                              <Item.Extra>
                                <Button
                                  onClick={() => this.acceptTag(i.photoID)}
                                  size="mini"
                                  primary
                                >
                                  Accept
                                </Button>
                                <Button
                                  onClick={() => this.rejectTag(i.photoID)}
                                  size="mini"
                                >
                                  Remove
                                </Button>
                              </Item.Extra>
                            </Item.Content>
                          </Item>
                        );
                      })}
                    </Item.Group>
                  </Dropdown.Menu>
                </Dropdown>
              </Responsive>

              <Responsive minWidth={768}>
                <Dropdown
                  item
                  trigger={
                    <span>
                      <Image avatar src={faker.internet.avatar()} />{' '}
                      {this.props.username}
                    </span>
                  }
                  icon={null}
                  pointing="top right"
                  color="violet"
                  style={{ color: '#000', marginTop: '1rem' }}
                >
                  <Dropdown.Menu>
                    <Dropdown.Item
                      icon="power off"
                      text="Log out"
                      onClick={this.logout}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </Responsive>

              <Menu.Item>
                <Responsive
                  {...Responsive.onlyMobile}
                  as={Transition}
                  visible={searchInputVisible}
                  animation="scale"
                  duration={50}
                >
                  <Form onSubmit={this.toSearchPage}>
                    <Input
                      value={search_input}
                      placeholder="Search..."
                      size="mini"
                      transparent
                      icon="like"
                      iconPosition="left"
                      ref={this.handleRef}
                      onChange={this.onChange}
                    />
                  </Form>
                </Responsive>
              </Menu.Item>
              <Menu.Item>
                <Responsive
                  {...Responsive.onlyMobile}
                  as={Transition}
                  visible={!searchInputVisible}
                  animation="fade"
                  duration={{ hide: 1, show: 1000 }}
                >
                  <Button icon="search" onClick={this.focus} />
                </Responsive>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Segment>

        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          inverted
          onHide={this.hideSidebar}
          vertical
          visible={visible}
          width="thin"
          direction="bottom"
        >
          <Menu.Item
            as={NavLink}
            to="/favorite"
            name="saved"
            active={activeItem === 'saved'}
            onClick={this.handleItemClick}
          >
            <Icon name="remove bookmark" color="red" size="mini" />
            Saved
          </Menu.Item>
          <Menu.Item
            as={NavLink}
            to="/vr"
            name="vr"
            active={activeItem === 'vr'}
            onClick={this.handleItemClick}
          >
            VR
          </Menu.Item>

          <Menu.Item
            as={NavLink}
            to="/ch"
            name="ch"
            active={activeItem === 'ch'}
            onClick={this.handleItemClick}
          >
            中文
          </Menu.Item>

          <Menu.Item
            as={NavLink}
            to="/all"
            name="all"
            active={activeItem === 'all'}
            onClick={this.handleItemClick}
          >
            All
          </Menu.Item>

          <Menu.Item
            onClick={() => {
              this.focus();
              this.hideSidebar();
            }}
            icon="search"
          />

          <Menu.Item onClick={this.hideSidebar}>&#10005;</Menu.Item>
        </Sidebar>

        <Responsive
          {...Responsive.onlyMobile}
          as={Button}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: '1'
          }}
          icon="bars"
          color="black"
          onClick={this.showSidebar}
        />
        <Responsive minWidth={768}>
          <DynamicNavbar
            toSearchPage={this.toSearchPage}
            onChange={this.onChange}
          />
        </Responsive>
      </div>
    );
  }
}
Navbar.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired
};
export default compose(
  withRouter,
  withCookies
)(Navbar);
