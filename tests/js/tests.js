import { userModel } from 'user-model';
import { request } from 'requester';
import { validator } from 'validator';

 mocha.setup('bdd');

 let expect = chai.expect;

 describe('User Model Tests', function () {
   describe('register() Tests', () => {
        let requester;
        let database = [];

        beforeEach(() => {
          requester = sinon.stub(request, 'post', (url, headers, data) => {
            return new Promise((resolve, reject) => {
              if (Object.keys(data).length === 2 && (data.username && data.password)) {
                resolve({ username: data.username });
                database.push(data);
              } else {
                reject(new Error('test'));
                //return;
              }
          });
        })
      });

        afterEach(() => {
          request.post.restore();
          database = [];
        });

        it('Expect user to be registered when valid username and password are passed. As response, an object with username should be returned.', function (done) {
          //arrange
          let user = {
            username: 'samvimes',
            password: '42'
          };

          //act & assert
          userModel.register(user)
            .then(response => {
              expect(response.username).to.equal(user.username);
            })
            .then(done, done);
        });


        it('Expect post method from requester should be called once, when user is registered', function(done) {
          //arrange
          let user = {
            username: 'samvimes',
            password: '42'
          };

          //act & assert
          userModel.register(user)
            .then(response => {
              expect(request.post.calledOnce).to.be.true;
            })
            .then(done, done);
        });

        it('Expect user to be added in database after valid registration', function (done) {
          let user = {
            username: 'samvimes',
            password: '42'
          };

          //act & assert
          userModel.register(user)
            .then(response => {
              expect(database.length).to.equal(1);
              expect(database[0].username).to.equal(user.username);
            })
            .then(done, done);
        });
    });

    describe('login() Tests', () => {
      const authToken = '1r2a3n4d5o6m7t8o9k1e2n',
        database = [
          {
            username: 'samvimes',
            password: '42'
          },
          {
            username: 'nobbynobbs',
            password: 'not42'
          }
        ];

      beforeEach(() => {
        sinon.stub(request, 'post', (url, headers, data) => {
          return new Promise((resolve, reject) => {
            let isUserFound = database.some(user => user.username === data.username && user.password === data.password);

            if (isUserFound && Object.keys(data).length === 2 && (data.username && data.password)) {
              resolve({
                username: 'samvimes',
                id: 42,
                authToken
              });
            } else {
              reject(new Error('Error'));
            }
          });
        });
      });

      afterEach(() => {
        localStorage.clear();
        request.post.restore();
      });

      // it('Expect when a user is trying to log in with valid data, to return object with username, id and authtoken', function(done) {
      //   let user = {
      //     username: 'username',
      //     password: '123456'
      //   };
      //
      //   userModel.login(user)
      //     .then(response => {
      //       expect(response.username).to.equal(user.username);
      //       expect(response.id).to.exist;
      //       expect(response.authToken).to.exist;
      //     })
      //     .then(done, done);
      // });
      //
      // it('Expect when a user is trying to log in with invalid data, to cause error', done => {
      //   let user = {
      //     username: 'lordvetinari',
      //     password: 'possibly42'
      //   };
      //
      //   userModel.login(user)
      //     .then(response => done(new Error()),
      //     reject => done());
      // });

      // it('Login with invalid creadentials should cause error', done => {
      //   let userData = {};
      //
      //   app.userModel
      //     .loginUser(userData)
      //     .then(response => done(new Error()),
      //     reject => done());
      // });
    });

    describe('logout() Tests', function(done){
      beforeEach(() => {
        localStorage.setItem('AUTH_TOKEN', '123456789');
        localStorage.setItem('USERNAME', 'samvimes');
        localStorage.setItem('ID', '42');
      })


      it('Expect localStorage to be cleared when user is loged out', function(done){
        //arrange
        let expectedLocalStorage = {};

        //act & assert
        userModel.logout()
          .then(() => {
            expect(localStorage).to.be.eql(expectedLocalStorage);
          })
          .then(done, done);
      })
    });

    describe('current() Tests', function(done){
      beforeEach(() => {
        localStorage.setItem('AUTH_TOKEN', '123456789');
        localStorage.setItem('USERNAME', 'samvimes');
        localStorage.setItem('ID', '42');
      })

      afterEach(() => {
        localStorage.clear();
      })

      it('Expect localStorage to be set with username, id and authtoken', function(){
        //arrange
        let user = {
          username: 'samvimes',
          id: '42',
          authToken: '123456789'
        }

        //act & assert
        expect(localStorage.getItem('AUTH_TOKEN')).to.equal(user.authToken);
        expect(localStorage.getItem('ID')).to.equal(user.id);
        expect(localStorage.getItem('USERNAME')).to.equal(user.username);
      })
    });
 });

  describe('Validator Tests', function () {

    describe('validateUsername(username) Tests', function (){
      it('Expect to return true when string with valid length is passed', function(){
        let string = 'ValidString';

          let isValid = validator.validateUsername(string);

        expect(isValid).to.be.equal(true);

      });

      it('Expect to return false when string with invalid length is passed', function(){
        let string = 'as';

          let isValid = validator.validateUsername(string);

        expect(isValid).to.be.equal(false);

      });

    });

    describe('validateNames(firstName, lastName) Tests', function (){
      it('Expect to return true when both strings are with the right length and right format', function(){
        let firstName = 'John',
            lastName = 'Snow';

          let isValid = validator.validateNames(firstName, lastName);

        expect(isValid).to.be.equal(true);

      });

      it('Expect to return false when one of the strings is with valid length but in invalid format', function(){
        let firstName = 'john42',
            lastName = 'Snow';

          let isValid = validator.validateNames(firstName, lastName);

          expect(isValid).to.be.equal(false);

      });

      it('Expect to return false when one of the strings is with invalid length', function(){
        let firstName = '',
            lastName = 'Snow';

          let isValid = validator.validateNames(firstName, lastName);

          expect(isValid).to.be.equal(false);

        });

      });

      describe('validateEmail(email) Tests', function (){
        it('Expect to return true when an email in valid format is passed', function(){
          let email = 'email@test.com';

            let isValid = validator.validateEmail(email);

          expect(isValid).to.be.equal(true);

          });

          it('Expect to return false when an email in invalid format is passed', function(){
            let email = 'email';

              let isValid = validator.validateEmail(email);

            expect(isValid).to.be.equal(false);

          });
      });

  });

mocha.run();
