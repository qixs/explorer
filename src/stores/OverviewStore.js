﻿import { observable, computed, action, transaction } from 'mobx';
import { types } from 'mobx-state-tree';
import { fetchData } from 'flarej/lib/utils/fetchConfig';
import { autobind } from 'core-decorators';
import { Notification } from 'flarej/lib/components/antd/notification';
import { tranBase58 } from '../common/util';
import ActionButton from 'antd/lib/modal/ActionButton';

export default class OverviewStore {
  @observable overviewHeadData = {
    blockHeight: 0,
    transactionTotal: 0,
    userTotal: 0,
    dataLedgersTotal: 0,
    contractTotal: 0
  }; // 摘要页面tab部分
  @observable ledgerInformation = {}; // 当前账本信息
  @observable accountCount = 0; // 新增账户数量
  @observable transactionCount = 0; // 新增交易数量
  @observable userTable = [];
  @observable algorithms = [];
  @observable pageTotal = 3
  @observable pageIndex = 1;
  @observable pageSize = 10;
  @observable count = 0;
  @observable tableData = [];
  @observable __HOST = 'http://localhost:8000/';
  @observable errorMessage = ''; // 错误信息

  @autobind
  @action
  getUserTable() {
    this.userTable && this.userTable.map((item, key) => {
      item['pubKey']['algorithm'] = tranBase58(item['pubKey']['value']);
    });
    console.log(this.userTable);
    return this.userTable;
  }

  // 获取区块高度
  @autobind
  @action
  getBlockHeight() {
    fetchData(`${G_WEB_DOMAIN}/ledgers/${localStorage.defaultValue}/blocks/latest`,
      this.setBlockHeight,
      '', { 
        method: 'get',
        headers: {
          cookie: document.cookie,
        } 
      }
    ).catch(error => {
      console.log(error);
    });
  }

  @autobind
  @action
  setBlockHeight(result) {
    let response = result;
    this.overviewHeadData.blockHeight = response && response.data && response.data.height ? response.data.height : 0; 
  }

  // 获取交易总数
  @autobind
  @action
  getTransactionTotal() {
    fetchData(`${G_WEB_DOMAIN}/ledgers/${localStorage.defaultValue}/txs/count`,
      this.setTransactionTotal,
      '', { 
        method: 'get',
        headers: {
          // accept: 'application/json',
          cookie: document.cookie,
        } 
      }
    ).catch(error => {
      console.log(error);
    });
  }

  @autobind
  @action
  setTransactionTotal(result) {
    let response = result;
    this.overviewHeadData.transactionTotal = response && response.data ? response.data : 0; 
  }

  // 获取用户总数
  @autobind
  @action
  getUserTotal() {
    fetchData(`${G_WEB_DOMAIN}/ledgers/${localStorage.defaultValue}/users/count`,
      this.setUserTotal,
      '', { 
        method: 'get',
        headers: {
          // accept: 'application/json',
          cookie: document.cookie,
        } 
      }
    ).catch(error => {
      console.log(error);
    });
  }

  @autobind
  @action
  setUserTotal(result) {
    let response = result;
    this.overviewHeadData.userTotal = response && response.data ? response.data : 0; 
  }

  // 获取数据账户总数
  @autobind
  @action
  getLedgerTotal() {
    fetchData(`${G_WEB_DOMAIN}/ledgers/${localStorage.defaultValue}/accounts/count`,
      this.setLedgerTotal,
      '', { 
        method: 'get',
        headers: {
          // accept: 'application/json',
          cookie: document.cookie,
        } 
      }
    ).catch(error => {
      console.log(error);
    });
  }

  @autobind
  @action
  setLedgerTotal(result) {
    let response = result;
    this.overviewHeadData.dataLedgersTotal = response && response.data ? response.data : 0; 
  }

  // 合约总数
  @autobind
  @action
  getContractTotal() {
    fetchData(`${G_WEB_DOMAIN}/ledgers/${localStorage.defaultValue}/contracts/count`,
      this.setContractTotal,
      '', { 
        method: 'get',
        headers: {
          // accept: 'application/json',
          cookie: document.cookie,
        } 
      }
    ).catch(error => {
      console.log(error);
    });
  }

  @autobind
  @action
  setContractTotal(result) {
    let response = result;
    this.overviewHeadData.contractTotal = response && response.data ? response.data : 0;
  }

  // 获取成员列表
  @autobind
  @action
  getUserList() {
    fetchData(`${G_WEB_DOMAIN}/ledgers/${localStorage.defaultValue}/participants`,
      this.setUserList,
      '', { 
        method: 'get',
        headers: {
          // accept: 'application/json',
          cookie: document.cookie,
        } 
      }
    ).catch(error => {
      console.log(error);
    });
  }

  @autobind
  @action
  setUserList(result) {
    if (result.success) {
      let response = result && result.data ? result.data : [];
      this.algorithms = [];
      this.userTable = [...response];
      console.log(response);
      response && response.map((item, key) => {
        this.algorithms.push(tranBase58(item['pubKey']['value']));
      });
    } else {
      let error = result && result.error ? result.error : {};
      this.errorMessage = error && error.errorMessage ? error.errorMessage : '';
    }
    debugger;
  }

  // 获取当前账本信息
  @autobind
  @action
  getLedgerCurrent() {
    fetchData(`${G_WEB_DOMAIN}/ledgers/${localStorage.defaultValue}`,
      this.setLedgerCurrent,
      '', { 
        method: 'get',
        headers: {
          // accept: 'application/json',
          cookie: document.cookie,
        } 
      }
    ).catch(error => {
      console.log(error);
    });
  }

  @autobind
  @action
  setLedgerCurrent(result) {
    let response = result && result.data ? result.data : {};
    console.log(response);
    this.ledgerInformation = {...response};
    console.log(this.ledgerInformation);
  }

  // 获取新增交易数量
  @autobind
  @action
  getNewTransaction() {
    fetchData(`${G_WEB_DOMAIN}/ledgers/${localStorage.defaultValue}/txs/additional-count`,
      this.setNewTransaction,
      '', { 
        method: 'get',
        headers: {
          // accept: 'application/json',
          cookie: document.cookie,
        } 
      }
    ).catch(error => {
      console.log(error);
    });
  }

  @autobind
  @action
  setNewTransaction(result) {
    console.log(result);
    let response = result && result.data ? result.data : 0;
    this.transactionCount = response;
  }

  // 获取新增账户数量
  @autobind
  @action
  getNewLedger() {
    fetchData(`${G_WEB_DOMAIN}/ledgers/${localStorage.defaultValue}/accounts/additional-count`,
      this.setNewLedger,
      '', { 
        method: 'get',
        headers: {
          // accept: 'application/json',
          cookie: document.cookie,
        } 
      }
    ).catch(error => {
      console.log(error);
    });
  }

  @autobind
  @action
  setNewLedger(result) {
    let response = result && result.data ? result.data : 0;
    this.accountCount = response;
  }
}