/**
 * Module Name:
 * Project Name: LinkFuture.pg-api
 * Created by Cyokin on 4/10/2017
 */

const $json2Sql = require('./../../lib/pg/json-sql');
const $pgHelper = require('./../../lib/pg/pg-helper')(global.$config.pg);

const $where = require('./../resource/pg/where.json');
const $select = require('./../resource/pg/select.json');
const $select_group = require('./../resource/pg/select_group.json');

describe('Unit Test -- pg/json-sql.js',function () {
    describe('json-sql', ()=> {
        it('buildSelect', (done)=> {
            $pgHelper.getSchema()
                .then(schema=>{
                    let select = $json2Sql.buildSelect(schema.tables.user,$select);
                    $logger.info("buildSelect",JSON.stringify(select));
                    done()
                })
                .catch($error("query failed",done));
        });
        it('buildSelectGroup', (done)=> {
            $pgHelper.getSchema()
                .then(schema=>{
                    let select = $json2Sql.buildSelect(schema.tables.user,$select_group);
                    $logger.info("buildSelectGroup",JSON.stringify(select) );
                    done()
                })
                .catch($error("query failed",done));
        });
    });
});