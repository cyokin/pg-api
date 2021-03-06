/**
 * Module Name:
 * Project Name: LinkFuture.pg-api
 * Created by Cyokin on 4/10/2017
 */

const $pgHelper = require('./../../lib/pg/pg-helper')(global.$config.pg);
const $select = require('./../resource/pg/select.json');
const $select_group = require('./../resource/pg/select_group.json');

describe('Unit Test -- pg/pg-helper.js',function () {
    describe('Select', ()=> {
        it('$select', (done)=> {
            $pgHelper.select("user",$select)
                .then(function (r) {
                        $logger.info(JSON.stringify(r));
                        r.should.be.a.object;
                        r.data.should.have.length.above(0)
                        $assert(r.pager.total>0)
                        done();
                    }
                ).catch($myUtil.errorBack("$select",done));
        });
        it('$selectOne', (done)=> {
            $pgHelper.selectOne("user",$select)
                .then(function (r) {
                        $logger.info(JSON.stringify(r));
                        r.should.be.a.object;
                        done();
                    }
                ).catch($myUtil.errorBack("$selectOne",done));
        });
        it('$select_group', (done)=> {
            $pgHelper.select("user",$select_group)
                .then(function (r) {
                        $logger.info(r);
                        r.should.be.a.object;
                        done();
                    }
                ).catch($myUtil.errorBack("$select_group",done));
        });
        it('$selectById', (done)=> {
            $pgHelper.selectById("user",2)
                .then(function (r) {
                        $logger.info(r);
                        r.should.be.a.object;
                        done();
                    }
                ).catch($myUtil.errorBack("$selectById",done));
        });

        it('getSchema', async ()=> {
            const schema = await $pgHelper.getSchema();
            schema.tables.user.should.be.a.object;
            schema.tables.user.primary_key.should.have.length.same(1);
            schema.composites.type_struct.should.be.a.object;
            schema.enums.type_gender.columns.should.have.length.same(2);
            schema.functions.f_check_error.should.be.a.object;
            $expect(schema.functions.f_check_error.dataType).to.equal("boolean")
            $expect(schema.functions.f_check_error.arguments.issuccess.type).to.equal("boolean")
            $expect(schema.functions.f_check_error.arguments.issuccess.default).to.equal(undefined)
            $expect(schema.functions.f_check_error.arguments.error.type).to.equal('character')

            $expect(schema.functions.f_empty.dataType).to.equal("boolean")
            $expect(schema.functions.f_empty.arguments.$param1.type).to.equal("boolean")
            $expect(schema.functions.f_empty.arguments.$param1.default).to.equal(undefined)
            $expect(schema.functions.f_empty.arguments.$param2.type).to.equal("boolean")
            $expect(schema.functions.f_empty.arguments.$param2.default).to.equal("true")

            $expect(schema.functions.f_table.arguments._company_id.type).to.equal("integer")
            $expect(schema.functions.f_table.arguments._company_id.default).to.equal("1")

        });

        it('functions email', async ()=> {
            let ans = await $pgHelper.func("f_check_email",["test@hotmail.com"]);
            ans.should.have.length.above(0);
            $expect(ans[0].f_check_email).to.equal(true)

            ans = await $pgHelper.func("f_check_email",{email:"test@hotmail.com"});
            ans.should.have.length.above(0);
            $expect(ans[0].f_check_email).to.equal(true)

            ans = await $pgHelper.func("f_table",{_company_id:2,_user_id:1});
            ans.should.have.length.above(0);
            $expect(ans[0].account_id).to.equal(1)

            ans = await $pgHelper.func("f_table",{company_id:2,user_id:1});
            ans.should.have.length.above(0);
            $expect(ans[0].account_id).to.equal(1)
        });

        it('functions exception', async ()=> {
            try{
               await $pgHelper.func("f_check_email1",["test@hotmail.com"])
               throw new Error("expect throw no f_check_email1 exist error here")
            }
            catch (ex){
                $expect(ex.message).to.equal("specific function f_check_email1 does not exist")
            }
        });

        it('functions f_table', async ()=> {
            const ans = await $pgHelper.func("f_table", [1,999]);
            ans.should.have.length.above(0);
            $expect(ans[0].account_id).to.equal(1)
        });

        // it('functions f_cursor', async ()=> {
        //     let results = {};
        //     const ans = await $pgHelper.func("f_cursor",[results,1]);
        //     ans.should.have.length.above(0);
        //     $expect(ans[0].account_id).to.equal(1)
        // });
    });
});
