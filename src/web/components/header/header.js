﻿import { Component, PropTypes } from 'react';
import { observable, toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { registerTmpl } from 'nornj-react';
import { autobind } from 'core-decorators';
import 'flarej/lib/components/antd/menu';
import 'flarej/lib/components/antd/select';
import 'flarej/lib/components/antd/icon';
import styles from './header.scss';
import template from './header.t.html';

@inject('store')
@observer
export default class Header extends Component {

  @observable hash = ''; // url标签
  // 菜单
  @observable menuData=[{

  }];

  componentDidMount = () => {
    let hashArr = location.hash.split('/');
    this.hash = hashArr[1];
    console.log(this.hash);
    console.log('版本号:  v0.1.23');
  }

  // 切换菜单
  @autobind
  CheckMenu({key}){
    this.hash = key;
    window.location.hash = '#' + key;
  }

  handleSelectChange = (e) => {
    const { store: { account, block, common, search, user } } = this.props;
    localStorage.setItem('defaultledger',e);
    window.location.reload();
  }

  render() {
    const { store: { common } } = this.props;
    return template(this.props, this, {
      styles,
      common,
      headerPic: require('../../images/pic-header.png')
    });
  }
}
