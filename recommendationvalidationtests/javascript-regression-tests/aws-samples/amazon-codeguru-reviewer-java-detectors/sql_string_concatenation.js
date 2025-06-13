//  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: Apache-2.0

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', {
    dialect: 'sqlite',
    storage: 'data/juiceshop.sqlite',
    username: 'username',
    password: 'password'
});

const { QueryTypes } = require('sequelize');

//{fact rule=sql_string_concatenation_js_rule@v1.0 defects=1}
function non_conformant(){

    var username = "userOne";
    var password = "passOne";
    var query = "INSERT INTO user (username, password) VALUES("+ username + "','" + password + "')"
    sequelize.query(query)
}

// {/fact}

//{fact rule=sql_string_concatenation_js_rule@v1.0 defects=0}
async function conformant(){
    const Sequelize = require('sequelize');
    const sequelize = new Sequelize('database', {
    dialect: 'sqlite',
    storage: 'data/juiceshop.sqlite',
    username: 'username',
    password: 'password'
    });
    await sequelize.query(
        'SELECT *, "text with literal $$1 and literal $$status" as t FROM projects WHERE status = $1',
        {
          bind: ['active'],
          type: QueryTypes.SELECT
        }
    );
}

// {/fact}