import React, { Component } from 'react';
import { Menu, Input, Icon, Form } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
// TODO need update to work with Navbar
export default class DynamicNavbar extends Component {
  state = {
    visible: false,
    searchInputVisible: false,
    search_input: ''
  };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
    window.scrollTo(0, 0);
  };

  showDynamicNavbar = () => {
    const scrollPos = document.scrollingElement.scrollTop;
    if (scrollPos < 300) {
      this.setState({ scrollPos: scrollPos });
    }
  };

  componentDidMount() {
    window.addEventListener('scroll', this.showDynamicNavbar);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.showDynamicNavbar);
  }

  render() {
    const { activeItem, scrollPos } = this.state;

    return (
      <Menu
        inverted
        color="violet"
        fixed="top"
        style={{
          transform: `translateY(${
            scrollPos > 150 ? Math.min(-50 + (scrollPos - 150), 0) : -100
          }px)`
        }}
      >
        <Menu.Item header>
          <NavLink to="/">Finstagram</NavLink>
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item
            as={NavLink}
            to="/favorite"
            name="fav"
            active={activeItem === 'fav'}
            onClick={this.handleItemClick}
            position="right"
          >
            <Icon name="user" />
          </Menu.Item>

          <Menu.Item style={{ padding: '.5rem' }}>
            <Form onSubmit={this.props.toSearchPage} size="mini">
              <Input
                size="mini"
                style={{ padding: '0' }}
                icon="search"
                placeholder="Search..."
                onChange={this.props.onChange}
              />
            </Form>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
