const chai = require("chai");
const chaiHttp = require("chai-http");

process.argv[2] = false;
const app = require("../server");
const jwt = require("../lib/jwt");

chai.use(chaiHttp);
chai.should();

const request = chai.request(app);

describe("JWT Tests", () => {

    it("Should return a valid JWT", (done) => {

        const token = jwt.sign("test", {isValid: true});
        const varified = jwt.verify("test", token);

        varified.should.have.property("isValid");
        varified.isValid.should.equal(true);

        done();
    });

    it("Should refresh token without errors", (done) => {
        const token = jwt.sign("test", {isValid: true});

        const refreshed = jwt.refresh("test", token);
        const verified = jwt.verify("test", refreshed);

        verified.should.have.property("isValid");
        verified.isValid.should.equal(true);
        verified.should.have.property("exp");
        verified.should.have.property("iat");
        
        done();
    });

});

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