const chai = require("chai");
const chaiHttp = require("chai-http");

process.argv[2] = false;
const app = require("../server");

chai.use(chaiHttp);
chai.should();

const request = chai.request(app);

describe("Service endpoints", () => {

    it("Should return service name in json", (done) => {
        request
            .get("/")
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a("object");
                res.body.should.have.property("service");
                res.body.service.should.equal("auth");
                done();
            });
    });

});